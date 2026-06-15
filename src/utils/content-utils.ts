import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";
import { siteConfig } from "../config";

const LANG_PREFIXES = (siteConfig.languages || ['en', 'ja', 'ko'])
    .filter(l => l !== siteConfig.lang)
    .map(l => `${l}/`);

function filterByLang(slug: string, lang?: string) {
	if (!lang || lang === siteConfig.lang) {
		return !LANG_PREFIXES.some(prefix => slug.startsWith(prefix));
	}
	return slug.startsWith(`${lang}/`);
}

function getBaseSlug(slug: string): string {
    for (const prefix of LANG_PREFIXES) {
        if (slug.startsWith(prefix)) return slug.substring(prefix.length);
    }
    return slug;
}

function getPostLang(slug: string): string {
    for (const prefix of LANG_PREFIXES) {
        if (slug.startsWith(prefix)) return prefix.replace('/', '');
    }
    return siteConfig.lang;
}

export type TranslatedPost<T extends "blog" | "docs" | "spec"> = CollectionEntry<T> & {
    isFallback?: boolean;
    availableLangs?: string[];
    originalLang?: string;
};

// Retrieve posts and sort them by publication date
export async function getRawSortedBlogPosts(lang?: string, includeHidden = false): Promise<TranslatedPost<"blog">[]> {
	const allBlogPosts = await getCollection("blog", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	
    const groups: Record<string, CollectionEntry<"blog">[]> = {};
    for (const post of allBlogPosts) {
        const base = getBaseSlug(post.slug);
        if (!groups[base]) groups[base] = [];
        groups[base].push(post);
    }

    const requestedLang = lang || siteConfig.lang;
    const processed: TranslatedPost<"blog">[] = [];

    for (const base in groups) {
        const versions = groups[base];
        const availableLangs = versions.map(v => getPostLang(v.slug));
        
        let bestPost = versions.find(v => getPostLang(v.slug) === requestedLang);
        let isFallback = false;
        
        if (!bestPost) {
            bestPost = versions.find(v => getPostLang(v.slug) === siteConfig.lang);
            isFallback = true;
        }
        if (!bestPost) {
            bestPost = versions[0];
            isFallback = true;
        }

        if (!includeHidden && !availableLangs.includes(requestedLang) && !availableLangs.includes(siteConfig.lang)) {
            continue;
        }

        processed.push({
            ...bestPost,
            data: { ...bestPost.data },
            slug: base as CollectionEntry<"blog">["slug"],
            isFallback,
            availableLangs,
            originalLang: getPostLang(bestPost.slug)
        });
    }

	const sorted = processed.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

export async function getRawSortedDocsPosts(lang?: string, includeHidden = false): Promise<TranslatedPost<"docs">[]> {
	const allDocsPosts = await getCollection("docs", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	
    const groups: Record<string, CollectionEntry<"docs">[]> = {};
    for (const post of allDocsPosts) {
        const base = getBaseSlug(post.slug);
        if (!groups[base]) groups[base] = [];
        groups[base].push(post);
    }

    const requestedLang = lang || siteConfig.lang;
    const processed: TranslatedPost<"docs">[] = [];

    for (const base in groups) {
        const versions = groups[base];
        const availableLangs = versions.map(v => getPostLang(v.slug));
        
        let bestPost = versions.find(v => getPostLang(v.slug) === requestedLang);
        let isFallback = false;
        
        if (!bestPost) {
            bestPost = versions.find(v => getPostLang(v.slug) === siteConfig.lang);
            isFallback = true;
        }
        if (!bestPost) {
            bestPost = versions[0];
            isFallback = true;
        }

        if (!includeHidden && !availableLangs.includes(requestedLang) && !availableLangs.includes(siteConfig.lang)) {
            continue;
        }

        processed.push({
            ...bestPost,
            data: { ...bestPost.data },
            slug: base as CollectionEntry<"docs">["slug"],
            isFallback,
            availableLangs,
            originalLang: getPostLang(bestPost.slug)
        });
    }

	const sorted = processed.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	for (const post of sorted) {
		if (!post.slug.startsWith("docs/")) {
			post.slug = `docs/${post.slug}` as CollectionEntry<"docs">["slug"];
		}
	}
	return sorted;
}

export async function getSpecEntry(slug: string, lang?: string): Promise<TranslatedPost<"spec"> | undefined> {
    const allSpecs = await getCollection("spec");
    
    const versions = allSpecs.filter(post => getBaseSlug(post.slug) === slug);
    if (versions.length === 0) return undefined;

    const requestedLang = lang || siteConfig.lang;
    const availableLangs = versions.map(v => getPostLang(v.slug));
    
    let bestPost = versions.find(v => getPostLang(v.slug) === requestedLang);
    let isFallback = false;
    
    if (!bestPost) {
        bestPost = versions.find(v => getPostLang(v.slug) === siteConfig.lang);
        isFallback = true;
    }
    if (!bestPost) {
        bestPost = versions[0];
        isFallback = true;
    }

    return {
        ...bestPost,
        data: { ...bestPost.data },
        slug: slug as CollectionEntry<"spec">["slug"],
        isFallback,
        availableLangs,
        originalLang: getPostLang(bestPost.slug)
    };
}

export async function getRawSortedAllPosts(lang?: string) {
	const blogPosts = await getRawSortedBlogPosts(lang);
	const docsPosts = await getRawSortedDocsPosts(lang);
	const sorted = [...blogPosts, ...docsPosts].sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

// --------------------------------------------------------
// Tree Utility Functions
// --------------------------------------------------------

export type CategoryTreeType = {
	type: 'folder' | 'file';
	name: string;
	folderName?: string;
	url?: string;
	slug?: string;
	sidebar_position?: number;
	children?: CategoryTreeType[];
};

export function flattenTreeSlugs(items: CategoryTreeType[]): string[] {
	let slugs: string[] = [];
	items.forEach(item => {
		if (item.type === 'file' && item.slug) {
			slugs.push(item.slug);
		} else if (item.type === 'folder' && item.children) {
			if (item.slug) {
				slugs.push(item.slug);
			}
			slugs.push(...flattenTreeSlugs(item.children));
		}
	});
	return slugs;
}

function sortTree(items: CategoryTreeType[]) {
	const positionMap = new Map<number, string>();
	for (const item of items) {
		if (item.sidebar_position !== undefined) {
			if (positionMap.has(item.sidebar_position)) {
				throw new Error(`Sidebar position conflict! Both '${item.name}' and '${positionMap.get(item.sidebar_position)}' have sidebar_position: ${item.sidebar_position}`);
			}
			positionMap.set(item.sidebar_position, item.name);
		}
	}

	items.sort((a, b) => {
		if (a.sidebar_position !== undefined && b.sidebar_position !== undefined) {
			if (a.sidebar_position !== b.sidebar_position) {
				return a.sidebar_position - b.sidebar_position;
			}
		} else if (a.sidebar_position !== undefined) {
			return -1;
		} else if (b.sidebar_position !== undefined) {
			return 1;
		}
		
		if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
		return a.name.localeCompare(b.name);
	});
	items.forEach(item => {
		if (item.children) sortTree(item.children);
	});
}

function postProcessTree(items: CategoryTreeType[]) {
	for (let i = items.length - 1; i >= 0; i--) {
		const item = items[i];
		if (item.type === 'folder') {
			if (item.children && item.children.length > 0) {
				postProcessTree(item.children);
			}
			
			// Re-evaluate after children processing
			if (!item.children || item.children.length === 0) {
				if (item.url) {
					// Empty folder but has a URL -> convert to file
					item.type = 'file';
					delete item.children;
				} else {
					// Truly empty, remove
					items.splice(i, 1);
				}
			}
		}
	}
}

export type PostForList = {
	slug: string;
	data: CollectionEntry<"blog">["data"] | CollectionEntry<"docs">["data"];
    isFallback?: boolean;
    availableLangs?: string[];
    originalLang?: string;
};

export async function getSortedBlogPostsList(lang?: string): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedBlogPosts(lang);
	return sortedFullPosts.map((post) => ({ slug: post.slug, data: post.data, isFallback: post.isFallback, availableLangs: post.availableLangs, originalLang: post.originalLang }));
}

export async function getSortedDocsPostsList(lang?: string): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedDocsPosts(lang);
	return sortedFullPosts.map((post) => ({ slug: post.slug, data: post.data, isFallback: post.isFallback, availableLangs: post.availableLangs, originalLang: post.originalLang }));
}

export async function getAllSortedPostsList(lang?: string): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedAllPosts(lang);
	return sortedFullPosts.map((post) => ({ slug: post.slug, data: post.data, isFallback: post.isFallback, availableLangs: post.availableLangs, originalLang: post.originalLang }));
}

export type Tag = { name: string; count: number; };

export async function getBlogTagList(lang?: string): Promise<Tag[]> {
	const allBlogPosts = await getRawSortedBlogPosts(lang);
	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});
	const keys: string[] = Object.keys(countMap).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export async function getDocsTagList(lang?: string): Promise<Tag[]> {
	const allDocsPosts = await getRawSortedDocsPosts(lang);
	const countMap: { [key: string]: number } = {};
	allDocsPosts.forEach((post) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});
	const keys: string[] = Object.keys(countMap).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export async function getAllTagList(lang?: string): Promise<Tag[]> {
	const blogTags = await getBlogTagList(lang);
	const docsTags = await getDocsTagList(lang);
	const countMap: { [key: string]: number } = {};
	for (const tag of [...blogTags, ...docsTags]) {
		countMap[tag.name] = (countMap[tag.name] || 0) + tag.count;
	}
	const keys: string[] = Object.keys(countMap).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = { name: string; count: number; url: string; };

export async function getBlogCategoryList(lang?: string): Promise<Category[]> {
	const allBlogPosts = await getRawSortedBlogPosts(lang);
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}
		const categoryName = typeof post.data.category === "string" ? post.data.category.trim() : String(post.data.category).trim();
		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});
	const lst = Object.keys(count).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
	return lst.map((c) => ({
		name: c,
		count: count[c],
		url: getCategoryUrl(c),
	}));
}

export async function getDocsCategoryList(lang?: string): Promise<Category[]> {
	const allDocsPosts = await getRawSortedDocsPosts(lang);
	const count: { [key: string]: number } = {};
	allDocsPosts.forEach((post) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}
		const categoryName = typeof post.data.category === "string" ? post.data.category.trim() : String(post.data.category).trim();
		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});
	const lst = Object.keys(count).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
	return lst.map((c) => ({
		name: c,
		count: count[c],
		url: `/docs/archive/?category=${encodeURIComponent(c.trim())}`,
	}));
}

export async function getAllCategoryList(lang?: string): Promise<Category[]> {
	const blogCats = await getBlogCategoryList(lang);
	const docsCats = await getDocsCategoryList(lang);
	const countMap: { [key: string]: { count: number, url: string } } = {};
	for (const cat of [...blogCats, ...docsCats]) {
		if (!countMap[cat.name]) {
			countMap[cat.name] = { count: cat.count, url: cat.url };
		} else {
			countMap[cat.name].count += cat.count;
		}
	}
	const keys: string[] = Object.keys(countMap).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
	return keys.map((key) => ({ name: key, count: countMap[key].count, url: countMap[key].url }));
}

export async function getBlogCategoryTree(lang?: string): Promise<CategoryTreeType[]> {
	const allPosts = await getRawSortedBlogPosts(lang);
	const rootItems: CategoryTreeType[] = [];
	allPosts.forEach((post) => {
		const parts = post.id.split(/[\/\\]/);
		if (post.originalLang && post.originalLang !== siteConfig.lang && parts[0] === post.originalLang) {
			parts.shift();
		}
		parts.pop(); // remove filename
		
		let currentLevel = rootItems;
		let parentFolder: CategoryTreeType | null = null;
		
		for (const folderName of parts) {
			let folder = currentLevel.find(item => item.type === 'folder' && item.folderName === folderName);
			if (!folder) {
				folder = { type: 'folder', name: folderName, folderName: folderName, children: [] };
				currentLevel.push(folder);
			}
			parentFolder = folder;
			currentLevel = folder.children!;
		}
		
		if (post.id.match(/index\.(md|mdx)$/i) && parentFolder) {
			parentFolder.url = `/posts/${post.slug}/`;
			parentFolder.slug = post.slug;
			if (post.data.sidebar_position !== undefined) {
				parentFolder.sidebar_position = post.data.sidebar_position;
			}
			parentFolder.name = post.data.title;
		} else {
			currentLevel.push({
				type: 'file',
				name: post.data.title,
				slug: post.slug,
				url: `/posts/${post.slug}/`,
				sidebar_position: post.data.sidebar_position,
			});
		}
	});
	postProcessTree(rootItems);
	sortTree(rootItems);
	return rootItems;
}

export async function getDocsCategoryTree(lang?: string): Promise<CategoryTreeType[]> {
	const allPosts = await getRawSortedDocsPosts(lang);
	const rootItems: CategoryTreeType[] = [];
	allPosts.forEach((post) => {
		// Wait, previously this used post.id, but now we should use original post.id from fallback?
		// No, we strip lang prefix from post.id manually to get correct structure!
		const parts = post.id.split(/[\/\\]/);
		if (post.originalLang && post.originalLang !== siteConfig.lang && parts[0] === post.originalLang) {
			parts.shift();
		}
		parts.pop(); // remove filename
		
		let currentLevel = rootItems;
		let parentFolder: CategoryTreeType | null = null;
		
		for (const folderName of parts) {
			let folder = currentLevel.find(item => item.type === 'folder' && item.folderName === folderName);
			if (!folder) {
				folder = { type: 'folder', name: folderName, folderName: folderName, children: [] };
				currentLevel.push(folder);
			}
			parentFolder = folder;
			currentLevel = folder.children!;
		}
		
		if (post.id.match(/index\.(md|mdx)$/i) && parentFolder) {
			if (post.data.is_article) {
				parentFolder.url = `/${post.slug}/`;
				parentFolder.slug = post.slug;
			}
			if (post.data.sidebar_position !== undefined) {
				parentFolder.sidebar_position = post.data.sidebar_position;
			}
			parentFolder.name = post.data.title;
		} else {
			currentLevel.push({
				type: 'file',
				name: post.data.title,
				slug: post.slug,
				url: `/${post.slug}/`,
				sidebar_position: post.data.sidebar_position,
			});
		}
	});
	
	postProcessTree(rootItems);
	sortTree(rootItems);
	return rootItems;
}

export async function getAllCategoryTree(lang?: string): Promise<CategoryTreeType[]> {
	const blogTree = await getBlogCategoryTree(lang);
	const docsTree = await getDocsCategoryTree(lang);
	return [...blogTree, ...docsTree];
}

export const getSortedBlogPosts = getRawSortedBlogPosts;
export const getSortedDocsPosts = getRawSortedDocsPosts;
export const getAllSortedPosts = getRawSortedAllPosts;
