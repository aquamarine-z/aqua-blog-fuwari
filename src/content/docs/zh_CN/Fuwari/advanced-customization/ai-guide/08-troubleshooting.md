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
- **Safari Long-form Baseline**: Never add a global transition rule to article descendants such as headings, paragraphs, spans, lists, code tokens, or table cells. Keep transitions scoped to actual interactive controls.
- **Native Article Scrolling**: Do not initialize body-level OverlayScrollbars or another custom scroll controller on `/posts/` and `/docs/` long-form routes. Preserve native window scrolling, anchor navigation, and Safari momentum scrolling.
- **Scroll Work Scheduling**: IntersectionObserver and scroll callbacks that update the TOC or other sticky UI must batch work into at most one `requestAnimationFrame`. Skip DOM reads and writes when the active state did not change, and cancel queued frames when a component disconnects.
- **Performance Verification**: After modifying CSS transitions, scroll containers, TOC behavior, or MDX hydration, run a production build and perform browser verification on a long document. Confirm lazy islands stay inactive before entering the viewport, activate after scrolling into view, and produce no hydration errors.
- **Regression Fixture**: Use `src/content/docs/zh_CN/Fuwari/advanced-customization/change-log/02-safari-long-mdx-stress-test.mdx` as the fixed long-form regression page. Do not simplify it merely to make a performance issue disappear.
``````
