---
title: "🧩 5. MDX 与客户端激活 (MDX & Hydration)"
published: 2026-06-15
description: "AI 指南：MDX 组件渲染原理与 client: 指令的水合时序。"
sidebar_position: 5
---

# AI 协作参考：MDX 与客户端激活

## 📌 Context & Rules

- **Inserting Components**: If you are asked to insert a React/Vue/Svelte UI component into a post or documentation, you MUST use an `.mdx` file, not `.md`. You must `import` the component immediately below the frontmatter block.
- **Hydration is Required**: Because Astro uses a Zero-JS by default architecture, UI framework components embedded in `.mdx` files are rendered as static HTML without event listeners. If the component has interactivity (e.g., `onClick`, state hooks), you MUST append an Astro client directive like `client:load`, `client:idle`, or `client:visible` when calling it (e.g., `<MyComponent client:load />`), otherwise the interactivity will completely fail.
