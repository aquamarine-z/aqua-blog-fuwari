---
title: "AI 协作修改指南 (Agent Reference)"
published: 2026-06-15
description: "专为 AI Agent 和自动化代码助手准备的项目修改参考手册。AI 在修改本项目前请务必阅读此参考文档。"
sidebar_position: 5
---

# AI 协作修改指南 (Agent Reference)

如果你正在使用 AI 代码助手（如 GitHub Copilot, Cursor, Codeium, 或自定义 Agent）来协助你修改本项目，你可以直接让 AI 读取下方的全英文指令块。

这份英文指南包含了本项目（基于 Fuwari）的深层定制逻辑，包括：Docs 系统的层级原理、BGM 播放器的位置、多语言 (i18n) 的 Fallback 机制以及防冲突保护等。

让 AI 阅读这份指南后，它能极大地减少“修改代码后报错”或者“改错地方”的概率。

## Prompt for AI Agents

请复制下方代码块内的所有内容，发送给你的 AI 助手，或者通过 `@` 提及此文件让 AI 读取：

```text
# Project Architecture & Modification Reference
You are acting as an AI coding agent modifying an Astro-based blog project. This project is built upon the "Fuwari" theme but contains heavy customizations including a Docs system, a persistent BGM player, and a strict i18n fallback mechanism.

Before proposing code changes, familiarize yourself with the following core systems:

## 1. Docs File System & Category Tree
- **Directory**: `src/content/docs/[lang]/`. Subdirectories automatically create nested navigation categories.
- **Ordering**: The navigation tree ordering is strictly controlled by the `sidebar_position` property in the markdown frontmatter.
- **Logic Location**: The logic that parses directories and builds the category tree is located in `src/utils/content-utils.ts` (specifically `getSortedDocsPosts` and `getCategoryTree`). If you need to modify how the sidebar is generated or sorted, edit `content-utils.ts`.

## 2. Persistent BGM (Music Player) System
- **Implementation**: The music player uses Svelte and persists across page transitions because the project uses Swup for client-side routing, and the Navbar (which houses the player) is deliberately kept outside the Swup replacement container.
- **Location**: `src/components/MusicPlayer.svelte`.
- **Modification**: To change the audio source, do not look in `config.ts`. You must directly modify the `<audio src="...">` tag inside `MusicPlayer.svelte`.

## 3. Theme & Color Palette System
- **Framework**: The project uses Tailwind CSS and OKLCH color spaces.
- **Configurability**: Primary theme colors and preset hues are defined in `src/config.ts` under `siteConfig.themeColor`.
- **Core CSS Variables**: The actual Tailwind variable mappings (like `--primary`, `--bg`, `--card`) are strictly defined in `src/styles/global.css`. If you are asked to change the fundamental UI colors (like dark mode backgrounds), modify `global.css`.

## 4. Strict i18n (Internationalization) System
The i18n system is heavily customized to support strict separation and graceful degradation.
- **Dictionary & Fallback**: Handled in `src/i18n/translation.ts`. The `i18n(key, lang)` function attempts to find the translation in the target language. If missing, it **falls back to the main language** (`siteConfig.lang` defined in `config.ts`).
- **Strict Error**: If a translation key is missing in the **main language**, the system intentionally throws a build-time Error to prevent empty UI elements.
- **Adding Tags**: To add a new tag, you MUST register it in `src/i18n/i18nKey.ts` and add its translation to AT LEAST the main language file (e.g., `src/i18n/languages/zh_CN.ts`).
- **Post Filtering (Hiding mechanism)**: Posts without a translation in the current language directory (e.g., `src/content/blog/en/`) are completely hidden from that language's feed. This filtering logic is executed in `src/utils/content-utils.ts` inside `getSortedPosts()`.
- **Main Language Folder & Conflict**: For the main language (e.g., `zh_CN`), posts can be placed either in the root `src/content/blog/` or in `src/content/blog/zh_CN/`. Both map to the root routing without the language prefix. However, if two files share the same slug across these two locations, `content-utils.ts` will throw a conflict error during compilation to prevent silent overwriting.

Whenever you make structural changes, always ensure you respect the `sidebar_position` for Docs, update translation keys in the main language dictionary, and avoid breaking the Astro Content Collections schema.
```
