import { siteConfig } from "../config";
import {
	flattenTreeSlugs,
	getBlogCategoryTree,
	getDocsCategoryTree,
	getSortedBlogPosts,
	getSortedDocsPosts,
} from "../utils/content-utils";

export async function GET() {
	const langCode = siteConfig.lang;
	const docsTree = await getDocsCategoryTree(langCode);
	const blogTree = await getBlogCategoryTree(langCode);
	const docsSlugs = flattenTreeSlugs(docsTree);
	const blogSlugs = flattenTreeSlugs(blogTree);

	const docs = await getSortedDocsPosts(langCode);
	const blogs = await getSortedBlogPosts(langCode);

	return new Response(
		JSON.stringify(
			{
				docsSlugs,
				blogSlugs,
				docsTree,
				blogTree,
				docs: docs.map((d) => ({
					slug: d.slug,
					id: d.id,
					sidebar_position: d.data.sidebar_position,
					title: d.data.title,
				})),
				blogs: blogs.map((b) => ({
					slug: b.slug,
					id: b.id,
					sidebar_position: b.data.sidebar_position,
					title: b.data.title,
				})),
			},
			null,
			2,
		),
		{
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
}
