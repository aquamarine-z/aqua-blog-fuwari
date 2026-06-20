---
title: "定制与修改主页"
published: 2026-06-15
description: "详细讲解如何找到主页的源代码，修改主页的欢迎语、文案以及核心 HTML/Tailwind 布局结构。"
sidebar_position: 5
---

# 定制与修改主页

由于本博客项目在主页上集成了较多个性化、复杂的展示块（如多语言自我介绍、技术栈标签、动态按钮等），为了保证最大的排版灵活性，**主页的大部分文案和布局直接写在了代码源文件里**，而不是配置在普通的 config 文件中。

如果你希望对主页进行深度的修改（比如更换文案、增加图片、调整排版结构），你需要直接修改主页的 `.astro` 源码文件。

本篇教程将带你找到对应的代码位置并指导你如何修改。

## 1. 主页代码在哪里？

整个主页的核心代码都存放在这一个文件中：
`src/pages/[...lang]/index.astro`

你可以使用 VSCode 或其他代码编辑器打开这个文件。它是一个标准的 Astro 组件文件，主要分为两部分：
1. **顶部的代码逻辑区**（由 `---` 包裹），包含数据处理、多语言文案字典。
2. **底部的 HTML 模板区**，使用 Tailwind CSS 控制样式，并且嵌入了 Astro 组件。

---

## 2. 如何修改主页的文字文案？

为了配合系统的多语言 (i18n) 机制，主页的文案被统一写在了一个名为 `t` 的翻译字典对象中。

在 `index.astro` 文件的顶部代码区（约第 18 行左右），你会看到类似下面这样的结构：

```typescript
// Translations for the homepage
const t = {
    zh_CN: {
        title: "Hi, 我是 Aquamarine",
        subtitle: "前端开发者 & 语言爱好者",
        description: "我专注于 <strong>前端设计</strong>，使用 <strong>React</strong> 和 <strong>Vue</strong> 构建美观且交互丰富的 Web 应用。...",
        readBlog: "阅读博客",
        viewDocs: "查看文档",
        // ...更多字段
    },
    en: {
        title: "Hi, I'm Aquamarine",
        // ...英文翻译
    },
    // ...其它语言
};
```

**修改方法：**
你只需要直接在这些字符串中修改文字即可！
- 如果你懂 HTML，你可以在 `description` 等字段中随意穿插 `<strong>` (加粗), `<br>` (换行) 等标签来控制排版。
- 如果你要修改某个主语言的文案，请一定记得把你启用的**外语**（如 `en`, `ja`）对应的文案也一并修改，保持结构对称。

---

## 3. 如何修改主页的 HTML 结构和排版？

如果你想做的不仅是修改文字，还想修改排版（比如增加一个展示板块，或者修改按钮的颜色），那么你需要往下滚动，找到 HTML 模板区（位于第二个 `---` 之后）。

这里使用了强大的 **Tailwind CSS**，你会看到很多带有 `class="..."` 的标签：

### 例子 1：修改头像区域
你会看到如下代码渲染头像：
```html
<div class="w-36 h-36 md:w-52 md:h-52 shrink-0 rounded-full overflow-hidden border-[6px] border-[var(--primary)]/20...">
    <ImageWrapper src={profileConfig.avatar || '/favicon.svg'} alt="Avatar" class="w-full h-full object-cover" />
</div>
```
它默认读取你 `config.ts` 中的 `avatar` 配置。你可以更改包裹它的 `div` 的 class 属性，比如改变圆角、阴影或大小。

### 例子 2：修改技术栈小标签
你会在模板区中找到如下这些静态标签代码：
```html
<div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]...">
    <Icon name="fa6-brands:react" class="text-xl" /> React
</div>
```
- 你可以任意**复制、粘贴、删除**这些 `<div class="flex items-center...">` 代码块来增减你的技术栈标签。
- `<Icon name="..." />` 是一个图标组件，你可以前往 [Icones 网站](https://icones.js.org/) 寻找任何你喜欢的图标，并将 `name` 替换为新图标的名字（比如 `fa6-brands:python`）。

### 例子 3：修改按钮的链接或图标
跳转到博客和文档的按钮代码：
```html
<a href={...} class="group bg-[var(--primary)] text-white px-6 py-3.5 rounded-xl...">
    <Icon name="material-symbols:article-outline-rounded" class="text-xl" />
    {currentT.readBlog}
    <Icon name="material-symbols:arrow-forward-rounded" class="text-xl transition-transform group-hover:translate-x-1" />
</a>
```
- `{currentT.readBlog}` 代表这里动态读取了你在顶部字典里写的文字。
- 你可以像前面一样替换 `<Icon>` 中的图标。

## 注意事项

- 在修改 `index.astro` 文件时，请保持 Astro 和 HTML 的基本语法正确（标签需要闭合）。
- 由于这里广泛使用了 Tailwind CSS，如果你想改颜色、间距，可以直接查阅 [Tailwind CSS 官方文档](https://tailwindcss.com/docs) 并在 `class=""` 中修改对应的工具类。
