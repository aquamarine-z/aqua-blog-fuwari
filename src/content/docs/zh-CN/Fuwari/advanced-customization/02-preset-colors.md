---
title: '修改主题预设颜色环'
published: 2026-06-15
description: '详解如何通过配置文件自定义网站的主题色切换列表，并支持国际化名称匹配。'
sidebar_position: 2
---

# 修改主题预设颜色环

Fuwari 在页面右上角的显示设置面板中，默认提供了一个“调色环”（由五个不同颜色的圆形按钮组成）。访客可以通过点击不同的圆圈，将整个网站的按钮、链接、背景等口音色 (Accent Color) 切换成自己喜欢的颜色。

在对框架进行二次开发升级后，你现在可以**直接通过 `config.ts` 和多语言字典**来高度定制这个调色环的颜色数量、具体色值以及它们的名字！

## 第一步：配置预设色值 (Hue)

网站的主题色采用 HSL / Oklch 颜色空间，核心变化参数是 `Hue` (色相)，取值范围从 0 到 360。

打开项目根目录下的 `src/config.ts`，在 `siteConfig.themeColor` 下找到 `colors` 数组：

```javascript
// src/config.ts
export const siteConfig: SiteConfig = {
  // ...
  themeColor: {
    hue: 300, 
    fixed: false, 
    // ⬇️ 修改这个数组，填入你想要的 HUE 值
    colors: [0, 180, 250, 300, 340], 
  },
}
```

你可以随意增加或删减数组内的色相值。例如只保留两个颜色：`colors: [100, 200]`。

## 第二步：配置颜色的多语言名称

只改了颜色值还不够，还需要为它们命名。
我们在多语言字典中设计了智能的安全降级回退机制。打开语言字典文件，例如中文版的 `src/i18n/languages/zh-CN.ts`：

```typescript
// src/i18n/languages/zh-CN.ts
export const zh_CN: Translation = {
    // ...
    // ⬇️ 新增对应的名称数组，长度必须和 config.ts 中的 colors 数组一致！
    [Key.themeColorNames]: ['炽焰红', '海蓝', '紫罗兰', '洋红', '玫瑰'],
}
```

接着，别忘了在其他语言文件（如 `en.ts`）中也加入对应的翻译版本：
```typescript
    [Key.themeColorNames]: ['Crimson', 'Aqua', 'Indigo', 'Violet', 'Rose'],
```

## 第三步：开启或关闭自定义无级调色条

除了预设的五个按钮，我们还为你带来了一个支持毫秒级顺滑拖拽的**彩虹渐变色自定义滑动条**！如果开启，访客可以通过拖拽任意改变网站主题色。

在 `config.ts` 中，通过控制 `customHue` 属性来决定是否显示这个功能：

```javascript
// src/config.ts
export const siteConfig: SiteConfig = {
  // ...
  themeColor: {
    hue: 250, 
    fixed: false, 
    colors: [0, 180, 250, 300, 340], 
    customHue: true, // ⬇️ 设为 true 显示滑动条，设为 false 隐藏滑动条
  },
}
```

开启后，对应的文字描述也支持国际化（通过语言文件中的 `[Key.customHue]` 控制）。

## 智能容错与降级回退策略

如果你的网站有多语言，但你只在 `zh-CN.ts` 中配置了名称，而忘记了配置 `en.ts`，或者你在 `en.ts` 中写的数组长度和 `config.ts` 里面的色相数量对不上，会发生什么？

> [!NOTE]
> **技术原理解析：渲染容错机制**
> 在 `src/components/widget/DisplaySettings.svelte` 底层渲染面板时，系统会执行两道严格的降级防线：
> 1. **主语言兜底**：系统会优先检查当前语言字典中的 `themeColorNames` 数组长度是否与配置的颜色数量完美匹配。如果不匹配或不存在，它会自动去抓取 `siteConfig.lang` (通常是 `zh-CN`) 里的内容来兜底。
> 2. **极致生存**：如果在连主语言里也找不到完全匹配的数组，为了不导致前端面板崩溃，系统会直接生成通用的编号代号进行极致兜底（例如自动渲染为 `Color 1`, `Color 2`...）。

这就意味着，你哪怕乱改配置文件，前端显示面板也会极力维持正常运作。这就是改造后配置系统的健壮性所在！
