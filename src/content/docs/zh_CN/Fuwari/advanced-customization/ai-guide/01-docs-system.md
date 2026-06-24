---
title: "1. 文档与分类树 (Docs & Category Tree)"
published: 2026-06-15
description: "AI 指南：文档系统物理目录结构映射与 sidebar_position 排序冲突规则。"
sidebar_position: 1
---

本文档定义了博客的文档目录物理结构映射与侧边栏（Sidebar）排序规则，以供 AI 在修改时参考。

``````text
# AI Collaboration Reference: Documentation System & Category Tree

## Context & Rules

- **Directory**: `src/content/docs/[lang]/`. Subdirectories automatically create nested navigation categories in the sidebar.
- **Ordering**: The navigation tree ordering is controlled by the `sidebar_position` property in the markdown frontmatter.
- **Missing Position**: If a file lacks `sidebar_position`, it falls back to a lower priority. Files with `sidebar_position` will always appear above those without. For items without `sidebar_position`, folders are sorted above files, and then they are sorted alphabetically by filename.
- **Conflict Error**: No two items (files or folders) within the same directory level can have the same `sidebar_position`. If a collision occurs, `content-utils.ts` will intentionally throw a `Sidebar position conflict!` Error and fail the build.
- **Logic Location**: The logic that parses directories and builds the category tree is located in `src/utils/content-utils.ts` (specifically `getSortedDocsPosts` and `getCategoryTree`). If you need to modify how the sidebar is generated or sorted, edit `content-utils.ts`.
``````
