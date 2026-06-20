---
title: '分块模块化 i18n 配置指南'
published: 2026-06-20
description: '详解如何将组件或局部模块的 i18n 从全局解耦，建立独立的本地化语言分块，并由核心引擎自动收集合并。'
sidebar_position: 9
---

# 分块模块化 i18n 配置指南

随着博客功能的增多，新增组件（例如 `JsPlayground` 演练场）的多语言词条如果不加节制地塞进全局 `src/i18n/i18nKey.ts` 和各个语言包（如 `zh_CN.ts`、`en.ts`）中，会导致全局配置变得非常臃肿，且不利于组件的独立维护与移植。

为了解决这个问题，本项目设计了**分块模块化（Partials） i18n 机制**。你可以将特定组件或模块的语言包物理隔离在其独立的目录中，由 `translation` 引擎在编译时自动搜集并合并，在享有全局多语言回退（Fallback）的同时，实现真正的“即插即用”。

---

## 核心机制与架构

所有的模块化 i18n 分布在 `src/i18n/partials/` 文件夹下。

```text
src/i18n/
  ├── i18nKey.ts             # 全站通用 Key 定义 (如 home, about, archive)
  ├── languages/             # 全站通用翻译文件 (如 zh_CN.ts, en.ts)
  ├── translation.ts         # 统一合并与查询引擎
  └── partials/              # 【模块化分块目录】
      └── [your-module]/     # 你的模块/组件目录 (例如 js-playground)
          ├── keys.ts        # 该组件专用的 Keys 声明
          ├── zh_CN.ts       # 专属的中文翻译
          ├── en.ts          # 专属的英文翻译
          └── ...            # 其它语言包
      └── [group]/[widget]/  # ✨ 支持任意深度的多级嵌套目录！
          ├── keys.ts        # 将会自动获得 `[group/widget]` 前缀
          └── zh_CN.ts
```

`src/i18n/translation.ts` 会通过 Vite 的 `import.meta.glob` 自动扫描 `languages/*.ts` 以及 `partials/*/*.ts`。在 Merge (合并) 时，系统会校验并合并它们：

1. **编译期自动前缀**：本项目内置了一个自定义 Vite 插件 `i18nKeyPrefixPlugin`。对于 `partials/[folderName]/keys.ts` 中定义的 Key，插件会在编译期（Build/Dev）**自动为其字符串值加上 `[folderName]` 前缀**。系统完全支持**任意深度**的嵌套目录，例如 `partials/aa/bb/keys.ts` 导出的值将被自动转换为 `[aa/bb]xxx`。开发者在编写时只需定义极简字符串，无需手动拼写前缀。
2. **安全与校验**：合并时，系统会精准截取相对路径校验最终收到的 Key 是否以 `[相对目录名]` 开头。全局 Key（`languages/` 下）则**绝对不允许以中括号 `[...]` 开头**，否则会报错拦截，以此保证命名空间的绝对安全和隔离。

---

## 配置步骤

以一个名为 `my-widget` 的新组件为例，展示如何为其配置独立的多语言：

### 第一步：创建分块目录与 Keys

在 `src/i18n/partials/` 下创建名为 `my-widget` 的目录，并在其下新建 `keys.ts`，导出专属于该组件的枚举（Enum）。**你只需要定义最简单的字符串，无需手动添加任何前缀**：

```typescript
// src/i18n/partials/my-widget/keys.ts
export enum MyWidgetKey {
    title = "myWidgetTitle",
    description = "myWidgetDesc",
    buttonText = "myWidgetButton",
}
```

> [!TIP]
> 得益于内置的 Vite 插件，上述简单的字符串值在编译期会被自动转换为 `[my-widget]myWidgetTitle`。这让你在编写和使用时拥有最干净的代码体验。

### 第二步：创建对应的多语言翻译文件

在同级目录下，为你需要支持的语言创建 `.ts` 文件。例如中文 `zh_CN.ts`：

```typescript
// src/i18n/partials/my-widget/zh_CN.ts
import { MyWidgetKey } from './keys';

export const zh_CN = {
    [MyWidgetKey.title]: "我的自定义组件",
    [MyWidgetKey.description]: "这是一个物理隔离的局部多语言组件示例。",
    [MyWidgetKey.buttonText]: "点击我",
};
```

### 第三步：在组件中使用

在组件中引入核心 `i18n` 函数与该组件的 Key 枚举。由于 Vite 插件在底层已经悄悄做好了前缀映射，你依然可以像使用普通枚举一样：

```tsx
// src/components/MyWidget.tsx
import React from 'react';
import { i18n } from '@/i18n/translation';
import { MyWidgetKey } from '@/i18n/partials/my-widget/keys';

interface Props {
    lang?: string;
}

export default function MyWidget({ lang }: Props) {
    // 直接传入 Key，调用非常干净优雅
    const t = (key: MyWidgetKey) => i18n(key, lang);


    return (
        <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-bold">{t(MyWidgetKey.title)}</h3>
            <p className="text-sm opacity-80">{t(MyWidgetKey.description)}</p>
            <button className="btn">{t(MyWidgetKey.buttonText)}</button>
        </div>
    );
}
```

---

## 多语言回退机制 (Fallback)

核心引擎 `i18n(key, lang)` 具备以下多重降级机制，哪怕某个翻译分块只提供了一部分语言，也能保证界面不会崩溃：

1. **精确匹配**：首先尝试读取指定语言（如 `en-US`）的对应 Key。
2. **语言降级**：若找不到，会尝试匹配该语言族的基本分支（如 `en`）。
3. **主语言降级**：若依然找不到，会退而查找网站设置的主语言（在 `src/config.ts` 中的 `siteConfig.lang` 指定，例如 `zh_CN`）的翻译。
4. **原始 Key 兜底**：如果主语言也没有该 Key，为了防止界面白屏或崩溃，将**直接输出 Key 的字面量字符串**。
