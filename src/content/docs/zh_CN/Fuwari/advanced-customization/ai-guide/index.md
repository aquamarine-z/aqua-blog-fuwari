---
title: "AI 协作修改指南 (Agent Reference)"
published: 2026-06-15
description: "专为 AI Agent 和自动化代码助手准备的项目修改参考手册。AI 在修改本项目前请务必阅读此目录及子模块。"
sidebar_position: 11
is_article: true
---

本文档是为 AI 协作助手准备的项目二次开发参考指南，指引 AI 助手在开发前快速理解项目的深层约束与架构。

``````text
# AI Collaboration Reference: Agent Reference Manual

If you are using an AI coding assistant (such as GitHub Copilot, Cursor, Gemini Antigravity, or a custom Agent) to help you modify this blog project, you can direct the AI to read this chapter and its sub-pages.

This guide encapsulates the deep design constraints of this blog (which is heavily customized from Fuwari), allowing AI assistants to quickly understand the project architecture and significantly reducing the chance of post-modification errors or incorrect changes.

## Guide Directory

This guide is modularized into the following sub-articles. It is recommended to feed them to the AI assistant based on the task:

1. **[Docs & Category Tree](./01-docs-system/)**: Documentation physical directory mapping, ordering rules, and sorting conflict mechanisms.
2. **[Persistent BGM](./02-bgm-system/)**: Persistent background music player implementation and playlist configurations.
3. **[Theme & CSS](./03-theme-system/)**: Tailwind CSS configuration, OKLCH color space usage, and global style variables mapping.
4. **[i18n & Fallback](./04-i18n-system/)**: Differences between content i18n and UI i18n, automatic i18n prefix injection plugins, and safety fallback recovery mechanisms.
5. **[MDX & Hydration](./05-mdx-hydration/)**: Hydration directives and instructions for framework components embedded in markdown documents.
6. **[Swup & Boundaries](./06-swup-routing/)**: Page transition architecture, sidebar partial sync mechanism, mobile scrolling positioning order, and language selection Swup bypass.
7. **[Custom Plugins](./07-custom-plugins/)**: Guidelines for custom build-time plugins in the `src/astro-plugins/` directory.
8. **[Troubleshooting](./08-troubleshooting/)**: Error diagnostics, reference resources path, and fallback procedures.
``````
