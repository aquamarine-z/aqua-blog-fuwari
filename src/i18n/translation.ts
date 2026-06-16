import { siteConfig } from "../config";
import type I18nKey from "./i18nKey";

export type Translation = Partial<{
    [K in I18nKey]: string;
}>;

const translations = import.meta.glob<{ [key: string]: Translation }>('./languages/*.ts', { eager: true });

const map: { [key: string]: Translation } = {};

for (const path in translations) {
    const match = path.match(/\/languages\/([\w-]+)\.ts$/);
    if (match) {
        const langName = match[1].toLowerCase().replace(/-/g, '_');
        const module = translations[path];
        const translation = Object.values(module)[0];
        if (translation) {
            map[langName] = translation;
        }
    }
}

export function getTranslation(lang: string): Translation | undefined {
    const lower = lang.toLowerCase().replace(/-/g, '_');
    if (map[lower]) return map[lower];
    
    // Fallback to base language (e.g. en_us -> en)
    const base = lower.split('_')[0];
    return map[base];
}

export function i18n(key: I18nKey, lang?: string): string {
    const currentLang = lang || siteConfig.lang || "zh_CN";
    const translation = getTranslation(currentLang);
    let value = translation ? translation[key] : undefined;

    if (!value) {
        const mainTranslation = getTranslation(siteConfig.lang);
        value = mainTranslation ? mainTranslation[key] : undefined;
    }

    if (!value) {
        throw new Error(`i18n key '${key}' not found in main language ('${siteConfig.lang}')`);
    }

    return value;
}
