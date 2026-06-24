---
title: "8. 故障排查与规范 (Troubleshooting)"
published: 2026-06-15
description: "AI 指南：故障诊断、降级验证路径与代码提交规范。"
sidebar_position: 8
---
本文档指导了在二次开发遇到异常阻碍时的排查路径、回退方法与编译安全的最佳实践，以供 AI 在修改时参考。

``````text
# AI Collaboration Reference: Troubleshooting & Best Practices

## Context & Rules

- **When Stuck**: If you encounter an unsolvable situation, an ambiguous requirement, or need to understand how a core feature (like friends configuration or modular i18n) was heavily customized, you MUST read the official user tutorials located in `src/content/docs/zh_CN/Fuwari/` and its `advanced-customization/` subdirectory.
- **AST / Compilation Safety**: Whenever you make structural changes, always ensure you respect the `sidebar_position` for Docs, update translation keys in the main language dictionary, and avoid breaking the Astro Content Collections schema.
``````
