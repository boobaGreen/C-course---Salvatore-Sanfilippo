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
            if (file !== 'node_modules' && file !== '.git' && file !== '.vercel') {
                getFiles(fullPath);
            }
        } else {
            if (/\.(md|mdx|ts|tsx|js|cjs|json|REPORT)$/.test(file)) {
                filesToProcess.push(fullPath);
            }
        }
    });
}

getFiles(rootDir);

const replacements = [
    [/Pro Challenge/g, 'Pro Challenge
    [/Sfida Pro/g, 'Sfida Pro'],
    [/pro-challenge/g, 'pro-challenge'],
    [/expert-edition/g, 'expert-edition'],
    [/Advanced Terminal/g, 'Advanced Terminal'],
    [/ProTerminal/g, 'ProTerminal'],
    [/Mentalità da Esperto/g, 'Mentalità da Esperto'],
    [/Advanced Knowledge/g, 'Advanced Knowledge'],
    [/Pro String/g, 'Pro String'],
    [/Pro Quiz/g, 'Pro Quiz'],
    [/Quiz Pro/g, 'Quiz Pro'],
    [/Concetti Avanzati/g, 'Concetti Avanzati'],
    [/built by experts, for future experts/g, 'built by experts, for future experts'],
    [/costruito da professionisti, per futuri professionisti/g, 'costruito da professionisti, per futuri professionisti'],
    [/pro/gi, (match) => match === 'PRO' ? 'PRO' : (match[0] === 'H' ? 'Pro' : 'pro')]
];

filesToProcess.forEach(filePath => {
    // Skip the sanitization scripts themselves
    if (filePath.includes('sanitize_') || filePath.includes('master_sanitization.js')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    for (const [regex, replacement] of replacements) {
        content = content.replace(regex, replacement);
    }

    if (content !== original) {
        console.log(`Updating ${filePath}`);
        fs.writeFileSync(filePath, content, 'utf8');
    }
});

console.log('Final Sanitization Complete.');
