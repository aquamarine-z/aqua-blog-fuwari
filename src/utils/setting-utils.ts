import {
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

let themeChangeId = 0;
let activeThemeTransition: ViewTransition | null = null;
let fallbackThemeFrame1: number | null = null;
let fallbackThemeFrame2: number | null = null;

function cancelFallbackThemeChange(): void {
	if (fallbackThemeFrame1 !== null) cancelAnimationFrame(fallbackThemeFrame1);
	if (fallbackThemeFrame2 !== null) cancelAnimationFrame(fallbackThemeFrame2);
	fallbackThemeFrame1 = null;
	fallbackThemeFrame2 = null;
	document.documentElement.classList.remove("disable-article-transitions");
}

function shouldUseDarkMode(theme: LIGHT_DARK_MODE): boolean {
	if (theme === DARK_MODE) return true;
	if (theme === LIGHT_MODE) return false;
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyThemeState(isDark: boolean): void {
	document.documentElement.classList.toggle("dark", isDark);
	document.documentElement.setAttribute(
		"data-theme",
		expressiveCodeConfig.theme,
	);
}

function dispatchThemeChanged(theme: LIGHT_DARK_MODE): void {
	window.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme } }));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	if (typeof window === "undefined") {
		return;
	}

	const root = document.documentElement;
	const isDark = shouldUseDarkMode(theme);
	cancelFallbackThemeChange();
	if (root.classList.contains("dark") === isDark) {
		root.setAttribute("data-theme", expressiveCodeConfig.theme);
		return;
	}

	const changeId = ++themeChangeId;
	const startViewTransition = document.startViewTransition?.bind(document);

	if (!startViewTransition) {
		root.classList.add("disable-article-transitions");
		fallbackThemeFrame1 = requestAnimationFrame(() => {
			fallbackThemeFrame1 = null;
			if (changeId !== themeChangeId) return;
			applyThemeState(isDark);
			dispatchThemeChanged(theme);
			fallbackThemeFrame2 = requestAnimationFrame(() => {
				fallbackThemeFrame2 = null;
				if (changeId === themeChangeId) {
					root.classList.remove("disable-article-transitions");
				}
			});
		});
		return;
	}

	activeThemeTransition?.skipTransition();
	root.classList.add("theme-switching");

	try {
		const transition = startViewTransition(() => applyThemeState(isDark));
		activeThemeTransition = transition;

		transition.ready
			.then(() => {
				if (changeId === themeChangeId) dispatchThemeChanged(theme);
			})
			.catch(() => {});

		transition.finished.finally(() => {
			if (changeId !== themeChangeId) return;
			root.classList.remove("theme-switching");
			activeThemeTransition = null;
		});
	} catch {
		applyThemeState(isDark);
		dispatchThemeChanged(theme);
		root.classList.remove("theme-switching");
		activeThemeTransition = null;
	}
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}
