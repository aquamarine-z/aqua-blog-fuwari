---
title: "🎨 3. 主题色与 CSS 变量 (Theme & CSS)"
published: 2026-06-15
description: "AI 指南：Tailwind CSS、OKLCH 颜色系统与核心样式变量修改。"
sidebar_position: 3
---

# AI 协作参考：主题色与 CSS 变量

## 📌 Context & Rules

- **Framework**: The project uses Tailwind CSS and OKLCH color spaces.
- **Configurability**: Primary theme colors and preset hues are defined in `src/config.ts` under `siteConfig.themeColor`.
- **Core CSS Variables**: The actual Tailwind variable mappings (like `--primary`, `--bg`, `--card`) are strictly defined in `src/styles/global.css`. If you are asked to change the fundamental UI colors (like dark mode backgrounds), modify `global.css`.
