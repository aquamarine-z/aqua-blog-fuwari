---
title: "2. 音乐播放器持久化 (Persistent BGM)"
published: 2026-06-15
description: "AI 指南：音乐播放器持久化机制与 tracks 播放列表配置规范。"
sidebar_position: 2
---
本文档介绍了博客音乐播放器的全局持久化原理及音轨（Tracks）配置入口，以供 AI 在修改时参考。

``````text
# AI Collaboration Reference: Persistent BGM Player

## Context & Rules

- **Implementation**: The music player uses Svelte and persists across page transitions because the project uses Swup for client-side routing, and the Navbar (which houses the player) is deliberately kept outside the Swup replacement container.
- **Location**: `src/components/MusicPlayer.svelte` and `src/stores/musicStore.ts`.
- **Modification**: To change the audio source or manage playlist tracks, configure the `musicConfig` object inside `src/config.ts`. The vanilla Zustand store `musicStore.ts` initializes the playlist using `musicConfig.tracks` and persists playback states in local storage. Do not hardcode tracks directly inside `MusicPlayer.svelte`.
``````
