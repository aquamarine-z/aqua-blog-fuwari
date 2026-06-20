const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('src/i18n/languages');
const keyFile = path.resolve('src/i18n/i18nKey.ts');
const targetDir = path.resolve('src/i18n/partials/friends');

const keysToRemove = [
    'tagFriend', 'tagSchoolmate', 'tagTeacher', 'tagLover', 'tagFamily', 
    'tagSelf', 'tagFrontend', 'tagBackend', 'tagReact'
];

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Generate keys.ts
const keysContent = `export enum FriendsKey {
    tagFriend = 'tag.friend',
    tagSchoolmate = 'tag.schoolmate',
    tagTeacher = 'tag.teacher',
    tagLover = 'tag.lover',
    tagFamily = 'tag.family',
    tagSelf = 'tag.self',
    tagFrontend = 'tag.frontend',
    tagBackend = 'tag.backend',
    tagReact = 'tag.react',
}
`;
fs.writeFileSync(path.join(targetDir, 'keys.ts'), keysContent);

// 2. Remove keys from i18nKey.ts
let keyTsContent = fs.readFileSync(keyFile, 'utf8');
const keyRegex = /^\s*(tagFriend|tagSchoolmate|tagTeacher|tagLover|tagFamily|tagSelf|tagFrontend|tagBackend|tagReact)\s*=\s*'[^']+',?\r?\n/gm;
keyTsContent = keyTsContent.replace(keyRegex, '');
fs.writeFileSync(keyFile, keyTsContent);

// 3. Process each language file
const langFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.ts'));

for (const langFile of langFiles) {
    const langPath = path.join(srcDir, langFile);
    let langContent = fs.readFileSync(langPath, 'utf8');
    
    // Extract translations
    const translations = [];
    const langRegex = /^\s*\[Key\.(tagFriend|tagSchoolmate|tagTeacher|tagLover|tagFamily|tagSelf|tagFrontend|tagBackend|tagReact)\]:\s*("[^"]+"|'[^']+'),?\r?\n/gm;
    
    let match;
    while ((match = langRegex.exec(langContent)) !== null) {
        translations.push(`    [FriendsKey.${match[1]}]: ${match[2]},`);
    }
    
    // Create new partials file if we found any translations
    if (translations.length > 0) {
        const langName = path.parse(langFile).name;
        const newContent = `import { FriendsKey } from './keys';

export const ${langName} = {
${translations.join('\n')}
};
`;
        fs.writeFileSync(path.join(targetDir, langFile), newContent);
    }
    
    // Remove from original language file
    langContent = langContent.replace(langRegex, '');
    fs.writeFileSync(langPath, langContent);
}

console.log('Refactor complete!');
