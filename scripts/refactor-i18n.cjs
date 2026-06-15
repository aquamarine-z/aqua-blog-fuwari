const fs = require('fs');
const path = require('path');

const srcPages = path.join('src', 'pages');
const destPages = path.join('src', 'pages', '[...lang]');

// Files to move to [...lang]
const filesToProcess = [
    'about.astro',
    'archive.astro',
    'friends.astro',
    'index.astro',
    'docs/archive/index.astro',
    'docs/[...slug].astro',
    'docs/[...page].astro',
    'posts/[...slug].astro',
    'blog/[...page].astro',
];

function injectGetStaticPaths(content, filePath) {
    const importStatement = "import { getLangPaths } from '@utils/i18n-utils';\n";
    let getStaticPathsExport = "";

    // Check if the file already exports getStaticPaths
    if (content.includes('export async function getStaticPaths')) {
        // We need to modify the existing getStaticPaths
        // For blog entries and docs:
        let refactored = content.replace(
            /export async function getStaticPaths\s*\(\)\s*\{([\s\S]*?)return\s+([a-zA-Z0-9_]+)\.map\(\(entry\)\s*=>\s*\{\s*return\s*\{([\s\S]*?)\};\s*\}\);?\s*\}/m,
            (match, body, varName, returnObj) => {
                // If it's the old pattern (with block map)
                return `export async function getStaticPaths() {${body}const langPaths = getLangPaths();\n\treturn langPaths.flatMap(lang => \n\t\t${varName}.map((entry) => {\n\t\t\treturn {${returnObj.replace('params: {', 'params: { lang: lang.params.lang,')}};\n\t\t})\n\t);\n}`;
            }
        );
        
        // Sometimes it's an inline return
        refactored = refactored.replace(
            /export async function getStaticPaths\s*\(\)\s*\{([\s\S]*?)return\s+([a-zA-Z0-9_]+)\.map\(\(entry\)\s*=>\s*\(\{\s*params:\s*\{([\s\S]*?)\},\s*props:\s*\{([\s\S]*?)\},?\s*\}\)\);?\s*\}/m,
            (match, body, varName, params, props) => {
                return `export async function getStaticPaths() {${body}const langPaths = getLangPaths();\n\treturn langPaths.flatMap(lang => \n\t\t${varName}.map((entry) => ({\n\t\t\tparams: { lang: lang.params.lang, ${params} },\n\t\t\tprops: { ${props} },\n\t\t}))\n\t);\n}`;
            }
        );
        
        // For paginate in [...page].astro:
        // export async function getStaticPaths({ paginate }) {
        //     const allPosts = await getSortedBlogPosts();
        //     return paginate(allPosts, { pageSize: PAGE_SIZE });
        // }
        refactored = refactored.replace(
            /export async function getStaticPaths\(\{ paginate \}\)\s*\{([\s\S]*?)return\s+paginate\(([\s\S]*?),\s*\{([\s\S]*?)\}\);?\s*\}/m,
            (match, body, data, opts) => {
                return `export async function getStaticPaths({ paginate }) {${body}const langPaths = getLangPaths();\n\treturn langPaths.flatMap(lang => \n\t\tpaginate(${data}, { ${opts}, params: { lang: lang.params.lang || undefined } })\n\t);\n}`;
            }
        );
        
        // Inject import statement if we modified it successfully
        if (refactored !== content) {
            return refactored.replace('---', '---\n' + importStatement);
        } else {
            console.error('Failed to parse getStaticPaths for', filePath);
            return content; // Return unmodified
        }
    } else {
        // It's a static page, just inject a simple getStaticPaths
        getStaticPathsExport = "export function getStaticPaths() {\n    return getLangPaths();\n}\n";
        return content.replace('---', '---\n' + importStatement + getStaticPathsExport);
    }
}

// 1. Delete physical folders
const dirsToDelete = ['en', 'ja', 'ko'];
for (const dir of dirsToDelete) {
    const p = path.join(srcPages, dir);
    if (fs.existsSync(p)) {
        fs.rmSync(p, { recursive: true, force: true });
        console.log(`Deleted ${p}`);
    }
}

// 2. Create [...lang] directory structure
for (const file of filesToProcess) {
    const srcPath = path.join(srcPages, file);
    if (fs.existsSync(srcPath)) {
        const destPath = path.join(destPages, file);
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        
        let content = fs.readFileSync(srcPath, 'utf8');
        content = injectGetStaticPaths(content, file);
        fs.writeFileSync(destPath, content);
        console.log(`Moved and refactored ${file} -> [...lang]`);
        fs.unlinkSync(srcPath); // remove original
    } else {
        console.warn(`File not found: ${srcPath}`);
    }
}

// Clean up empty directories in src/pages
const emptyDirs = ['docs/archive', 'docs', 'posts', 'blog'];
for (const dir of emptyDirs) {
    const p = path.join(srcPages, dir);
    if (fs.existsSync(p) && fs.readdirSync(p).length === 0) {
        fs.rmdirSync(p);
    }
}

console.log('Refactoring complete.');
