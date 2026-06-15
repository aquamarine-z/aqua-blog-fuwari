const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

async function run() {
    let translate;
    try {
        const translateModule = await import('@vitalets/google-translate-api');
        translate = translateModule.translate;
    } catch (e) {
        console.error("Failed to load translator", e);
        return;
    }

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const contentDirs = [
        path.join(__dirname, '../src/content/blog'),
        path.join(__dirname, '../src/content/docs')
    ];

    async function translateText(text, isMarkdown = false) {
        if (!text || text.trim() === '') return text;
        try {
            // Very long text translation can fail. We'll try to translate up to 4000 characters chunks.
            if (text.length > 3000) {
                const chunks = text.split('\n\n');
                let translated = [];
                for (const chunk of chunks) {
                    if (chunk.trim() === '') {
                        translated.push('');
                        continue;
                    }
                    if (chunk.startsWith('```') || chunk.startsWith('<')) {
                        translated.push(chunk); // Skip code blocks or HTML
                        continue;
                    }
                    const res = await translate(chunk, { to: 'ko' });
                    translated.push(res.text);
                    await delay(500); // 500ms delay
                }
                return translated.join('\n\n');
            } else {
                const res = await translate(text, { to: 'ko' });
                return res.text;
            }
        } catch (e) {
            console.error("Translation error:", e.message);
            return text + "\n\n*(번역 실패 / Translation failed)*";
        }
    }

    async function processDirectory(dir, basePath) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            // Skip the ko/ directory itself and other locale directories to avoid loops
            if (entry.isDirectory()) {
                if (['en', 'ja', 'ko'].includes(entry.name)) continue;
                await processDirectory(fullPath, basePath);
            } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
                const relativePath = path.relative(basePath, fullPath);
                const outPath = path.join(basePath, 'ko', relativePath);
                
                if (fs.existsSync(outPath)) {
                    console.log(`Skipping existing: ${outPath}`);
                    continue;
                }

                console.log(`Translating: ${relativePath}`);
                
                const fileContent = fs.readFileSync(fullPath, 'utf-8');
                const parsed = matter(fileContent);
                
                // Translate frontmatter
                if (parsed.data.title) {
                    parsed.data.title = await translateText(parsed.data.title);
                }
                if (parsed.data.description) {
                    parsed.data.description = await translateText(parsed.data.description);
                }
                if (parsed.data.category) {
                    parsed.data.category = await translateText(parsed.data.category);
                }
                // Translate tags
                if (parsed.data.tags && Array.isArray(parsed.data.tags)) {
                    let translatedTags = [];
                    for (const tag of parsed.data.tags) {
                        translatedTags.push(await translateText(tag));
                    }
                    parsed.data.tags = translatedTags;
                }
                
                // Add language marker to frontmatter if not present
                parsed.data.lang = 'ko';
                
                // Let's add a translation prefix just in case the body fails or takes too long, we only translate the first chunk and keep the rest, OR we try to translate the body
                console.log(`Translating body for: ${relativePath}`);
                let bodyTranslated = await translateText(parsed.content, true);
                
                const outDir = path.dirname(outPath);
                if (!fs.existsSync(outDir)) {
                    fs.mkdirSync(outDir, { recursive: true });
                }
                
                const newContent = matter.stringify(bodyTranslated, parsed.data);
                fs.writeFileSync(outPath, newContent, 'utf-8');
                console.log(`Saved translated file to: ${outPath}`);
                
                // Sleep to avoid rate limits
                await delay(2000);
            }
        }
    }

    for (const dir of contentDirs) {
        console.log(`Processing directory: ${dir}`);
        const outDir = path.join(dir, 'ko');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        await processDirectory(dir, dir);
    }
    
    console.log("Translation complete!");
}

run();
