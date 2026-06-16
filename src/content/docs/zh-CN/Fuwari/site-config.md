---
title: "基础配置：个人信息、标题与导航"
published: 2026-06-15
description: "带你轻松完成 Fuwari 博客的基础定制，包括修改侧边栏个人信息、页面标题以及顶部导航栏按钮。"
sidebar_position: 1
---

# 基础配置：个人信息、标题与导航

当你刚刚克隆或部署好 Fuwari 博客后，第一件事肯定是将整个网站的默认占位信息替换成你自己的。
在这篇指南中，我们将带你完成网站的“三件套”配置：**左侧个人信息**、**各页面标题**，以及**顶部导航栏 (Titlebar)**。

你所需要修改的绝大部分内容，都集中在项目根目录的 `src/config.ts` 文件中，部分涉及多语言的标题则在 `src/i18n/languages/` 目录下。

---

## 1. 修改左侧个人信息 (名字、签名与头像)

整个博客页面左侧边栏显示的作者信息框，完全由 `config.ts` 中的 `profileConfig` 控制。

打开 `src/config.ts`，找到如下配置：

```typescript
export const profileConfig: ProfileConfig = {
    avatar: "https://github.com/你的名字.png", 
    name: "你的名字",
    bio: "这里是你的个性签名。",
    links: [
        {
            name: "GitHub",
            icon: "fa6-brands:github",
            url: "https://github.com/你的名字",
        },
        // 你可以继续往下添加 Twitter, Bilibili 等社交链接
    ],
};
```

**修改指南**：
- **头像 (`avatar`)**：可以是一个网络链接 (如 GitHub 头像链接)，也可以是你存放在本地 `public/` 或 `src/assets/` 目录下的图片。如果放在 `public` 下，直接写绝对路径 `/avatar.png` 即可。
- **名字与签名 (`name` & `bio`)**：直接修改为你喜欢的文字。
- **社交链接 (`links`)**：这会在你的名字下方生成一排可点击的社交图标。`icon` 字段支持 [Icones](https://icones.js.org/) 上超过十万个开源图标，直接复制标识符填入即可。

> [!TIP]
> **进阶技巧：修改头像的点击跳转链接**
> 默认情况下，点击大头像会跳转到`/about/`页面。如果你希望它像通常的博客那样点击回到主页，只需打开 `src/components/widget/Profile.astro` 文件，找到第 10 行附近的 `<a aria-label="..." href={url('/about/')}`，将其修改为 `href={url('/')}` 即可。你也可以顺便将对应的图标修改为 `material-symbols:home-outline-rounded` 以匹配主页意图。

---

## 2. 修改网站名称与各页面 Title

页面顶部浏览器标签页的标题由**全局配置**和**各页面的多语言字典**共同决定。

### 全局站名配置
首先在 `src/config.ts` 中找到 `siteConfig`：
```typescript
export const siteConfig: SiteConfig = {
    title: "你的博客名称",
    subtitle: '你的博客副标题',
    // ...
}
```
这里的 `title` 将会作为基础后缀，显示在所有页面的浏览器标签页中（例如：`关于 - 你的博客名称`）。

### 各栏目页面的 Title 修改 (i18n)
当你点击顶部的“博客 (Blog)”、“文档 (Docs)”等栏目时，它们的标题是支持国际化的。
如果你想修改这些页面的名字，需要去修改翻译字典！

打开你的主语言字典文件，比如 `src/i18n/languages/zh-CN.ts`：
```typescript
export const zh_CN: Translation = {
    [I18nKey.home]: '主页',
    [I18nKey.about]: '关于',
    [I18nKey.archive]: '归档',
    [I18nKey.blog]: '博文',
    [I18nKey.docs]: '知识库', // 你可以把 "文档" 改成 "知识库" 或 "Wiki"
    // ...
};
```
修改后，页面顶部、浏览器标签页以及顶部导航栏对应的文字，全都会**同步更新**！

---

## 3. 修改顶部标题栏 (Titlebar) 的按钮与链接

页面顶部的导航栏（如 `Home`, `Blog`, `Docs` 以及最右侧的 GitHub 图标链接）是由 `config.ts` 中的 `navBarConfig` 控制的。

找到如下代码：
```typescript
export const navBarConfig: NavBarConfig = {
    links: [
        LinkPreset.Blog,
        LinkPreset.Docs,
        LinkPreset.Archive,
        LinkPreset.About,
        LinkPreset.Friends, // 我们新增的友链系统
        {
            name: "GitHub",
            url: "https://github.com/aquamarine-z",
            external: true, // true 表示在新标签页打开
            icon: "fa6-brands:github"
        },
    ],
};
```

### 两种配置方式：
1. **系统预设链接 (`LinkPreset`)**：
   对于系统内置的页面（如博客、归档、关于），直接使用 `LinkPreset` 即可。它们会自动关联路由，并自动根据当前的页面语言进行标题翻译（见上一节）。
   *注意：如果你不想要某个页面，直接在这里注释或删掉即可隐藏该入口。*

2. **自定义外部/内部链接**：
   如果你想在导航栏加一个跳转到自己项目的外部链接，就像代码里的 GitHub 配置一样。你需要手动提供 `name`（按钮文字）、`url`（链接地址）、`external`（是否新窗口打开）以及可选的 `icon`。

一旦配置完毕，保存文件，Fuwari 就会自动为你渲染出美观且支持响应式折叠的顶部导航栏！
