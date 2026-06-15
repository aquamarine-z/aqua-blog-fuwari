const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function processDir(koDir, origDir) {
    if (!fs.existsSync(koDir)) return;
    const entries = fs.readdirSync(koDir, { withFileTypes: true });

    for (const entry of entries) {
        const koPath = path.join(koDir, entry.name);
        const origPath = path.join(origDir, entry.name);

        if (entry.isDirectory()) {
            processDir(koPath, origPath);
        } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
            if (!fs.existsSync(origPath)) continue;

            const koParsed = matter(fs.readFileSync(koPath, 'utf-8'));
            const origParsed = matter(fs.readFileSync(origPath, 'utf-8'));

            // Take original body
            let body = origParsed.content;

            // Only fix relative paths that escape the content folder (e.g., ../../components)
            body = body.replace(/import\s+(.*?)\s+from\s+['"](\.\.\/\.\.[^'"]+)['"]/g, (match, p1, p2) => {
                return `import ${p1} from '../${p2}'`;
            });
            // What about markdown image paths that escape? Same logic
            body = body.replace(/\]\(\.\.\/\.\.\//g, '](../../../');
            body = body.replace(/src=["']\.\.\/\.\.\//g, 'src="../../../');

            // Write back with ko frontmatter
            const newContent = matter.stringify(body, koParsed.data);
            fs.writeFileSync(koPath, newContent, 'utf-8');
            console.log(`Restored body for ${koPath}`);
        }
    }
}

processDir(path.join(__dirname, '../src/content/blog/ko'), path.join(__dirname, '../src/content/blog'));
processDir(path.join(__dirname, '../src/content/docs/ko'), path.join(__dirname, '../src/content/docs'));
