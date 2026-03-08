import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, 'src', 'content', 'it');
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));

console.log(`Starting migration of ${files.length} files...`);

let modifiedCount = 0;

files.forEach(file => {
    const filePath = path.join(contentDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    const terminalRegex = /<HackerTerminal\s+challenges={(\[[\s\S]*?\])}\s*\/>/g;
    
    let fileModified = false;
    
    const newContent = content.replace(terminalRegex, (match, arrayString) => {
        try {
            // Carefully evaluate the array. We prepend let challenges = to make it a valid script.
            // Since there are no complex functions, just objects, eval should work if we wrap it.
            let challenges = eval(`(${arrayString})`);
            
            challenges = challenges.map(ch => {
                const desc = ch.description.toLowerCase();
                const isCommandPredict = 
                    desc.includes('quale comando') || 
                    desc.includes('usa il comando') || 
                    desc.includes('comando linux') ||
                    desc.includes('comando shell') ||
                    desc.includes('comando bash') ||
                    desc.includes('esegui un comando');
                
                if (isCommandPredict && ch.commands && ch.commands.length > 0) {
                    // Extract the first command as the expected command
                    ch.expectedCommand = ch.commands[0];
                    // Keep the expectedOutput as it might be useful for success messages, or we can clear it.
                    // Actually, if we guess the command, expectedOutput doesn't matter much for validation, 
                    // but we can leave it or remove it. Let's keep it but the component will prioritize expectedCommand.
                    // We also empty the commands array so the UI doesn't show the answer *before* they guess!
                    // Wait, if we empty it, maybe the UI needs to know previous commands?
                    // Typically, these challenges only have 1 command which IS the answer.
                    // So we clear `commands` to not give it away.
                    
                    // Actually, let's keep `commands: []` so the component knows there's no preamble.
                    ch.commands = []; 
                    fileModified = true;
                }
                return ch;
            });
            
            // Serialize back to string
            const newArrayStr = JSON.stringify(challenges, null, 4)
                // Fix quotes for keys if needed for perfectly valid JS object literal matching MDX style
                // but JSON is valid JS, so it's fine.
                .replace(/"([^"]+)":/g, '$1:');
                
            return `<HackerTerminal \n  challenges={${newArrayStr}}\n/>`;
            
        } catch (e) {
            console.error(`Failed to parse challenges in ${file}`);
            return match;
        }
    });

    if (fileModified) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        modifiedCount++;
    }
});

console.log(`Migration complete. Modified ${modifiedCount} files.`);
