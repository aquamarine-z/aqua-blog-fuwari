---
title: '优雅发布新的文章'
published: 2026-06-15
description: '了解如何在 Fuwari 中发布新文章及其高级配置选项'
sidebar_position: 1
---

# 优雅发布新的文章

在 Fuwari 博客系统中，发布新文章非常简单，同时又提供了极其丰富的扩展能力。无论是平铺的博客 (Blog)，还是层级化的文档 (Docs)，或是独立的单页 (Spec)，第一步都是创建 Markdown 文件。

## 基础操作

1. **新建文件**：在对应的目录下（如 `src/content/blog/` 或 `src/content/docs/`），创建一个扩展名为 `.md` 或 `.mdx` 的文件。
2. **填写 Frontmatter**：文件的顶部必须包含 YAML 格式的元数据（Frontmatter），由 `---` 包裹。

### 必填字段
```yaml
---
title: '你的文章标题'
published: 2024-01-01
---
```

## 进阶配置项

为了让文章展现出最好的效果，框架提供了一系列可选的 Frontmatter 字段：

- `description`: 文章摘要，会显示在博客列表页的卡片上。
- `image`: 封面大图的相对路径或 URL，极大提升卡片的视觉表现力。
- `tags`: 数组形式的标签（如 `[Astro, 教程]`），系统会自动生成标签云和归档。
- `category`: 文章分类，支持多级层级结构。
- `draft`: 设置为 `true` 则为草稿，仅在本地开发环境中可见，打包后会自动隐藏。
- `sidebar_position`: 在 Docs 模式下专用，控制左侧菜单栏的绝对排序。

## MDX 带来的无穷可能

如果你使用 `.mdx` 格式，不仅能使用传统的 Markdown 语法，还能直接在文章里嵌入 React/Svelte/Astro 等框架的互动组件。例如可以直接在文章中渲染一个自适应 SVG 图表或是交互式按钮，极大地拓宽了内容表达的边界！
