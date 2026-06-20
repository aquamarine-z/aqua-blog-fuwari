import fs from 'fs';
import path from 'path';

const keysToMigrate = [
    'jsPlayground', 'jsCode', 'inputData', 'consoleOutput', 'awaitingExecution',
    'runCode', 'executing', 'reset', 'jsCodePlaceholder', 'inputDataPlaceholder'
];

const basePath = 'l:/TypeScript Projects/aqua-blog-fuwari';
const langDir = path.join(basePath, 'src/i18n/languages');
const partialsDir = path.join(basePath, 'src/i18n/partials/js-playground');
const i18nKeyFile = path.join(basePath, 'src/i18n/i18nKey.ts');

if (!fs.existsSync(partialsDir)) {
    fs.mkdirSync(partialsDir, { recursive: true });
}

// 1. Create keys.ts
const keysContent = `export enum JsPlaygroundKey {
${keysToMigrate.map(k => `    ${k} = '${k}',`).join('\n')}
}
`;
fs.writeFileSync(path.join(partialsDir, 'keys.ts'), keysContent);

// 2. Process language files
const langFiles = fs.readdirSync(langDir).filter(f => f.endsWith('.ts'));

for (const file of langFiles) {
    const filePath = path.join(langDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    let partialContent = `import { JsPlaygroundKey } from './keys';\n\nexport const ${file.replace('.ts', '')} = {\n`;
    let hasKeys = false;

    const lines = content.split('\n');
    const newLines = [];
    
    for (const line of lines) {
        let isMigratedKey = false;
        for (const k of keysToMigrate) {
            // Match exactly `[Key.xxx]:` or `Key.xxx:`
            if (line.includes(`Key.${k}`) || line.includes(`[Key.${k}]`)) {
                // Extract value
                const match = line.match(/:\s*(["'].*["']),?/);
                if (match) {
                    partialContent += `    [JsPlaygroundKey.${k}]: ${match[1]},\n`;
                    hasKeys = true;
                }
                isMigratedKey = true;
                break;
            }
        }
        if (!isMigratedKey) {
            newLines.push(line);
        }
    }
    
    partialContent += `};\n`;

    if (hasKeys) {
        fs.writeFileSync(path.join(partialsDir, file), partialContent);
    }
    
    // Clean up original file
    fs.writeFileSync(filePath, newLines.join('\n'));
}

// 3. Clean up i18nKey.ts
let i18nKeyContent = fs.readFileSync(i18nKeyFile, 'utf-8');
const keyLines = i18nKeyContent.split('\n');
const newKeyLines = keyLines.filter(line => {
    return !keysToMigrate.some(k => line.trim().startsWith(k));
});
fs.writeFileSync(i18nKeyFile, newKeyLines.join('\n'));

console.log('Migration complete.');
