---
title: "5. MDX 与客户端激活 (MDX & Hydration)"
published: 2026-06-15
description: "AI 指南：MDX 组件渲染原理与 client: 指令的水合时序。"
sidebar_position: 5
---
本文档规范了在文档和文章中嵌入交互式组件时必须遵循的 MDX 规则与客户端激活（Hydration）指令，以供 AI 在修改时参考。

``````text
# AI Collaboration Reference: MDX & Client Hydration

## Context & Rules

- **Inserting Components**: If you are asked to insert a React/Vue/Svelte UI component into a post or documentation, you MUST use an `.mdx` file, not `.md`. You must `import` the component immediately below the frontmatter block.
- **Hydration is Required**: Because Astro uses a Zero-JS by default architecture, UI framework components embedded in `.mdx` files are rendered as static HTML without event listeners. If the component has interactivity (e.g., `onClick`, state hooks), you MUST append an Astro client directive like `client:load`, `client:idle`, or `client:visible` when calling it (e.g., `<MyComponent client:load />`), otherwise the interactivity will completely fail.
- **Long-form Default**: In posts or docs longer than roughly 3000 Chinese characters, and in MDX files containing multiple framework components, use `client:visible` by default for below-the-fold interactive islands. This prevents all components from hydrating during initial page load.
- **Do Not Batch client:only**: Never convert a group of charts or demos to `client:only`. Use it only when a component genuinely cannot render on the server because it requires browser-only APIs during render. Prefer making the component SSR-safe and using `client:visible`.
- **Limit Immediate Hydration**: Reserve `client:load` for a small number of first-viewport controls whose interaction is immediately required. `client:idle` is acceptable for lightweight global or near-fold interactions, but it is not a substitute for visibility-based hydration in a long article.
- **Preserve Visibility Detection**: Do not apply `content-visibility: auto` blindly to section wrappers that contain Astro islands. It can interfere with `client:visible` activation. Any containment optimization must be verified in Safari/WebKit and Chromium with real scroll-driven hydration.
- **Static Content First**: A performance stress article should primarily use Markdown-generated static HTML. Add interactive components only when the test explicitly targets hydration, and annotate why each island exists.
``````
