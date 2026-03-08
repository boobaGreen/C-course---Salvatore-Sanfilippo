import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, 'src', 'content', 'it');
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));

let output = '';

files.forEach(file => {
    const content = fs.readFileSync(path.join(contentDir, file), 'utf-8');
    const regex = /<HackerTerminal[\s\S]*?\/>/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        output += `\n\n--- FILE: ${file} ---\n`;
        output += match[0];
    }
});

fs.writeFileSync(path.join(__dirname, 'hacker_terminals_dump.txt'), output);
console.log('Dumped to hacker_terminals_dump.txt');
