import { siteConfig } from "../config";

export const locales = siteConfig.languages || ["zh_CN", "en", "ja", "ko"];

export function getLangPaths() {
	return locales.map(lang => ({
		params: { lang: lang === siteConfig.lang ? undefined : lang }
	}));
}
