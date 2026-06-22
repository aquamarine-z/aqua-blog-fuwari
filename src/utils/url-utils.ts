import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { siteConfig } from "@/config";

export function pathsEqual(path1: string, path2: string) {
	const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
	const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
	return normalizedPath1 === normalizedPath2;
}

function joinUrl(...parts: string[]): string {
	const joined = parts.join("/");
	return joined.replace(/\/+/g, "/");
}

function addLangPrefix(path: string, lang?: string): string {
	if (!lang || lang === siteConfig.lang) return path;
	if (!path.startsWith("/")) path = `/${path}`;
	return `/${lang}${path}`;
}

export function getPostUrlBySlug(slug: string, lang?: string): string {
	if (slug.startsWith("docs/")) {
		return url(addLangPrefix(`/${slug}/`, lang));
	}
	return url(addLangPrefix(`/posts/${slug}/`, lang));
}

export function getTagUrl(tag: string, type?: "blog" | "docs"): string {
	const typeParam = type ? `&type=${type}` : "";
	if (!tag) {
		if (type) return url(`/archive/?type=${type}`);
		return url("/archive/");
	}
	return url(`/archive/?tag=${encodeURIComponent(tag.trim())}${typeParam}`);
}

export function getCategoryUrl(
	category: string | null,
	type?: "blog" | "docs",
): string {
	const typeParam = type ? `&type=${type}` : "";
	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() === i18n(I18nKey.uncategorized).toLowerCase()
	)
		return url(`/archive/?uncategorized=true${typeParam}`);
	return url(
		`/archive/?category=${encodeURIComponent(category.trim())}${typeParam}`,
	);
}

export function getDir(path: string): string {
	const lastSlashIndex = path.lastIndexOf("/");
	if (lastSlashIndex < 0) {
		return "/";
	}
	return path.substring(0, lastSlashIndex + 1);
}

export function getBasePath() {
	const base = import.meta.env.BASE_URL || "/";
	if (base === "/") return "";
	return `/${base.replace(/^\/|\/$/g, "")}`;
}

export function stripBasePath(path: string) {
	const base = getBasePath();
	if (!base) return path || "/";
	if (path === base) return "/";
	if (path.startsWith(`${base}/`)) return path.slice(base.length) || "/";
	return path || "/";
}

export function url(path: string) {
	const base = getBasePath();
	if (base && path.startsWith(`${base}/`)) return path;
	if (base && path === base) return path;
	return joinUrl("", import.meta.env.BASE_URL, path);
}
