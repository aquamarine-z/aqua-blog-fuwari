---
title: "🤖 AI 协作修改指南 (Agent Reference)"
published: 2026-06-15
description: "专为 AI Agent 和自动化代码助手准备的项目修改参考手册。AI 在修改本项目前请务必阅读此目录及子模块。"
sidebar_position: 11
is_article: true
---

# AI 协作修改指南 (Agent Reference)

如果你正在使用 AI 代码助手（如 GitHub Copilot、Cursor、Gemini Antigravity 或自定义 Agent）来协助你修改本博客项目，你可以直接让 AI 读取本章节及其子页面。

这套指南高度浓缩了本博客（基于 Fuwari 进行重度定制）的深层设计约束，让 AI 协作助手能够快速理解项目架构，极大地减少“修改代码后报错”或“改错地方”的概率。

## 🤖 章节导览

本指南已按模块拆分为以下子文章，建议按需提供给 AI 助手阅读：

1. **[文档系统与分类树 (Docs & Category Tree)](./01-docs-system/)**：Docs 的物理目录结构、排序规则与冲突报错机制。
2. **[音乐播放器持久化 (Persistent BGM)](./02-bgm-system/)**：Persistent BGM 的架构及音轨配置入口。
3. **[主题色与 CSS 变量 (Theme & CSS)](./03-theme-system/)**：Tailwind CSS、OKLCH 颜色空间及全局 CSS 变量的修改规范。
4. **[多语言与 Fallback (i18n & Fallback)](./04-i18n-system/)**：Content i18n 与 UI i18n 的差异、分块模块化（Partials）前缀自动注入机制与降级回退策略。
5. **[MDX 与客户端激活 (MDX & Hydration)](./05-mdx-hydration/)**：在文章中嵌入 React/Svelte 组件时的 Hydration 机制与客户端指令（Client Directives）用法。
6. **[Swup 路由与持久化边界 (Swup & Boundaries)](./06-swup-routing/)**：页面无刷新切换、侧边栏手动按需同步规则、移动端 Docs 延迟定位时序以及语言切换 bypass Swup 的机制。
7. **[自定义构建插件 (Custom Plugins)](./07-custom-plugins/)**：`src/astro-plugins/` 中 Vite/Astro 编译时代码注入插件的开发规范。
8. **[故障排查与规范 (Troubleshooting)](./08-troubleshooting/)**：遇到未解之谜时的排查路径、仓库提报规范及回退流程。
