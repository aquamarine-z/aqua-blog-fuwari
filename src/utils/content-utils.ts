import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";

// Retrieve posts and sort them by publication date
async function getRawSortedPosts(filterType: 'blog' | 'docs' | 'all' = 'blog') {
	const allBlogPosts = await getCollection("posts", ({ data, id }) => {
		const isProd = import.meta.env.PROD ? data.draft !== true : true;
		const isDocs = id.startsWith('docs/') || id.startsWith('docs\\');
		if (filterType === 'blog') return isProd && !isDocs;
		if (filterType === 'docs') return isProd && isDocs;
		return isProd;
	});

	const sorted = allBlogPosts.sort((a, b) => {
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


export async function getSortedPosts(filterType: 'blog' | 'docs' | 'all' = 'blog') {
	if (filterType === 'all') {
		const blogPosts = await getSortedPosts('blog');
		const docsPosts = await getSortedPosts('docs');
		return [...blogPosts, ...docsPosts];
	}

	let sorted = await getRawSortedPosts(filterType);

	if (filterType === 'docs') {
		const tree = await getCategoryTree('docs');
		const orderedSlugs = flattenTreeSlugs(tree); 
		sorted = sorted.filter(post => orderedSlugs.includes(post.slug));
		sorted.sort((a, b) => {
			const idxA = orderedSlugs.indexOf(a.slug);
			const idxB = orderedSlugs.indexOf(b.slug);
			return idxA - idxB;
		});
	}

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
export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(filterType: 'blog' | 'docs' | 'all' = 'blog'): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts(filterType);

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.slug,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(filterType: 'blog' | 'docs' | 'all' = 'blog'): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data, id }) => {
		const isProd = import.meta.env.PROD ? data.draft !== true : true;
		const isDocs = id.startsWith('docs/') || id.startsWith('docs\\');
		if (filterType === 'blog') return isProd && !isDocs;
		if (filterType === 'docs') return isProd && isDocs;
		return isProd;
	});

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(filterType: 'blog' | 'docs' | 'all' = 'blog'): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data, id }) => {
		const isProd = import.meta.env.PROD ? data.draft !== true : true;
		const isDocs = id.startsWith('docs/') || id.startsWith('docs\\');
		if (filterType === 'blog') return isProd && !isDocs;
		if (filterType === 'docs') return isProd && isDocs;
		return isProd;
	});
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: filterType === 'docs' ? `/docs/archive/?category=${encodeURIComponent(c.trim())}` : getCategoryUrl(c),
		});
	}
	return ret;
}

export async function getCategoryTree(filterType: 'blog' | 'docs' | 'all' = 'blog'): Promise<CategoryTreeType[]> {
	const allPosts = await getRawSortedPosts(filterType);
	
	const rootItems: CategoryTreeType[] = [];
	
	allPosts.forEach((post) => {
		let parts: string[] = [];
		if (filterType === 'docs') {
			parts = post.id.split(/[\/\\]/);
			parts.shift(); // remove "docs"
			parts.pop(); // remove filename
		} else {
			const cat = post.data.category ? String(post.data.category).trim() : i18n(I18nKey.uncategorized);
			parts = [cat];
		}
		
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
		
		if (filterType === 'docs' && post.id.match(/index\.(md|mdx)$/i) && parentFolder) {
			if (post.data.is_article) {
				parentFolder.url = `/posts/${post.slug}/`;
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
				url: `/posts/${post.slug}/`,
				sidebar_position: post.data.sidebar_position,
			});
		}
	});

	postProcessTree(rootItems);
	sortTree(rootItems);
	
	return rootItems;
}
