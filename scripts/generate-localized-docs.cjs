const fs = require('fs');
const path = require('path');
const langs = ['en', 'ja', 'ko'];
const srcDocs = path.join('src', 'pages', 'docs');

function getFiles(dir) {
    let files = [];
    for (const item of fs.readdirSync(dir, {withFileTypes: true})) {
        const full = path.join(dir, item.name);
        if (item.isDirectory()) {
            files = files.concat(getFiles(full));
        } else if (full.endsWith('.astro')) {
            files.push(full);
        }
    }
    return files;
}

const docsFiles = getFiles(srcDocs);

for (const lang of langs) {
    const langDocsDir = path.join('src', 'pages', lang, 'docs');
    for (const file of docsFiles) {
        const relPath = path.relative(srcDocs, file);
        const destFile = path.join(langDocsDir, relPath);
        fs.mkdirSync(path.dirname(destFile), { recursive: true });
        
        // Calculate relative path back to original
        const depth = relPath.split(path.sep).length;
        // relPath example: archive\category\[category].astro -> depth=3
        // from src/pages/en/docs/archive/category/[category].astro -> to src/pages/docs/archive/category/[category].astro
        // up levels needed:
        // category -> 1
        // archive -> 2
        // docs -> 3
        // en -> 4
        // so we need 4 '../' to reach src/pages, then 'docs/' + relPath
        // Wait, from src/pages/en/docs/archive/category to src/pages is 4 levels.
        // So up = depth + 1. (1 for 'docs', 1 for 'en', plus depth-1 for relPath = depth+1 total?
        // Let's test: depth = 1 (e.g. [...slug].astro). up = depth+1 = 2 ('../../').
        // Then '../../docs/[...slug].astro'. This is correct!
        
        const up = '../'.repeat(depth + 1); 
        const originalImport = (up + 'docs/' + relPath).replace(/\\/g, '/');
        
        const content = `---
import Page, { getStaticPaths as _getStaticPaths } from '${originalImport}';
export const getStaticPaths = _getStaticPaths;
const props = Astro.props;
---
<Page {...props} />`;
        fs.writeFileSync(destFile, content);
        console.log('Created', destFile);
    }
}
