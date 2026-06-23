import { FriendsKey } from "./i18n/partials/friends/keys";
import type {
	ExpressiveCodeConfig,
	Friend,
	GiscusConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Aqua",
	subtitle: "The French version of Fuwari",
	lang: "zh_CN", // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th', etc.
	languages: ["zh_CN", "ja", "ko", "en", "fr", "el", "he", "ru"], // Add this array to precisely match language prefixes
	themeColor: {
		hue: 300, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
		colors: [0, 50, 80, 180, 250, 300, 340], // Preset hues for the theme color picker
		customHue: true,
	},
	banner: {
		enable: false,
		src: "assets/images/demo-banner.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		{
			src: "/favicon.png",
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Blog,
		LinkPreset.Docs,
		LinkPreset.Archive,
		LinkPreset.About,
		LinkPreset.Friends,
		{
			name: "GitHub",
			url: "https://github.com/aquamarine-z",
			external: true,
			icon: "fa6-brands:github",
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "https://github.com/aquamarine-z.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Aquamarine",
	bio: "星屑を集めて、自分だけの夜空を照らす。",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/aquamarine-z",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};

export const friendsConfig: Friend[] = [
	{
		name: "Aquamarine",
		avatar: "https://github.com/aquamarine-z.png",
		labels: [
			FriendsKey.tagSelf,
			FriendsKey.tagFrontend,
			FriendsKey.tagBackend,
			FriendsKey.tagReact,
		],
		links: [
			{ name: "Github", link: "https://github.com/aquamarine-z" },
			{ name: "Blog", link: "https://blog.aquamarinez.com/" },
			{ name: "Line", link: "https://line.me/ti/p/6fcWHiO0vg" },
		],
	},
	{
		name: "Apricityx",
		avatar: "/assets/friends-avatar/Apricityx.png",
		labels: [FriendsKey.tagFriend, FriendsKey.tagSchoolmate],
		links: [
			{ name: "Github", link: "https://github.com/apricityx" },
			{ name: "Blog", link: "https://blog.apricityx.top/" },
		],
	},
	{
		name: "Winston Chen",
		avatar: "/assets/friends-avatar/WinstonChen.png",
		labels: [FriendsKey.tagFriend, FriendsKey.tagSchoolmate],
		links: [
			{ name: "Github", link: "https://github.com/WinstonCHEN1/" },
			{ name: "Blog", link: "https://winstonchen1.github.io/" },
		],
	},
	{
		name: "Syan Wang",
		avatar: "/assets/friends-avatar/SyanWang.png",
		labels: [FriendsKey.tagFriend, FriendsKey.tagSchoolmate],
		links: [
			{ name: "Github", link: "https://github.com/TheSorry404" },
			{ name: "Blog", link: "https://40404.site/" },
		],
	},
	{
		name: "Mark",
		avatar: "https://github.com/pique2233.png",
		labels: [FriendsKey.tagFriend, FriendsKey.tagSchoolmate],
		links: [{ name: "Github", link: "https://github.com/pique2233" }],
	},
];

export const giscusConfig: GiscusConfig = {
	enable: true,
	repo: "aquamarine-z/aqua-blog-discussion",
	repoId: "R_kgDONLC_uw",
	category: "General",
	categoryId: "DIC_kwDONLC_u84CkA5v",
	mapping: "specific", // We use specific mapping to share comments across languages
	strict: "0",
	reactionsEnabled: "1",
	emitMetadata: "0",
	inputPosition: "top",
	theme: "light",
	lang: "zh-CN",
	loading: "lazy",
};

export const musicConfig = {
	tracks: [
		{
			title: "Already Free (Exultation)",
			src: "/music/최정인 - Already Free (Exultation).mp3",
		},
	],
};
