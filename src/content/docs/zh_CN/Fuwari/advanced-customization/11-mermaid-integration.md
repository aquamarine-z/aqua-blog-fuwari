---
title: "11. 集成 Mermaid 关系图表"
description: "深度定制：集成 Mermaid 渲染组件，支持在 Markdown/MDX 中按需加载并与主题同步地绘制流程图、时序图等。"
published: 2026-06-26
draft: false
sidebar_position: 11
---

# 🎨 集成 Mermaid 关系图表

在编写课程复习资料、算法解析或技术架构文章时，经常需要画出复杂的**关系网络图**（如关键路径 CPM 中的 AON/AOE 网络图、PWA 离线运行机制、或者软件系统架构）。

为了在不影响页面首屏性能的前提下优雅地展示这些图表，本项目引入了基于 **Mermaid** 的客户端按需加载方案。

---

## 🚀 为什么选用独立组件方案？

本博客没有采用“全局拦截所有 ```` ```mermaid ```` 代码块”的粗暴做法，而是专门封装了一个 `<Mermaid />` 组件。这样能带来以下优势：

1. **保留源码输出能力**：当你仅仅想把 Mermaid 的 DSL 源码作为一个标准代码块展示给读者学习时，直接写 ```` ```mermaid ```` 即可，它不会被强制渲染成图表。
2. **显式与精准可控**：只有当你显式调用 `<Mermaid code="..." />` 组件时，它才会被编译渲染为漂亮的 SVG 交互图表。
3. **零首屏 JS 性能开销**：通过在全局布局中实施**智能延迟加载 (Lazy-Loading)**，仅当页面中实际检测到图表节点时才会异步下载下载大体积的 Mermaid 依赖库。对于没有图表的普通文章，对性能的负面影响为 0。
4. **动态主题与路由同步**：完美集成 Fuwari 的 **Light/Dark 主题切换** 和 **Swup 单页无刷新路由**，能够随主题改变自动重新渲染图表配色。

---

## 📝 使用方法

由于该组件基于 Astro 组件，你必须将需要使用图表的 Markdown 文件后缀改为 **`.mdx`**。

### 1. 导入与基本调用
在 `.mdx` 文件的顶部导入组件，并将图表代码以**模板字符串**的形式传给 `code` 属性：

```mdx
import Mermaid from "@/components/Mermaid.astro";

<Mermaid code={`
flowchart TD
    Start([开始]) --> Process[图像像素化处理]
    Process --> Choice{检测色差匹配}
    Choice -- 误差大 --> DeltaE[使用 CIELAB Delta E 色差匹配]
    Choice -- 误差小 --> Save[保存原色]
    DeltaE --> End([导出图纸])
    Save --> End
`} />
```

> [!WARNING]
> **注意格式**：在传入 `code` 属性时，强烈建议使用 JS 的模板字符串 `code={`...`}`（用大括号包裹反引号），这样可以避免多行文本以及符号（如 `-->` 或 `{}`）触发 MDX 解析器的 JSX 语法转义错误。

---

## 🛠️ 底层设计与实现细节

为了满足高性能和 Swup 单页应用路由的高频无刷新切换，图表渲染分为两部分协作：

### 1. 骨架占位：`Mermaid.astro`
位于 [Mermaid.astro](file:///z:/development/projects/typescript/aqua-blog-fuwari/src/components/Mermaid.astro)。它在服务端仅输出一个轻量级容器和动画骨架屏：
```astro
---
interface Props {
  code: string;
}
const { code } = Astro.props;
---
<div class="mermaid-block flex justify-center my-4" data-mermaid-code={code}>
  <div class="animate-pulse bg-[var(--codeblock-bg)] rounded-xl w-full h-32 flex items-center justify-center text-sm text-[var(--text-color-light)]">
    Rendering diagram...
  </div>
</div>
```

### 2. 动态控制器：`Layout.astro` 中的全局脚本
位于 [Layout.astro](file:///z:/development/projects/typescript/aqua-blog-fuwari/src/layouts/Layout.astro) 底部。
* **DOM 扫描**：首先调用 `document.querySelectorAll(".mermaid-block")`，如果没有检测到图表节点，则直接 return，**不加载任何外部包**。
* **按需加载**：若存在节点，通过 `await import("mermaid")` 动态导入库，最大程度优化首屏。
* **状态观察 (Theme Sync)**：使用 `MutationObserver` 监听 `<html>` 节点的 `class` 变化。一旦监听到暗黑模式与明亮模式切换，自动将 `theme: 'dark'` 或 `'default'` 重新传入 Mermaid 并重新计算渲染所有处于活动状态的 `.mermaid-block`，同时将当前的渲染状态标记在 `data-rendered-theme` 属性中防止重复计算。
* **SPA 路由重连**：由于页面切换由 Swup 托管，在 `window.swup.hooks.on("page:view", setupMermaid)` 挂载监听器，确保每次切换至新页面时图表都能自动加载并运行。
