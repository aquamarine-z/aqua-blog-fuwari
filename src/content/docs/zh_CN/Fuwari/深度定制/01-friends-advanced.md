---
title: 01 友链高级定制：Icon与Tag系统
published: 2026-06-15
description: 详细介绍如何为友情链接自定义社交图标、创建全新的标签 (Tag)、以及标签的国际化与 Fallback 策略机制。
tags: [深度定制, 友情链接, i18n]
category: 深度定制
---

# 友情链接高级定制：Icon与Tag系统全解

在掌握了基础的友链配置后，你可能希望深度定制你的友链系统。例如：为某个小众的社交媒体平台设置专属的 Icon，或是创造一个属于你自己圈子的专属 Tag 并支持多国语言。

本篇指南将带你从源码级别掌握这些高级玩法。

## 1. 链接 Icon 的智能匹配与自定义

默认情况下，Fuwari 的友情链接卡片会根据你配置的 `name` 字段，**智能匹配**相应的 Icon。
这个智能匹配逻辑写在 `src/components/FriendCard.astro` 中：

```typescript
const getIconName = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('github')) return 'fa6-brands:github';
    if (lower.includes('blog')) return 'fa6-solid:blog';
    if (lower.includes('line')) return 'fa6-brands:line';
    return 'material-symbols:link-rounded'; // 默认通用链接图标
};
```

### 如何覆盖默认匹配设置自定义 Icon？

由于最新版对底层进行了支持拓展，如果你想使用特定的图标，可以直接在 `src/config.ts` 的 `links` 数组中加上 `icon` 字段。只要配置了 `icon` 字段，它就会覆盖智能匹配的结果！

```typescript
{
    name: 'Bilibili', 
    icon: 'fa6-brands:bilibili', // 手动指定 Icon（从 iconify 寻找）
    link: 'https://space.bilibili.com/...'
}
```
*提示：你可以前往 [Icones](https://icones.js.org/) 查找任何你想要的图标，复制其标识符填入即可。*

---

## 2. 标签 (Tag) 的创建与颜色定制

好友卡片上的那些彩色小标签是由两部分构成的：**颜色配置** 和 **多语言翻译键值 (i18n Key)**。

### 第一步：分配颜色
打开 `src/components/FriendCard.astro`，找到 `labelColors` 配置对象：
```typescript
const labelColors: Record<string, string> = {
    "tag.friend": "bg-[oklch(0.85_0.15_160)]",
    // ...
    "tag.myNewTag": "bg-[oklch(0.85_0.15_300)]", // 在这里新增你的标签及其 Tailwind 背景颜色类
};
```

### 第二步：注册 i18n Key
因为标签是支持多国语言的，你需要给它注册一个合法的 `I18nKey`。
打开 `src/i18n/i18nKey.ts`，在枚举中新增你的 Key：
```typescript
enum I18nKey {
    // ...
    tagFriend = 'tag.friend',
    tagMyNewTag = 'tag.myNewTag', // 注册你的新标签
}
```

---

## 3. Tag 的国际化 (i18n) 方法与 Fallback 策略

仅仅注册 Key 和颜色还不够，我们还需要告诉系统，这个标签在中文、英文、日文等环境下分别应该显示什么文字。

### 配置翻译字典
进入 `src/i18n/languages/` 目录，这里存放了所有的语言配置文件（如 `zh_CN.ts`, `en.ts` 等）。

在你的**主语言**（如 `zh_CN.ts`）中加入翻译：
```typescript
import I18nKey from "../i18nKey";
import type { Translation } from "../translation";

export const zh_CN: Translation = {
    // ...
    [I18nKey.tagMyNewTag]: "我的新圈子", 
};
```

如果你支持英文 (`en.ts`)，也可以同步添加：
```typescript
    [I18nKey.tagMyNewTag]: "My New Circle", 
```

### 深入解析：Tag 国际化 Fallback (回退) 策略

在实际维护多语言站点时，如果你新增了一个标签，却**忘记**给某一种语言（比如法语 `fr.ts`）添加翻译，会导致页面崩溃吗？

**不会。**
Fuwari 的底层 i18n 系统 (`src/i18n/translation.ts`) 实现了一套强大且严格的 **Fallback（降级回退）策略**：

1. **优先查找当前语言**：当你访问法语页面时，系统首先去 `fr.ts` 里面寻找 `tag.myNewTag` 对应的翻译。
2. **回退主语言 (siteConfig.lang)**：如果在 `fr.ts` 里面找不到翻译，系统会自动去你的主语言（在 `src/config.ts` 中配置的 `siteConfig.lang`，例如 `zh_CN`）中寻找对应的翻译，并暂时显示主语言的文字。
3. **报错保障 (Strict Error)**：但是，如果系统发现连你的**主语言配置**中都缺失了这个词条的翻译，它会直接在终端抛出一个 `Error: i18n key 'xxx' not found in main language`。这个策略能强制保障你不会在网站上留下一个空白或者 `undefined` 的尴尬标签！

正因为有了这套机制，你可以放心地在主语言中创建各种 Tag，并在有闲暇时间时慢慢补全其他小语种的翻译！
