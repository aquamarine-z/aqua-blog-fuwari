---
title: '友情链接设置指南'
published: 2026-06-15
description: 详细讲解如何配置和修改 Fuwari 博客的友情链接（Friends）系统
tags: [指南, 友情链接]
category: Fuwari使用指南
sidebar_position: 5
---

# 友情链接设置指南

为了方便不懂代码的用户也能快速上手，Fuwari 博客对友情链接 (Friends) 系统进行了重构，现在你可以直接在统一的配置文件中修改你的友链数据！

## 1. 配置文件在哪里？

所有的友情链接数据都存放在根目录的 `src/config.ts` 文件中。

你只需要打开 `src/config.ts` 文件，滚动到文件最底部，就能看到名为 `friendsConfig` 的配置数组。

## 2. 如何添加或修改友情链接？

在 `friendsConfig` 数组中，每一个大括号 `{ ... }` 就代表了一张友情链接卡片。它的基本结构如下：

```typescript
export const friendsConfig: Friend[] = [
    {
        name: "Aquamarine",                 // 必填：友链的名称（如昵称）
        avatar: "https://github.com/...png", // 必填：对方的头像链接 (推荐使用图片 URL 或相对路径)
        labels: ['tag.self', "tag.frontend"], // 必填：用于描述对方属性的标签数组
        links: [                            // 必填：对方的各种链接地址
            { name: 'Github', link: "https://github.com/aquamarine-z" },
            { name: 'Blog', link: "https://aquamarine-z.github.io/aqua-blog/" }
        ]
    },
    // 你可以在这里继续添加下一个友链...
];
```

### 字段详解：

* **name**: 对方的昵称或名称。
* **avatar**: 头像图片的 URL，支持外部链接（如 GitHub 头像链接）或本地相对路径（如 `/assets/friends-avatar/xxx.png`）。
* **labels**: 为你的好友打上的标签（Tag）。系统内置了一些国际化标签（如 `'tag.friend'`, `'tag.schoolmate'` 等）。关于如何自定义标签，请参考《深度定制》章节。
* **links**: 这是一个包含对方所有社交/网站链接的数组。你只需要配置名称 (`name`) 和网址 (`link`)，系统会自动根据 `name` 匹配对应的 Icon（如 Github 会自动显示 Github 的图标）。

## 3. 注意事项

1. 修改 `src/config.ts` 后，保存文件，本地开发服务器会自动热更新。如果格式出现错误，TypeScript 会在终端报错，提示你哪里少了逗号或大括号。
2. 保持 JSON 结构的完整性，特别注意逗号、中括号 `[]` 和大括号 `{}` 不要误删！

---

> **进阶提示**：
> 如果你想为友链的 `links` 配置特定的图标，或者想创建全新的 `labels` 标签并支持多国语言翻译，请查看深度定制文档：[友情链接高级定制：Icon与Tag系统全解](/zh_CN/docs/fuwari/深度定制/01-friends-advanced/)。
