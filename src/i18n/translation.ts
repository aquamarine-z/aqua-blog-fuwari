import { siteConfig } from "../config";
import type I18nKey from "./i18nKey";

export type Translation = Record<string, string>;

// 1. 扫描原有通用语言文件
const globalTranslations = import.meta.glob<{ [key: string]: Translation }>(
	"./languages/*.ts",
	{ eager: true },
);
// 2. 扫描所有部分(partials)的语言文件 (例如 ./partials/js-playground/zh_CN.ts)
const partialTranslations = import.meta.glob<{ [key: string]: Translation }>(
	"./partials/**/*.ts",
	{ eager: true },
);

const map: { [key: string]: Translation } = {};

function mergeTranslation(
	path: string,
	moduleObj: any,
	langName: string,
	expectedPrefix?: string,
) {
	const translation = Object.values(moduleObj)[0] as Translation;
	if (translation) {
		const processedTranslation: Translation = {};
		for (const key in translation) {
			if (expectedPrefix) {
				// Enforce that partial keys must start with the correct folder prefix
				if (!key.startsWith(expectedPrefix)) {
					throw new Error(
						`Translation key '${key}' in '${path}' must start with expected prefix '${expectedPrefix}'`,
					);
				}

				// Extract the actual key name without the auto-generated prefix
				const actualKey = key.slice(expectedPrefix.length);

				// Enforce that the underlying key name cannot start with square brackets
				if (/^\[.*?\]/.test(actualKey)) {
					throw new Error(
						`The actual partial key '${actualKey}' in '${path}' cannot start with square brackets '[...]'`,
					);
				}
			} else {
				// Global keys must not start with square brackets
				if (/^\[.*?\]/.test(key)) {
					throw new Error(
						`Global translation key '${key}' in '${path}' cannot start with square brackets '[...]'`,
					);
				}
			}
			processedTranslation[key] = translation[key];
		}
		map[langName] = { ...map[langName], ...processedTranslation };
	}
}

for (const path in globalTranslations) {
	const match = path.match(/\/languages\/([\w-]+)\.ts$/);
	if (match) {
		const langName = match[1].toLowerCase().replace(/-/g, "_");
		mergeTranslation(path, globalTranslations[path], langName);
	}
}
for (const path in partialTranslations) {
	if (path.endsWith("/keys.ts")) continue;
	const folderMatch = path.match(/\/partials\/(.+)\/([\w-]+)\.ts$/);
	if (folderMatch) {
		const folderName = folderMatch[1];
		const langName = folderMatch[2].toLowerCase().replace(/-/g, "_");
		mergeTranslation(
			path,
			partialTranslations[path],
			langName,
			`[${folderName}]`,
		);
	}
}

export function getTranslation(lang: string): Translation | undefined {
	const lower = lang.toLowerCase().replace(/-/g, "_");
	if (map[lower]) return map[lower];

	const base = lower.split("_")[0];
	return map[base];
}

export function i18n(key: string | I18nKey, lang?: string): string {
	const currentLang = lang || siteConfig.lang || "zh_CN";
	const lower = currentLang.toLowerCase().replace(/-/g, "_");

	let value = map[lower]?.[key];

	if (!value) {
		const base = lower.split("_")[0];
		value = map[base]?.[key];
	}

	if (!value) {
		const mainLower = siteConfig.lang.toLowerCase().replace(/-/g, "_");
		value = map[mainLower]?.[key];
		if (!value) {
			const mainBase = mainLower.split("_")[0];
			value = map[mainBase]?.[key];
		}
	}

	if (!value) {
		// Fallback: strip the [folder] prefix if it exists
		const strKey = String(key);
		const match = strKey.match(/^\[.*?\](.*)$/);
		return match ? match[1] : strKey;
	}

	return value;
}
