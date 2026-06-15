import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";

export function pathsEqual(path1: string, path2: string) {
	const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
	const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
	return normalizedPath1 === normalizedPath2;
}

function joinUrl(...parts: string[]): string {
	const joined = parts.join("/");
	return joined.replace(/\/+/g, "/");
}

export function getPostUrlBySlug(slug: string): string {
	if (slug.startsWith("docs/")) {
		return url(`/${slug}/`);
	}
	return url(`/posts/${slug}/`);
}

export function getTagUrl(tag: string, type?: "blog" | "docs"): string {
	const typeParam = type ? `&type=${type}` : "";
	if (!tag) {
		if (type) return url(`/archive/?type=${type}`);
		return url("/archive/");
	}
	return url(`/archive/?tag=${encodeURIComponent(tag.trim())}${typeParam}`);
}

export function getCategoryUrl(category: string | null, type?: "blog" | "docs"): string {
	const typeParam = type ? `&type=${type}` : "";
	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() === i18n(I18nKey.uncategorized).toLowerCase()
	)
		return url(`/archive/?uncategorized=true${typeParam}`);
	return url(`/archive/?category=${encodeURIComponent(category.trim())}${typeParam}`);
}

export function getDir(path: string): string {
	const lastSlashIndex = path.lastIndexOf("/");
	if (lastSlashIndex < 0) {
		return "/";
	}
	return path.substring(0, lastSlashIndex + 1);
}

export function url(path: string) {
	return joinUrl("", import.meta.env.BASE_URL, path);
}
