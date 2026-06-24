---
title: "🔌 7. 自定义构建插件 (Custom Plugins)"
published: 2026-06-20
description: "AI 指南：Vite 与 Astro 插件机制以及 keys.ts 前缀替换逻辑。"
sidebar_position: 7
---

# AI 协作参考：自定义构建插件

## 📌 Context & Rules

- **Plugin System**: To keep `astro.config.mjs` clean, custom Vite or Astro build-time plugins (such as the automatic `i18nKeyPrefixPlugin` for modular partials) are stored in the `src/astro-plugins/` directory.
- **Rule**: If you need to debug or extend compile-time transformations, look inside `src/astro-plugins/`. Do not write large inline plugin logic directly inside `astro.config.mjs`.
