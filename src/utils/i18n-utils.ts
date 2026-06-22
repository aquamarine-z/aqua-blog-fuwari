import { siteConfig } from "../config";

export const locales = siteConfig.languages || [
	siteConfig.lang,
	"en",
	"ja",
	"ko",
];

export function getLangPaths() {
	const paths = locales.map((lang) => ({
		params: { lang: lang === siteConfig.lang ? undefined : lang },
	}));
	paths.push({ params: { lang: siteConfig.lang } });
	return paths;
}
