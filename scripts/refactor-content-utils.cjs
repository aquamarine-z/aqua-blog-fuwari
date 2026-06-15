const fs = require('fs');
const path = require('path');

const contentUtilsPath = path.join(__dirname, '../src/utils/content-utils.ts');
let content = fs.readFileSync(contentUtilsPath, 'utf-8');

// Replace getRawSortedBlogPosts
content = content.replace(/export async function getRawSortedBlogPosts\(\) \{/g, "export async function getRawSortedBlogPosts(lang?: string) {\n\tconst langPrefix = lang && lang !== import('../config').then(m=>m.siteConfig.lang) ? `${lang}/` : null;");
// wait, we can't use top level await easily, and siteConfig is not imported cleanly.
