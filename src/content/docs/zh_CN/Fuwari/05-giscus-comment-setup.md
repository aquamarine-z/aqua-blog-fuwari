---
title: 配置 Giscus 评论区
sidebar_position: 7
published: 2026-06-16
---

Fuwari 现已内置对 **Giscus** 评论系统的支持！Giscus 是一个利用 GitHub Discussions 实现的评论系统，无广告、无跟踪且免费，非常适合托管在 GitHub 上的开源博客。

## 准备工作

在开启评论系统之前，请确保你已经准备好了用于存放评论的 GitHub 仓库，并满足以下条件：

1. **仓库必须是公开的 (Public)**：Giscus 无法读取私有仓库的 Discussions。
2. **已经开启了 Discussions 功能**：前往仓库的 Settings -> General -> Features，勾选 `Discussions`。
3. **安装了 Giscus GitHub App**：前往 [Giscus 官方应用页面](https://github.com/apps/giscus) 安装并授权该应用访问你的评论仓库。

> [!TIP]
> 推荐单独创建一个专门的空仓库用来存放评论（例如 `你的用户名/blog-comments`），这样可以让源码仓库和评论仓库分离开，更易于管理。

## 获取 Giscus 配置信息

1. 前往 [Giscus 官网](https://giscus.app/zh-CN)。
2. 在 **仓库** 一栏输入你的评论仓库名称（例如 `aquamarine-z/aqua-blog-discussion`）。如果上方出现绿字提示，则表示满足所有条件。
3. 在 **页面与 Discussion 映射关系** 中选择任意选项（Fuwari 已在代码中写死了映射方式，这里仅用于生成配置代码）。
4. 在 **Discussion 分类** 中选择你要存放评论的分类，一般推荐 `General` 或 `Announcements`。
5. 向下滚动到 **启用 giscus** 区域，你会看到一段自动生成的 `<script>` 标签代码，重点关注这几行：

```html
data-repo="aquamarine-z/aqua-blog-discussion"
data-repo-id="R_kgDONLC_uw"
data-category="General"
data-category-id="DIC_kwDONLC_u84CkA5v"
```

## 修改配置文件

打开项目根目录的 `src/config.ts`，找到 `giscusConfig` 选项卡。

将刚刚获取到的信息填入配置文件中，并将 `enable` 改为 `true`：

```ts
export const giscusConfig: GiscusConfig = {
    enable: true, // 开启评论功能
    repo: "你的 GitHub 用户名/你的评论仓库",
    repoId: "你的 repoId",
    category: "你选择的分类",
    categoryId: "你的 categoryId",
    mapping: "specific", // 推荐保留 specific，这样多语言路由下可以共享评论
    strict: "0",
    reactionsEnabled: "1",
    emitMetadata: "0",
    inputPosition: "top",
    theme: "light",
    lang: "zh-CN",
    loading: "lazy",
};
```

> [!NOTE]
> `mapping` 设置为 `specific` 可以确保当你在多语言站点切换语言时，即使文章的 URL 发生变化（如 `/zh_CN/posts/hello` 到 `/en/posts/hello`），只要文章的文件名 (`slug`) 一致，评论就会映射到同一个讨论帖下。

保存配置后，重启项目，你的文章和文档页面的最下方就会自动出现评论区了！
