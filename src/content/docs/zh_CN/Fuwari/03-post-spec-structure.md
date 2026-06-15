---
title: 'Post 与 Spec 的文件结构详解'
published: 2026-06-15
description: '详述 Post 和 Spec 的区别，以及底层 API 如何加载并安全降级渲染单页'
sidebar_position: 4
---

# Post 和 Spec 的战略定位

在这套二次改进的框架中，所有的 Markdown 内容被战略性地划分为了两大阵营：流动的信息（Post）与静止的基石（Spec）。

## Blog Post（流式文章）

Post 存放在 `src/content/blog/` 目录下。它们的特点是具有强烈的时间属性（发布时间）。
这类文章会被各种列表页收集：首页流、分类流、标签流、时间轴归档。它们是博客的“血液”。

## Spec（孤立单页）

Spec 存放在 `src/content/spec/` 目录下，用于那些不需要出现在任何时间线和信息流中的页面。例如：“关于我 (About)”、“友链页 (Friends)”、版权声明等。

### 底层魔法：`getSpecEntry`

在前端 Astro 路由（例如 `src/pages/[...lang]/about.astro`）中，页面引擎并不是通过遍历来找到这些文章的，而是通过一条专属魔法指令：

```javascript
const specEntry = await getSpecEntry("about", currentLang);
```

#### 智能回退与警告横幅

当你配置了多语言环境，但暂时没空翻译小语种（例如韩文）版的 `about.md` 时，`getSpecEntry` 展现了它的强大之处。
如果它在对应的语言目录下找不到文件，**它会自动去抓取主语言（如中文）的内容进行回退兜底**。

此时它不仅返回了中文内容，还会携带一个 `isFallback: true` 的标志位。前端捕捉到这个标志后，便会在页面顶部渲染出一个醒目的**红黄色语言警告提示框**，同时提供“可用语言切换按钮”，告知访客：“抱歉，该小语种版本不存在，为您展示默认语言版本。”
