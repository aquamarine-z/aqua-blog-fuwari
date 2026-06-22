import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { LinkPreset, type NavBarLink } from "@/types/config";

export const LinkPresets: {
	[key in LinkPreset]: NavBarLink & { i18nKey?: I18nKey };
} = {
	[LinkPreset.Home]: {
		name: "", // placeholder
		i18nKey: I18nKey.home,
		url: "/",
		icon: "material-symbols:home-outline-rounded",
	},
	[LinkPreset.About]: {
		name: "", // placeholder
		i18nKey: I18nKey.about,
		url: "/about/",
		icon: "material-symbols:person-outline-rounded",
	},
	[LinkPreset.Archive]: {
		name: "", // placeholder
		i18nKey: I18nKey.archive,
		url: "/archive/",
		icon: "material-symbols:archive-outline-rounded",
	},
	[LinkPreset.Friends]: {
		name: "", // placeholder
		i18nKey: I18nKey.friends,
		url: "/friends/",
		icon: "material-symbols:group-outline-rounded",
	},
	[LinkPreset.Docs]: {
		name: "", // placeholder
		i18nKey: I18nKey.docs,
		url: "/docs/intro/",
		icon: "material-symbols:menu-book-outline-rounded",
	},
	[LinkPreset.Blog]: {
		name: "", // placeholder
		i18nKey: I18nKey.blog,
		url: "/blog/",
		icon: "material-symbols:article-outline-rounded",
	},
};
