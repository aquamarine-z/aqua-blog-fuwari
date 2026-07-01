import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const postsSchema = z.object({
	title: z.string(),
	published: z.date(),
	updated: z.date().optional(),
	draft: z.boolean().optional().default(false),
	description: z.string().optional().default(""),
	image: z.string().optional().default(""),
	tags: z.array(z.string()).optional().default([]),
	category: z.string().optional().nullable().default(""),

	sidebar_position: z.number().optional(),
	is_article: z.boolean().optional().default(true),

	/* For internal use */
	prevTitle: z.string().default(""),
	prevSlug: z.string().default(""),
	nextTitle: z.string().default(""),
	nextSlug: z.string().default(""),
});

const blogCollection = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
	schema: postsSchema,
});

const docsCollection = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/docs' }),
	schema: postsSchema,
});

const specCollection = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/spec' }),
	schema: z.object({}),
});

export const collections = {
	blog: blogCollection,
	docs: docsCollection,
	spec: specCollection,
};
