---
title: "AI 协作修改指南 (Agent Reference)"
published: 2026-06-15
description: "专为 AI Agent 和自动化代码助手准备的项目修改参考手册。AI 在修改本项目前请务必阅读此参考文档。"
---

# AI 协作修改指南 (Agent Reference)

如果你正在使用 AI 代码助手（如 GitHub Copilot, Cursor, Codeium, 或自定义 Agent）来协助你修改本项目，你可以直接让 AI 读取下方的全英文指令块。

这份英文指南包含了本项目（基于 Fuwari）的深层定制逻辑，包括：Docs 系统的层级原理、BGM 播放器的位置、多语言 (i18n) 的 Fallback 机制以及防冲突保护等。

这部分不仅包含了项目的架构和约束，也指示了 AI 遇到不可解决的情况时，去翻阅 Docs 里面的 Fuwari 教程。

让 AI 阅读这份指南后，它能极大地减少“修改代码后报错”或者“改错地方”的概率。

## Prompt for AI Agents

请复制下方代码块内的所有内容，发送给你的 AI 助手，或者通过 `@` 提及此文件让 AI 读取：

```text
# Project Architecture & Modification Reference
You are acting as an AI coding agent modifying an Astro-based blog project. This project is built upon the "Fuwari" theme but contains heavy customizations including a Docs system, a persistent BGM player, and a strict i18n fallback mechanism.

Before proposing code changes, familiarize yourself with the following core systems:

## 1. Docs File System & Category Tree
- **Directory**: `src/content/docs/[lang]/`. Subdirectories automatically create nested navigation categories.
- **Ordering**: The navigation tree ordering is controlled by the `sidebar_position` property in the markdown frontmatter.
  - **Missing Position**: If a file lacks `sidebar_position`, it falls back to a lower priority. Files with `sidebar_position` will always appear above those without. For items without `sidebar_position`, folders are sorted above files, and then they are sorted alphabetically by filename.
  - **Conflict Error**: No two items (files or folders) within the same directory level can have the same `sidebar_position`. If a collision occurs, `content-utils.ts` will intentionally throw a `Sidebar position conflict!` Error and fail the build.
- **Logic Location**: The logic that parses directories and builds the category tree is located in `src/utils/content-utils.ts` (specifically `getSortedDocsPosts` and `getCategoryTree`). If you need to modify how the sidebar is generated or sorted, edit `content-utils.ts`.

## 2. Persistent BGM (Music Player) System
- **Implementation**: The music player uses Svelte and persists across page transitions because the project uses Swup for client-side routing, and the Navbar (which houses the player) is deliberately kept outside the Swup replacement container.
- **Location**: `src/components/MusicPlayer.svelte` and `src/stores/musicStore.ts`.
- **Modification**: To change the audio source or manage playlist tracks, configure the `musicConfig` object inside `src/config.ts`. The vanilla Zustand store `musicStore.ts` initializes the playlist using `musicConfig.tracks` and persists playback states in local storage. Do not hardcode tracks directly inside `MusicPlayer.svelte`.

## 3. Theme & Color Palette System
- **Framework**: The project uses Tailwind CSS and OKLCH color spaces.
- **Configurability**: Primary theme colors and preset hues are defined in `src/config.ts` under `siteConfig.themeColor`.
- **Core CSS Variables**: The actual Tailwind variable mappings (like `--primary`, `--bg`, `--card`) are strictly defined in `src/styles/global.css`. If you are asked to change the fundamental UI colors (like dark mode backgrounds), modify `global.css`.

## 4. Strict i18n (Internationalization) System
The i18n system is heavily customized to support strict separation and graceful degradation.

**Crucial Distinction: Content i18n vs UI i18n**
- **Content i18n (Articles/Docs)**: Governed by the file system. Translated posts and docs are physically placed in language-specific subdirectories like `src/content/blog/[lang]/` and `src/content/docs/[lang]/`. Translations are done directly in the `.md` or `.mdx` files.
- **UI i18n (Components/Website Text)**: Governed by TypeScript dictionaries in `src/i18n/`. Used for static UI elements like buttons, navbars, and layout text. Translated via the `i18n(key, lang)` function. Do NOT hardcode UI text in components; always extract it to these dictionaries.

- **Dictionary & Fallback**: Handled in `src/i18n/translation.ts`. The `i18n(key, lang)` function attempts to find the translation in the target language. If missing, it **falls back to the main language** (`siteConfig.lang` defined in `config.ts`).
- **Modular Partials & Plugin Auto-Prefixing**: Translations for specific UI parts (partials) are modularized under `src/i18n/partials/<folder_name>/`.
  - **Do NOT manually prefix keys with `[folder_name]`** inside `keys.ts` or the translation files. Use plain string values (e.g. `title = 'title'`). The custom Vite plugin (`i18nKeyPrefixPlugin.mjs`) automatically injects `[folder_name]` into the `keys.ts` AST at build time.
  - **Usage in Astro/React**: When fetching translations, pass the enum key directly: `i18n(HomeKey.title)`. Do NOT manually wrap it (e.g. `i18n(\`[home]${HomeKey.title}\`)`), as this will cause double-prefixing (`[home][home]title`).
  - **Fallback Peeling Mechanism**: If a key is completely missing, `translation.ts` gracefully degrades. Before returning the raw key as a string, it strips any leading `[...]` folder prefix using a regex (`/^\[.*?\](.*)$/`). If you accidentally double-prefix a key, this peeling mechanism will silently strip the first prefix and render the second one as raw text (e.g., `[home]title`), masking the actual error. Check for double prefixes if translations fail to load.
- **Raw Key Output**: If a translation key is missing in the **main language**, the system no longer throws a build-time Error. Instead, it securely degrades by outputting the raw key itself, ensuring no empty or undefined UI elements disrupt the user experience.
- **Adding Tags**: To add a new tag, you MUST register it in `src/i18n/i18nKey.ts` and add its translation to AT LEAST the main language file (e.g., `src/i18n/languages/zh_CN.ts`).
- **Post Filtering (Hiding mechanism)**: Posts without a translation in the current language directory (e.g., `src/content/blog/en/`) are completely hidden from that language's feed. This filtering logic is executed in `src/utils/content-utils.ts` inside `getSortedPosts()`.
- **Main Language Folder & Conflict**: For the main language (e.g., `zh_CN`), posts can be placed either in the root `src/content/blog/` or in `src/content/blog/zh_CN/`. Both map to the root routing without the language prefix. However, if two files share the same slug across these two locations, `content-utils.ts` will throw a conflict error during compilation to prevent silent overwriting.

## 5. MDX and UI Component Hydration
- **Inserting Components**: If you are asked to insert a React/Vue/Svelte UI component into a post or documentation, you MUST use an `.mdx` file, not `.md`. You must `import` the component immediately below the frontmatter block.
- **Hydration is Required**: Because Astro uses a Zero-JS by default architecture, UI framework components embedded in `.mdx` files are rendered as static HTML without event listeners. If the component has interactivity (e.g., `onClick`, state hooks), you MUST append an Astro client directive like `client:load`, `client:idle`, or `client:visible` when calling it (e.g., `<MyComponent client:load />`), otherwise the interactivity will completely fail.

## 6. Swup Routing & Persistent UI Boundaries
This project uses `@swup/astro` for client-side page transitions, but several UI regions are intentionally kept outside Swup replacement to preserve state.

- **Configuration Location**: Swup is configured in `astro.config.mjs`.
- **Current Swup Containers**: The replacement containers should remain:
  - `main`
  - `#toc`
  - `#sidebar-bottom`
  - `#mobile-toc-container`
- **Do Not Add These Containers Back**:
  - `#navbar-wrapper`
  - `#sidebar`
- **Why Navbar Is Persistent**: `#navbar-wrapper` contains persistent interactive UI, including the BGM player, language selector, search trigger, and theme/color controls. Replacing it through Swup can reset component state and break i18n updates.
- **Why Sidebar Is Persistent**: The left profile card should stay mounted. Only `#sidebar-sticky` is manually synchronized when the route crosses the Docs boundary.

### Sidebar Sync Rules
- **Logic Location**: `src/components/widget/SideBar.astro`.
- **Non-Docs -> Docs** and **Docs -> Non-Docs**: Fetch the target page HTML and replace only `#sidebar-sticky`.
- **Docs -> Docs**: Do not fetch or replace the whole sidebar. Instead, dispatch `category-tree:update-url` with the new pathname.
- **Non-Docs -> Non-Docs**: Do not touch the sidebar.
- **Event Coalescing**: Swup and Astro can emit multiple events for one navigation. `SideBar.astro` uses `requestAnimationFrame` to coalesce events before comparing the previous and next path. Do not remove this without replacing it with equivalent deduplication.

### CategoryTree URL Recalculation
- **Logic Location**: `src/components/widget/CategoryTree.svelte`.
- **Expected Behavior**: On Docs internal navigation, the persistent `CategoryTree` receives the new URL and recalculates active/expanded state using `expandActive(categories, nextUrl)`.
- **Important Rule**: Keep expansion based on the active path. Do not automatically expand every folder that has an `index.md`; `index.md` means the folder is readable, not that it should always be expanded.
- **Completion Event**: After recalculating and awaiting Svelte `tick()`, the root tree dispatches `category-tree:updated`.

### Mobile Docs Scroll Timing
- **Logic Location**: `src/layouts/Layout.astro`.
- **Anchor**: Mobile Docs pages scroll to `#swup-mobile-scroll-target`.
- **Critical Sequence**: For mobile Docs internal navigation, Swup automatic reset is disabled first, then `CategoryTree` recalculates expansion, then `category-tree:updated` triggers the final scroll. Scrolling before the tree expands will produce incorrect positioning.

### Language Switching Must Bypass Swup
- **Rule**: Language switch links must use `data-no-swup`.
- **Affected Areas**: Top language selector, post/doc language availability links, and fallback buttons such as "this article does not exist in this language, switch to another language".
- **Reason**: Language switching changes persistent i18n state across Navbar, Search, DisplaySettings, date picker text, and other UI. Treat language changes as full page navigations, not Swup transitions.

## 7. Custom Astro & Vite Plugins
- **Plugin System**: To keep `astro.config.mjs` clean, custom Vite or Astro build-time plugins (such as the automatic `i18nKeyPrefixPlugin` for modular partials) are stored in the `src/astro-plugins/` directory.
- **Rule**: If you need to debug or extend compile-time transformations, look inside `src/astro-plugins/`. Do not write large inline plugin logic directly inside `astro.config.mjs`.

## 8. Troubleshooting & Fallback Context
- **When Stuck**: If you encounter an unsolvable situation, an ambiguous requirement, or need to understand how a core feature (like friends configuration or modular i18n) was heavily customized, you MUST read the official user tutorials located in `src/content/docs/zh_CN/Fuwari/` and its `advanced-customization/` subdirectory.

Whenever you make structural changes, always ensure you respect the `sidebar_position` for Docs, update translation keys in the main language dictionary, and avoid breaking the Astro Content Collections schema.
```
