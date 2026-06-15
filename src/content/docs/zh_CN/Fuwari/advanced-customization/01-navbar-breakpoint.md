---
title: '修改全局 Titlebar 折叠断点'
published: 2026-06-15
description: '详解如何通过 Tailwind CSS 修改顶部导航栏（Titlebar/Navbar）进入手机模式的触发宽度。'
sidebar_position: 1
---

# 修改全局 Titlebar 折叠断点

在本项目中，顶部的全局导航栏（Titlebar/Navbar）控制着整个网站在桌面端和移动端两种模式之间的切换。当屏幕宽度小于设定值时，中间的文字链接会被隐藏，右侧会展示出一个“汉堡包”下拉菜单按钮，也就是进入了**手机模式**。

本指南将教你如何修改这个“折叠断点”的宽度（例如，目前我们已将其定制为 `1143px`）。

## 原理机制

在默认情况下，该行为是通过 Tailwind CSS 的基础断点修饰符 `md:` (Medium，即 768px) 硬编码控制的：
- 在 `src/components/Navbar.astro` 中，通过 `<div class="hidden nav:flex">` （原本为 `md:flex`）控制文字链接。
- 汉堡包按钮由 `<button class="... nav:!hidden">`（原本为 `md:!hidden`）控制。

为了实现只修改 Titlebar 触发宽度，而不破坏页面其余依赖 `md` 的默认排版结构，我们需要引入一个**自定义断点**。

## 修改步骤

### 第一步：在 Tailwind 配置文件中追加专属断点

打开项目根目录下的 `tailwind.config.mjs`，在 `theme.extend.screens` 下增加一个专门为导航栏定制的参数，这里命名为 `nav`，并设置宽度为 `1143px`。

```javascript
// tailwind.config.mjs
export default {
  // ...
  theme: {
    extend: {
      screens: {
        nav: "1143px",
      },
      // ...
    }
  }
}
```

### 第二步：在相关组件中替换 `md:` 为 `nav:`

目前总共涉及到两个核心组件需要修改：

1. **`src/components/Navbar.astro`**：
   将包含菜单的容器的 `md:flex` 修改为 `nav:flex`，将汉堡按钮的 `md:!hidden` 修改为 `nav:!hidden`。
2. **`src/components/widget/NavMenuPanel.astro`**：
   这个文件控制的是折叠后弹出的下拉面板框。找到最外层包含 `md:hidden` 的 `div`，将其修改为 `nav:hidden`。

完成以上修改后，重启开发服务器或者重新构建项目，就可以看到你的 Titlebar 现在会在 `1143px` 时准时切换到手机模式了！
