const fs = require('fs');
const path = require('path');
const dir = 'src/pages/[...lang]';

function fixImports(dirPath) {
    for (const file of fs.readdirSync(dirPath, {withFileTypes: true})) {
        const fullPath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
            fixImports(fullPath);
        } else if (fullPath.endsWith('.astro') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = content;
            
            // Replace relative imports starting with `../`
            // Specifically replacing `from '../` with `from '../../` and so on.
            modified = modified.replace(/(from |import )(['"])\.\.\//g, '$1$2../../');
            
            if (modified !== content) {
                fs.writeFileSync(fullPath, modified);
                console.log('Fixed imports in', fullPath);
            }
        }
    }
}
fixImports(dir);
