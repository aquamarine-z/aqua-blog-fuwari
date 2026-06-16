---
title: "Swup 路由与持久化组件改造记录"
published: 2026-06-16
description: "记录本项目在 Fuwari 基础上对 Swup、侧边栏、Docs 目录树、移动端滚动和语言切换所做的二次改进。"
sidebar_position: 7
---

# Swup 路由与持久化组件改造记录

本文记录本项目在 Fuwari 原主题基础上，对 Swup 页面切换机制做过的关键二次改进。这里不是 Swup 的入门教程，而是给后续维护者看的“改动地图”：哪些 DOM 交给 Swup 替换，哪些 UI 必须保持持久化，以及 Docs 侧边栏为什么不能简单放回 Swup 容器。

如果之后继续改 Swup，请先确认本文列出的路径和事件链，否则很容易出现“页面白屏刷新”“Navbar 状态不更新”“Docs 树高亮错位”“移动端滚动定位错误”等问题。

## Swup 容器边界

核心配置位于：

```text
astro.config.mjs
```

当前 Swup containers 只负责替换正文、目录和部分移动端 TOC 区域：

```js
swup({
  theme: false,
  animationClass: "transition-swup-",
  containers: ["main", "#toc", "#sidebar-bottom", "#mobile-toc-container"],
  smoothScrolling: true,
  cache: true,
  preload: true,
  accessibility: true,
  updateHead: true,
  updateBodyClass: false,
  globalInstance: true,
})
```

这里有两个故意不放进 containers 的区域：

```text
#navbar-wrapper
#sidebar
```

`#navbar-wrapper` 不能被 Swup 替换，因为里面包含音乐播放器、语言选择器、颜色设置等持久化交互组件。把它放进 Swup 容器会导致播放器重建、状态丢失，甚至在切换语言后 Navbar 内部状态无法稳定同步。

`#sidebar` 也没有整体交给 Swup。左侧个人信息卡片需要持久化，而 Docs 的分类树只需要在特定情况下局部同步。因此本项目改成手动管理 `#sidebar-sticky`。

## 侧边栏同步策略

相关文件：

```text
src/components/widget/SideBar.astro
src/components/widget/Categories.astro
src/components/widget/CategoryTree.svelte
```

`SideBar.astro` 的结构分成两层：

```astro
<div id="sidebar">
  <div>
    <Profile />
  </div>
  <div id="sidebar-sticky">
    <Categories isDocs={isDocs} />
    {!isDocs && <Tag isDocs={false} />}
  </div>
</div>
```

外层 `#sidebar` 和个人信息卡片保持持久化。真正需要根据路由变化更新的是 `#sidebar-sticky`：普通页面显示分类和标签，Docs 页面显示 `CategoryTree`。

### 非 Docs 与 Docs 之间切换

当路由从非 Docs 进入 Docs，或从 Docs 离开到非 Docs 时，侧边栏内容结构会变化。这种情况必须重新拉取当前页面 HTML，并替换 `#sidebar-sticky`。

核心逻辑在 `SideBar.astro`：

```js
async function refreshSidebarSticky(targetUrl) {
  const currentSidebarRoot = document.getElementById('sidebar');
  const currentSidebar = document.getElementById('sidebar-sticky');
  if (!currentSidebar) return;

  const response = await fetch(targetUrl, {
    headers: { 'X-Requested-With': 'swup-sidebar-sync' },
  });
  if (!response.ok) return;

  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const nextSidebarRoot = doc.getElementById('sidebar');
  const nextSidebar = doc.getElementById('sidebar-sticky');
  if (!nextSidebar) return;

  if (currentSidebarRoot && nextSidebarRoot) {
    currentSidebarRoot.className = nextSidebarRoot.className;
  }

  currentSidebar.replaceWith(nextSidebar);
}
```

注意：这里替换的是 `#sidebar-sticky`，不是整个 `#sidebar`。这样可以避免左侧个人信息卡片被 Swup 或手动同步反复重建。

### Docs 内部切换

Docs 内部从一个文档跳到另一个文档时，`CategoryTree` 的数据结构没有变，只是当前 URL 变了。此时不应该重新 fetch 和替换整个侧边栏，否则移动端定位和树状态都会更容易抖动。

因此 Docs 内部切换只派发一个新 URL：

```js
document.dispatchEvent(new CustomEvent('category-tree:update-url', {
  detail: { url: nextPath },
}));
```

`CategoryTree.svelte` 收到新 URL 后，用原来的 active-path 逻辑重算展开状态：

```js
activeUrl = nextUrl;
expandedCategories = expandActive(categories, nextUrl);
```

这里的重点是 `expandActive` 必须显式接收 URL，不要隐式依赖旧的 prop：

```js
function isNodeActive(node, url = activeUrl) {
  // compare getUrl(node.url) with url
}

function expandActive(nodes, url = activeUrl) {
  let expanded = {};
  for (const node of nodes) {
    if (node.type === 'folder' && isNodeActive(node, url)) {
      expanded[node.folderName || node.name] = true;
      if (node.children) {
        const childrenExpanded = expandActive(node.children, url);
        expanded = { ...expanded, ...childrenExpanded };
      }
    }
  }
  return expanded;
}
```

不要把“带 `index.md` 的目录”无条件加入展开逻辑。当前设计仍然是：只有当前路径命中的节点及其父级会展开。

## 事件去重与判断边界

Swup/Astro 在一次导航中可能触发多个事件，例如：

```text
astro:page-load
swup:content:replace
swup:page:view
popstate
```

如果每个事件都立即处理，`previousPath` 会被过早改写，导致第二个事件判断不出“从哪里来到哪里”。因此 `SideBar.astro` 用 `requestAnimationFrame` 做一次事件聚合：

```js
let previousPath = window.location.pathname;
let pendingSync = false;

const scheduleSidebarSync = () => {
  if (pendingSync) return;
  pendingSync = true;

  requestAnimationFrame(() => {
    pendingSync = false;
    syncIfSidebarShouldRefresh();
  });
};
```

真正的分支判断只有两个：

```js
const wasDocsPath = isDocsPath(previousPath);
const isNextDocsPath = isDocsPath(nextPath);
const isDocsInternalNavigation = wasDocsPath && isNextDocsPath;
const shouldRefresh = wasDocsPath !== isNextDocsPath;
```

含义如下：

| 场景 | 行为 |
| --- | --- |
| 非 Docs -> Docs | fetch 当前 URL 并替换 `#sidebar-sticky` |
| Docs -> 非 Docs | fetch 当前 URL 并替换 `#sidebar-sticky` |
| Docs -> Docs | 不 fetch，只通知 `CategoryTree` 重算 |
| 非 Docs -> 非 Docs | 不处理 sidebar |

## 移动端 Docs 定位

相关文件：

```text
src/layouts/Layout.astro
src/layouts/MainGridLayout.astro
src/components/widget/CategoryTree.svelte
```

移动端 Docs 页面有一个定位锚点：

```astro
<!-- src/layouts/MainGridLayout.astro -->
<div id="swup-mobile-scroll-target" class="absolute -top-20 pointer-events-none"></div>
```

普通情况下，Swup 可以在进入 Docs 时直接滚动到这个锚点：

```js
visit.scroll.target = '#swup-mobile-scroll-target';
```

但 Docs 内部切换时，`CategoryTree` 是持久化组件，必须先接收新 URL、重算展开状态、完成 DOM 更新，然后再进行移动端定位。否则树展开导致布局高度变化，滚动位置会提前测量，最后定位偏移。

因此 `Layout.astro` 对移动端 Docs 内部跳转禁用 Swup 自动滚动：

```js
if (isDocsInternalNavigation && visit.scroll) {
  visit.scroll.reset = false;
  pendingMobileDocsScrollUrl = nextUrl.pathname;
}
```

随后等待 `CategoryTree` 发出完成事件：

```js
document.addEventListener('category-tree:updated', (event) => {
  const nextUrl = event.detail?.url;
  if (!pendingMobileDocsScrollUrl || nextUrl !== pendingMobileDocsScrollUrl) return;

  pendingMobileDocsScrollUrl = null;
  scrollToMobileDocsTarget();
});
```

`CategoryTree.svelte` 在根组件完成 `tick()` 后派发该事件：

```js
if (isRoot) {
  await tick();
  document.dispatchEvent(new CustomEvent('category-tree:updated', {
    detail: { url: nextUrl },
  }));
}
```

这个事件链是移动端 Docs 定位正确的关键，不要把滚动重新提前到 Swup 的 `visit:start` 或 `content:replace`。

## 语言切换必须绕过 Swup

语言切换属于整站路由语义变化，不只是容器内容变化。本项目将语言切换视为完整页面跳转，相关链接必须标记：

```html
data-no-swup
```

涉及的常见位置包括：

```text
src/components/LanguageSwitcher.astro
src/pages/[...lang]/posts/[...slug].astro
src/pages/[...lang]/docs/[...slug].astro
```

这些位置包括顶部语言选择器、文章内语言版本标识，以及“本语言无此文章，请切换到其他语言”的快捷按钮。

这样做的原因是 Navbar、搜索框、颜色选择器、日期选择器等组件中有不少 i18n 文案和持久化状态。如果语言切换仍走 Swup，容易出现 URL 已变但持久化组件文案没有同步刷新的问题。

## 其他相关改动点

本项目还对一些持久化 UI 做了配套处理：

```text
src/components/Navbar.astro
src/components/Search.svelte
src/components/widget/DisplaySettings.svelte
src/components/LanguageSwitcher.astro
src/layouts/Layout.astro
```

维护时请遵守以下原则：

1. Navbar 和音乐播放器保持在 Swup containers 外。
2. 语言切换链接使用 `data-no-swup`。
3. Docs 内部切换不替换整个 sidebar，只更新 `CategoryTree` 的 URL 状态。
4. 非 Docs 与 Docs 边界切换必须同步 `#sidebar-sticky`。
5. 移动端 Docs 定位必须等 `category-tree:updated` 后执行。

## 常见错误

### 把 `#sidebar` 加回 Swup containers

这会让左侧个人信息卡片和 `CategoryTree` 都被 Swup 替换，短期看似简单，但会破坏持久化组件设计，并且容易与手动 sidebar sync 重复执行。

### 只监听一个 Swup 事件

不同导航路径下触发顺序不同，单独监听 `astro:page-load` 或 `swup:page:view` 都可能漏掉场景。当前实现使用多个事件加 `requestAnimationFrame` 合并处理。

### 在 Docs 内部切换时直接 `refreshSidebarSticky`

这样会重新 fetch 和替换树组件，可能导致移动端滚动定位提前、树展开状态闪烁。Docs 内部应优先走 `category-tree:update-url`。

### 修改 `expandActive` 为默认展开所有带 `index.md` 的目录

这会改变 Docs 树的语义。当前规则是只展开当前 active 路径上的目录；`index.md` 只是让目录具备页面内容，不等于默认展开。

## 修改前检查清单

继续改 Swup 或 Docs 导航前，先检查：

- `astro.config.mjs` 的 containers 是否仍排除 `#navbar-wrapper` 和 `#sidebar`。
- `SideBar.astro` 是否仍只替换 `#sidebar-sticky`。
- `CategoryTree.svelte` 是否仍用 `expandActive(categories, nextUrl)` 显式按 URL 重算。
- `Layout.astro` 是否仍对移动端 Docs 内部跳转禁用 Swup 提前滚动。
- 所有语言切换入口是否仍有 `data-no-swup`。
