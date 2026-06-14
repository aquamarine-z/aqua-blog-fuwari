import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";

// Retrieve posts and sort them by publication date
export async function getRawSortedBlogPosts() {
	const allBlogPosts = await getCollection("blog", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	return allBlogPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
}

export async function getRawSortedDocsPosts() {
	const allDocsPosts = await getCollection("docs", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const sorted = allDocsPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	for (const post of sorted) {
		post.slug = `docs/${post.slug}`;
	}
	return sorted;
}

export async function getRawSortedAllPosts() {
	const blogPosts = await getRawSortedBlogPosts();
	const docsPosts = await getRawSortedDocsPosts();
	return [...blogPosts, ...docsPosts].sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
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

export function postProcessTree(items: CategoryTreeType[]) {
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		if (item.type === 'folder' && item.children) {
			postProcessTree(item.children);
			if (item.children.length === 0 && item.url) {
				item.type = 'file';
				delete item.children;
			}
		}
	}
}

export function sortTree(items: CategoryTreeType[]) {
	const positions = new Set<number>();
	for (const item of items) {
		if (item.sidebar_position !== undefined) {
			if (positions.has(item.sidebar_position)) {
				throw new Error(`Duplicate sidebar_position ${item.sidebar_position} found at the same level! Please ensure each sidebar_position is unique within its directory.`);
			}
			positions.add(item.sidebar_position);
		}
	}

	items.sort((a, b) => {
		const posA = a.sidebar_position ?? Number.MAX_SAFE_INTEGER;
		const posB = b.sidebar_position ?? Number.MAX_SAFE_INTEGER;
		if (posA !== posB) return posA - posB;

		if (a.type !== b.type) {
			return a.type === 'folder' ? -1 : 1;
		}
		return a.name.localeCompare(b.name);
	});
	items.forEach(item => {
		if (item.children) sortTree(item.children);
	});
}

// --------------------------------------------------------
// Post Retrieval & Processing
// --------------------------------------------------------

export async function getSortedBlogPosts() {
	const sorted = await getRawSortedBlogPosts();
	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}
	return sorted;
}

export async function getSortedDocsPosts() {
	let sorted = await getRawSortedDocsPosts();
	const tree = await getDocsCategoryTree();
	const orderedSlugs = flattenTreeSlugs(tree); 
	sorted = sorted.filter(post => orderedSlugs.includes(post.slug));
	sorted.sort((a, b) => {
		const idxA = orderedSlugs.indexOf(a.slug);
		const idxB = orderedSlugs.indexOf(b.slug);
		return idxA - idxB;
	});
	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}
	return sorted;
}

export async function getAllSortedPosts() {
	const blogPosts = await getSortedBlogPosts();
	const docsPosts = await getSortedDocsPosts();
	return [...blogPosts, ...docsPosts];
}

export type PostForList = {
	slug: string;
	data: CollectionEntry<"blog">["data"] | CollectionEntry<"docs">["data"];
};

export async function getSortedBlogPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedBlogPosts();
	return sortedFullPosts.map((post) => ({ slug: post.slug, data: post.data }));
}

export async function getSortedDocsPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedDocsPosts();
	return sortedFullPosts.map((post) => ({ slug: post.slug, data: post.data }));
}

export async function getAllSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedAllPosts();
	return sortedFullPosts.map((post) => ({ slug: post.slug, data: post.data }));
}

export type Tag = { name: string; count: number; };

export async function getBlogTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection("blog", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
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

export async function getDocsTagList(): Promise<Tag[]> {
	const allDocsPosts = await getCollection("docs", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
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

export async function getAllTagList(): Promise<Tag[]> {
	const blogTags = await getBlogTagList();
	const docsTags = await getDocsTagList();
	const countMap: { [key: string]: number } = {};
	for (const tag of [...blogTags, ...docsTags]) {
		countMap[tag.name] = (countMap[tag.name] || 0) + tag.count;
	}
	const keys: string[] = Object.keys(countMap).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = { name: string; count: number; url: string; };

export async function getBlogCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection("blog", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
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

export async function getDocsCategoryList(): Promise<Category[]> {
	const allDocsPosts = await getCollection("docs", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
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

export async function getAllCategoryList(): Promise<Category[]> {
	const blogCats = await getBlogCategoryList();
	const docsCats = await getDocsCategoryList();
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

export async function getBlogCategoryTree(): Promise<CategoryTreeType[]> {
	const allPosts = await getRawSortedBlogPosts();
	const rootItems: CategoryTreeType[] = [];
	allPosts.forEach((post) => {
		const cat = post.data.category ? String(post.data.category).trim() : i18n(I18nKey.uncategorized);
		const parts = [cat];
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
		currentLevel.push({
			type: 'file',
			name: post.data.title,
			slug: post.slug,
			url: `/posts/${post.slug}/`,
			sidebar_position: post.data.sidebar_position,
		});
	});
	postProcessTree(rootItems);
	sortTree(rootItems);
	return rootItems;
}

export async function getDocsCategoryTree(): Promise<CategoryTreeType[]> {
	const allPosts = await getRawSortedDocsPosts();
	const rootItems: CategoryTreeType[] = [];
	allPosts.forEach((post) => {
		const parts = post.id.split(/[\/\\]/);
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

export async function getAllCategoryTree(): Promise<CategoryTreeType[]> {
	const blogTree = await getBlogCategoryTree();
	const docsTree = await getDocsCategoryTree();
	return [...blogTree, ...docsTree];
}
