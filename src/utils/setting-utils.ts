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

let themeFrameId1: number | undefined;
let themeFrameId2: number | undefined;

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	if (typeof window === "undefined") {
		return;
	}

	// 取消之前未完成的帧调度，防止多次连续点击导致时序混乱
	if (themeFrameId1 !== undefined) {
		cancelAnimationFrame(themeFrameId1);
	}
	if (themeFrameId2 !== undefined) {
		cancelAnimationFrame(themeFrameId2);
	}

	// 第一帧：添加标志类禁用过渡（立即同步执行）
	document.documentElement.classList.add("disable-article-transitions");

	// 调度第二帧：切换主题模式并分发事件
	themeFrameId1 = requestAnimationFrame(() => {
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
		window.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme } }));

		// 强制触发一次重绘（Reflow），确保新主题颜色在“过渡禁用”的状态下被浏览器瞬间渲染完毕
		void document.documentElement.offsetHeight;

		// 调度第三帧：移除标志类，使文章本体的日常鼠标悬浮等过渡动画重获新生
		themeFrameId2 = requestAnimationFrame(() => {
			document.documentElement.classList.remove("disable-article-transitions");
			themeFrameId1 = undefined;
			themeFrameId2 = undefined;
		});
	});
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}
