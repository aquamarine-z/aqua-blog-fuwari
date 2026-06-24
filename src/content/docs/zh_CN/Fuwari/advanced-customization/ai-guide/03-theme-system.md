---
title: "3. 主题色与 CSS 变量 (Theme & CSS)"
published: 2026-06-15
description: "AI 指南：Tailwind CSS、OKLCH 颜色系统与核心样式变量修改。"
sidebar_position: 3
---
本文档规范了项目的主题配色方案、OKLCH 色彩空间及全局 CSS 变量的配置位置，以供 AI 在修改时参考。

``````text
# AI Collaboration Reference: Theme Colors & CSS Variables

## Context & Rules

- **Framework**: The project uses Tailwind CSS and OKLCH color spaces.
- **Configurability**: Primary theme colors and preset hues are defined in `src/config.ts` under `siteConfig.themeColor`.
- **Core CSS Variables**: The actual Tailwind variable mappings (like `--primary`, `--bg`, `--card`) are strictly defined in `src/styles/global.css`. If you are asked to change the fundamental UI colors (like dark mode backgrounds), modify `global.css`.
``````
