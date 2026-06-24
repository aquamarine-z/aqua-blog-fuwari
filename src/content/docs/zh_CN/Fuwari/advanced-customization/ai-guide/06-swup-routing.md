---
title: "6. Swup 路由与持久化边界 (Swup & Boundaries)"
published: 2026-06-15
description: "AI 指南：Swup transitions、侧边栏按需部分同步及移动端滚动定位时序。"
sidebar_position: 6
---
本文档阐释了 Swup 无刷新路由切换的实现原理、导航事件节流、侧边栏部分内容手动同步规则以及滚动定位时序，以供 AI 在修改时参考。

``````text
# AI Collaboration Reference: Swup Routing & Persistent Boundaries

## Context & Rules

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
- **Docs -> Docs**: Do not fetch or replace the whole sidebar. Instead, dispatch `docs-directory:update-url` (and `category-tree:update-url` for backward compatibility) with the new pathname.
- **Non-Docs -> Non-Docs**: Do not touch the sidebar.
- **Event Coalescing**: Swup and Astro can emit multiple events for one navigation. `SideBar.astro` uses `requestAnimationFrame` to coalesce events before comparing the previous and next path. Do not remove this without replacing it with equivalent deduplication.

### DocsDirectory URL Recalculation
- **Logic Location**: `src/components/widget/DocsDirectory.svelte`.
- **Expected Behavior**: On Docs internal navigation, the persistent `DocsDirectory` receives the new URL and recalculates active/expanded state using `expandActive(categories, nextUrl)`.
- **Important Rule**: Keep expansion based on the active path. Do not automatically expand every folder that has an `index.md`; `index.md` means the folder is readable, not that it should always be expanded.
- **Completion Event**: After recalculating and awaiting Svelte `tick()`, the root tree dispatches `docs-directory:updated` (and `category-tree:updated`).

### Mobile Docs Scroll Timing
- **Logic Location**: `src/layouts/Layout.astro`.
- **Anchor**: Mobile Docs pages scroll to `#swup-mobile-scroll-target`.
- **Critical Sequence**: For mobile Docs internal navigation, Swup automatic reset is disabled first, then `DocsDirectory` recalculates expansion, then `docs-directory:updated` (or `category-tree:updated`) triggers the final scroll. Scrolling before the tree expands will produce incorrect positioning.

### Language Switching Must Bypass Swup
- **Rule**: Language switch links must use `data-no-swup`.
- **Affected Areas**: Top language selector, post/doc language availability links, and fallback buttons such as "this article does not exist in this language, switch to another language".
- **Reason**: Language switching changes persistent i18n state across Navbar, Search, DisplaySettings, date picker text, and other UI. Treat language changes as full page navigations, not Swup transitions.
``````
