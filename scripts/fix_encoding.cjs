const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const filesToProcess = [];

function getFiles(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.vercel' && file !== 'dist') {
                getFiles(fullPath);
            }
        } else {
            if (/\.(md|mdx|ts|tsx|js|cjs|json)$/.test(file)) {
                filesToProcess.push(fullPath);
            }
        }
    });
}

getFiles(rootDir);

const mapping = [
    // Accents
    [/Ã©/g, 'é'],
    [/Ã¨/g, 'è'],
    [/Ã /g, 'à'],
    [/Ã²/g, 'ò'],
    [/Ã¹/g, 'ù'],
    [/Ã¬/g, 'ì'],
    [/Ã€/g, 'À'],
    [/Ã‰/g, 'É'],
    [/Ãˆ/g, 'È'],
    [/Ã /g, 'à'],
    [/à /g, 'à'],
    // Aggressive Mojibake Stripping
    [/ðŸ[\u0080-\uFFFF]*/g, ''],
    [/ðŸ/g, ''],
    [/âšï¸/g, ''],
    [/âœ…/g, ''],
    [/ï¸/g, ''],
    // Specific remnants reported by user
    [/ †/g, ''], 
    [/†/g, ''],
    [/‡/g, ''],
    [/‹/g, ''],
    [/›/g, ''],
    // Strip any non-ASCII artifacts at the end of "Pro Challenge"
    [/Pro Challenge[^\w]+$/gm, 'Pro Challenge'],
    // Strip any non-ASCII artifacts at the end of "Terminal Challenge: ..."
    [/Terminal Challenge:[^#\n\r]+[^\w\s:?!.)]/gm, (match) => match.replace(/[^\w\s:?!.)]+$/, '')],
    
    // actual emojis
    [/[\u{1F300}-\u{1F9FF}]/gu, ''],
    [/[\u{1F600}-\u{1F64F}]/gu, ''],
    [/[\u{1F680}-\u{1F6FF}]/gu, ''],
    [/[\u{2600}-\u{26FF}]/gu, ''],
    [/[\u{2700}-\u{27BF}]/gu, ''],
    
    [/Ã/g, 'à']
];

filesToProcess.forEach(filePath => {
    if (filePath.endsWith('fix_encoding.cjs')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    for (const item of mapping) {
        content = content.replace(item[0], item[1]);
    }

    if (content !== original) {
        console.log(`Cleaned: ${filePath}`);
        fs.writeFileSync(filePath, content, 'utf8');
    }
});

console.log('Project Scoped Sanitization Complete.');
