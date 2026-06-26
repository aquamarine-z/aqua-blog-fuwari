import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";
import { expressiveCodeConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

export function getHue(): number {
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	// 在切换主题前，临时为文档根节点添加禁用文章过渡的标志类
	// 这使得文章本体内成千上万个公式/代码高亮节点以纯静态方式瞬时切换，杜绝卡顿
	if (typeof window !== "undefined") {
		document.documentElement.classList.add("disable-article-transitions");
	}

	switch (theme) {
		case LIGHT_MODE:
			document.documentElement.classList.remove("dark");
			break;
		case DARK_MODE:
			document.documentElement.classList.add("dark");
			break;
		case AUTO_MODE:
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			break;
	}

	// Set the theme for Expressive Code
	document.documentElement.setAttribute(
		"data-theme",
		expressiveCodeConfig.theme,
	);

	// Dispatch custom event for theme changes (e.g., for Mermaid rendering)
	if (typeof window !== "undefined") {
		window.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme } }));
	}

	if (typeof window !== "undefined") {
		// 强制触发一次重绘（Reflow），确保新主题颜色在“过渡禁用”的状态下被浏览器瞬间渲染完毕
		void document.documentElement.offsetHeight;

		// 在下一个事件循环中移除该标志类，使文章本体的日常鼠标悬浮等过渡动画重获新生
		setTimeout(() => {
			document.documentElement.classList.remove("disable-article-transitions");
		}, 0);
	}
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}
