const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;

    // Fix translated import statements in tech-showcase
    content = content.replace(/'(.*)'에서\s+([A-Za-z0-9_]+)\s+가져오기/g, "import $2 from '$1'");
    content = content.replace(/'(.*)'에서\s+\{(.*)\}\s+가져오기/g, "import { $2 } from '$1'");

    // Fix relative imports: we moved from src/content/xx/ to src/content/xx/ko/
    // So any import starting with '.' needs an extra '../'
    // But only if we haven't already prefixed it
    content = content.replace(/import\s+(.*?)\s+from\s+['"](\.[^'"]+)['"]/g, (match, p1, p2) => {
        // If p2 is like '../../components', we make it '../../../components'
        // Wait, if it's already fixed, don't fix it again. We assume it's not fixed.
        if (p2.includes('comComponents')) {
            p2 = p2.replace('comComponents', 'components');
        }
        if (!p2.startsWith('../../../components')) {
            p2 = '../' + p2;
        }
        return `import ${p1} from '${p2}'`;
    });

    // Fix mangled code blocks
    content = content.replace(/``tsx/g, '```tsx');
    content = content.replace(/````타이프스크립트/g, '```typescript');
    content = content.replace(/````/g, '```');
    
    // Fix <Button 변형="기본" 클라이언트:로드> to <Button variant="default" client:load>
    content = content.replace(/클라이언트:로드/g, 'client:load');
    content = content.replace(/클라이언트:only="react"/g, 'client:only="react"');
    content = content.replace(/클라이언트:load/g, 'client:load');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Fixed ${filePath}`);
    }
}

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            processDir(fullPath);
        } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
            fixFile(fullPath);
        }
    }
}

processDir(path.join(__dirname, '../src/content/blog/ko'));
processDir(path.join(__dirname, '../src/content/docs/ko'));
