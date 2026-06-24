---
title: "4. 多语言与 Fallback (i18n & Fallback)"
published: 2026-06-15
description: "AI 指南：内容多语言、UI多语言及模块化 Partials 编译时自动注入前缀与回退兜底逻辑。"
sidebar_position: 4
---
本文档详细阐述了内容（Docs/Blog）多语言与界面（UI）多语言的设计差异、Fallback 机制以及编译期自动注入逻辑，以供 AI 在修改时参考。

``````text
# AI Collaboration Reference: Internationalization (i18n) & Fallback

## Context & Rules

### Content i18n vs UI i18n
- **Content i18n (Articles/Docs)**: Governed by the file system. Translated posts and docs are physically placed in language-specific subdirectories like `src/content/blog/[lang]/` and `src/content/docs/[lang]/`. Translations are done directly in the `.md` or `.mdx` files.
- **UI i18n (Components/Website Text)**: Governed by TypeScript dictionaries in `src/i18n/`. Used for static UI elements like buttons, navbars, and layout text. Translated via the `i18n(key, lang)` function. Do NOT hardcode UI text in components; always extract it to these dictionaries.

### Dictionary & Fallback
- **Fallback logic**: Handled in `src/i18n/translation.ts`. The `i18n(key, lang)` function attempts to find the translation in the target language. If missing, it **falls back to the main language** (`siteConfig.lang` defined in `config.ts`).
- **Raw Key Output**: If a translation key is missing in the **main language**, the system no longer throws a build-time Error. Instead, it securely degrades by outputting the raw key itself, ensuring no empty or undefined UI elements disrupt the user experience.

### Modular Partials & Plugin Auto-Prefixing
- **Location**: Translations for specific UI parts (partials) are modularized under `src/i18n/partials/<folder_name>/`.
  - **Do NOT manually prefix keys with `[folder_name]`** inside `keys.ts` or the translation files. Use plain string values (e.g. `title = 'title'`). The custom Vite plugin (`i18nKeyPrefixPlugin.mjs`) automatically injects `[folder_name]` into the `keys.ts` AST at build time.
  - **Usage in Astro/React**: When fetching translations, pass the enum key directly: `i18n(HomeKey.title)`. Do NOT manually wrap it (e.g. `i18n(\`[home]${HomeKey.title}\`)`), as this will cause double-prefixing (`[home][home]title`).
  - **Fallback Peeling Mechanism**: If a key is completely missing, `translation.ts` gracefully degrades. Before returning the raw key as a string, it strips any leading `[...]` folder prefix using a regex (`/^\[.*?\](.*)$/`). If you accidentally double-prefix a key, this peeling mechanism will silently strip the first prefix and render the second one as raw text (e.g., `[home]title`), masking the actual error. Check for double prefixes if translations fail to load.

### Setup & Safety
- **Adding Tags**: To add a new tag, you MUST register it in `src/i18n/i18nKey.ts` and add its translation to AT LEAST the main language file (e.g., `src/i18n/languages/zh_CN.ts`).
- **Post Filtering (Hiding mechanism)**: Posts without a translation in the current language directory (e.g., `src/content/blog/en/`) are completely hidden from that language's feed. This filtering logic is executed in `src/utils/content-utils.ts` inside `getSortedPosts()`.
- **Main Language Folder & Conflict**: For the main language (e.g., `zh_CN`), posts can be placed either in the root `src/content/blog/` or in `src/content/blog/zh_CN/`. Both map to the root routing without the language prefix. However, if two files share the same slug across these two locations, `content-utils.ts` will throw a conflict error during compilation to prevent silent overwriting.
``````
