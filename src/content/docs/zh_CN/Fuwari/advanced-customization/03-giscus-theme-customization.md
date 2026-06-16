---
title: 深度改造评论区外观风格
sidebar_position: 8
published: 2026-06-16
---

Fuwari 默认集成 Giscus 评论区后，它的外观可能与博客的自定义主色调（Primary Color）并不完全契合。

得益于 Fuwari 灵活的架构设计，我们可以通过 **动态注入 CSS (Data URI)** 的方式，让 Giscus 的主题色 100% 实时跟随博客的全局 `hue`（色相）变化！

本文将为你揭秘这是如何做到的，并指导你如何进一步深度定制你的评论区风格。

## 原理浅析

Giscus 是通过 `iframe` 嵌入在页面中的，因此它**无法直接读取**外部网站的 CSS 变量（例如 Fuwari 定义在 `:root` 上的 `--hue`）。

为了突破这个限制，我们在引入 Giscus 的代码中，编写了一个监听器 (`MutationObserver`)，并利用 `getComputedStyle` 实时获取页面上的色相，再由前端动态拼接出一段包含 Giscus 所需 CSS 变量的字符串。最后，通过 `btoa` 将其转换为 Base64 格式的 Data URI，再利用 `postMessage` 实时发送给 iframe，从而覆盖 Giscus 的默认主题。

## 修改步骤与代码分析

如果你想进一步魔改这段代码，可以前往 `src/components/Giscus.astro` 文件进行修改。

以下是实现动态主题的核心代码解读：

```javascript
function getGiscusTheme() {
  // 1. 判断当前是否是深色模式
  const isDark = document.documentElement.classList.contains('dark');
  
  // 2. 获取博客当前的全局色相值 (Hue)，若没有则默认为 300
  const hue = getComputedStyle(document.documentElement).getPropertyValue('--hue') || '300';
  
  // 3. 为 Giscus 选择一个合适的底色主题 (匹配博客的卡片底色)
  const baseTheme = isDark ? 'catppuccin_macchiato' : 'catppuccin_latte';
  
  // 4. 动态构造覆盖 Giscus 默认样式的 CSS 字符串
  const css = `
    @import url('https://giscus.app/themes/${baseTheme}.css');
    main {
      /* 将 Giscus 的主要按钮和强调色覆盖为 oklch 颜色空间下的当前主色调 */
      --color-btn-primary-bg: oklch(0.7 0.14 ${hue});
      --color-btn-primary-border: oklch(0.7 0.14 ${hue});
      --color-btn-primary-hover-bg: oklch(0.65 0.14 ${hue});
      --color-btn-primary-hover-border: oklch(0.65 0.14 ${hue});
      --color-btn-primary-selected-bg: oklch(0.6 0.14 ${hue});
      --color-btn-primary-selected-border: oklch(0.6 0.14 ${hue});
      --color-btn-primary-disabled-bg: oklch(0.7 0.14 ${hue} / 0.5);
      --color-btn-primary-disabled-border: oklch(0.7 0.14 ${hue} / 0.5);
      --color-btn-primary-text: #ffffff;
      --color-accent-fg: oklch(0.7 0.14 ${hue});
      --color-accent-emphasis: oklch(0.7 0.14 ${hue});
      --color-accent-muted: oklch(0.7 0.14 ${hue} / 0.4);
      --color-accent-subtle: oklch(0.7 0.14 ${hue} / 0.15);
    }
    
    /* 强行替换 Catppuccin 的加载动画，改回原版 GitHub 动画，并使用 filter 将其染成同色系 */
    main .gsc-loading-image {
      background-image: url(https://github.githubassets.com/images/mona-loading-\${isDark ? 'dark' : 'default'}.gif);
      filter: hue-rotate(calc(\${hue}deg - 212deg)) saturate(\${isDark ? 1.2 : 0.5}) brightness(\${isDark ? 1.2 : 2.5});
    }
  `;
  
  // 5. 转换为 Data URI 返回，Giscus 将把其作为 custom theme 解析
  return 'data:text/css;base64,' + btoa(css);
}
```

### 进一步定制

如果你希望不仅更改按钮颜色，还要更改文字颜色、输入框边框颜色、背景颜色等，可以去查阅 [Primer CSS 变量指南](https://primer.style/primitives/colors)（Giscus 是基于 GitHub Primer 样式构建的）。

然后，你只需要在上述 `main { ... }` 块中加入你需要覆盖的属性即可。例如，更改评论框聚焦时的外发光：

```css
main {
  --color-accent-fg: oklch(0.7 0.14 ${hue}); /* 焦点边框色 */
  --color-canvas-default: transparent; /* 背景透明 */
}
```

只要掌握了这个技巧，评论区就可以随心所欲地更换任何风格，甚至完全隐藏原生样式，化身为你独有的定制版本！
