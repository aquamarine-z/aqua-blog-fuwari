const fs = require('fs');
const path = require('path');

const srcDocs = path.join('L:', 'TypeScript Projects', 'aqua-blog-temp', 'docs');
const destDocs = path.join('L:', 'TypeScript Projects', 'aqua-blog-fuwari', 'src', 'content', 'posts', 'docs');

function rmDir(dir) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

function copyDocs(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const items = fs.readdirSync(src);
    for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        if (fs.statSync(srcPath).isDirectory()) {
            copyDocs(srcPath, destPath);
        } else {
            let targetPath = destPath;
            if (targetPath.endsWith('.md')) {
                targetPath = targetPath.slice(0, -3) + '.mdx';
            }
            if (targetPath.endsWith('.mdx')) {
                let content = fs.readFileSync(srcPath, 'utf8');
                // inject published and draft if missing
                if (content.startsWith('---')) {
                    const parts = content.split('---');
                    if (parts.length >= 3) {
                        let frontmatter = parts[1];
                        if (!frontmatter.includes('published:')) {
                            frontmatter += '\npublished: 2026-06-13';
                        }
                        if (!frontmatter.includes('draft:')) {
                            frontmatter += '\ndraft: false\n';
                        }
                        parts[1] = frontmatter;
                        content = parts.join('---');
                    }
                }
                fs.writeFileSync(targetPath, content, 'utf8');
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
}

console.log('Removing old docs...');
rmDir(destDocs);
console.log('Copying and migrating docs...');
copyDocs(srcDocs, destDocs);
console.log('Done!');
