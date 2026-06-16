import fs from 'fs';
import path from 'path';

const oldBlogDir = path.resolve('L:/TypeScript Projects/aqua-blog-temp/blog');
const oldDocsDir = path.resolve('L:/TypeScript Projects/aqua-blog-temp/docs');
const newBlogDir = path.resolve('L:/TypeScript Projects/aqua-blog-fuwari/src/content/blog');
const newDocsDir = path.resolve('L:/TypeScript Projects/aqua-blog-fuwari/src/content/docs');

function parseFrontmatter(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return { frontmatter: {}, body: content };
    const raw = match[1];
    const frontmatter = {};
    raw.split('\n').forEach(line => {
        const idx = line.indexOf(':');
        if (idx > -1) {
            const key = line.slice(0, idx).trim();
            let value = line.slice(idx + 1).trim();
            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
            
            if (key === 'tags' || key === 'authors') {
                if (value.startsWith('[')) {
                    value = value.slice(1, -1).split(',').map(s => {
                        let t = s.trim();
                        if (t.startsWith('"') || t.startsWith("'")) t = t.slice(1, -1);
                        return t;
                    }).filter(Boolean);
                } else {
                    value = [];
                }
            }
            frontmatter[key] = value;
        }
    });
    return { frontmatter, body: content.slice(match[0].length) };
}

function processDirectory(currentDir, baseDir, categoryName) {
    if (!fs.existsSync(currentDir)) return;
    const items = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const item of items) {
        if (item.isDirectory()) {
            processDirectory(path.join(currentDir, item.name), baseDir, categoryName);
        } else if (item.name.endsWith('.md') || item.name.endsWith('.mdx')) {
            const filePath = path.join(currentDir, item.name);
            let content = fs.readFileSync(filePath, 'utf-8');
            
            // Docusaurus uses <!-- truncate -->, Astro Fuwari doesn't need it or handles it differently
            content = content.replace(/<!-- truncate -->/g, '');
            // Docusaurus specific components like <Translate> may cause issues, but we'll leave them as text if possible
            
            const { frontmatter, body } = parseFrontmatter(content);
            
            let slug = path.relative(baseDir, filePath).replace(/\\/g, '/').replace(/\.mdx?$/, '');
            if (slug.endsWith('/index')) slug = slug.replace(/\/index$/, '');
            else if (slug === 'index') slug = path.basename(currentDir) || 'index';

            let date = new Date();
            const dateMatch = path.basename(filePath).match(/^(\d{4}-\d{2}-\d{2})-(.*)/);
            if (dateMatch) {
                date = new Date(dateMatch[1]);
                slug = path.dirname(slug) + '/' + dateMatch[2].replace(/\.mdx?$/, '');
                if (slug.startsWith('./') || slug.startsWith('.\\')) slug = slug.slice(2);
            } else if (frontmatter.date) {
                date = new Date(frontmatter.date);
            }

            // Replace slashes with dashes for a flat filename, or keep directories
            const safeFileName = slug.replace(/\//g, '-') + '.md';
            
            const title = frontmatter.title || slug;
            const published = !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            const tags = Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0 ? frontmatter.tags : [categoryName];
            let extractedCategory = categoryName;
            if (categoryName === 'Docs') {
                const relPathDir = path.relative(baseDir, currentDir);
                if (relPathDir) {
                    extractedCategory = relPathDir.split(path.sep)[0];
                }
            }
            const category = extractedCategory;
            
            const newFrontmatter = `---
title: "${title}"
published: ${published}
description: "${frontmatter.description || ''}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
category: "${category}"
draft: false
lang: "zh-CN"
---
`;
            const destDir = categoryName === 'Docs' ? newDocsDir : path.join(newBlogDir, 'migrated');
            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
            
            const destPath = path.join(destDir, safeFileName);
            fs.writeFileSync(destPath, newFrontmatter + body);
            console.log(`Migrated: ${destPath}`);
        } else if (item.name.endsWith('.png') || item.name.endsWith('.jpg') || item.name.endsWith('.jpeg')) {
            // Copy images too
            const destDir = categoryName === 'Docs' ? newDocsDir : path.join(newBlogDir, 'migrated');
            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
            fs.copyFileSync(path.join(currentDir, item.name), path.join(destDir, item.name));
        }
    }
}

processDirectory(oldBlogDir, oldBlogDir, 'Blog');
processDirectory(oldDocsDir, oldDocsDir, 'Docs');
