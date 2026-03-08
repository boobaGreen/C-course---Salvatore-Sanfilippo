import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.join(__dirname, 'src', 'content', 'it');
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));

let mismatches = [];

files.forEach(file => {
    let content = fs.readFileSync(path.join(contentDir, file), 'utf-8');
    const terminalRegex = /<HackerTerminal\s*[\s\S]*?challenges=\{\[([\s\S]*?)\]\}/g;
    
    let terminalMatch;
    while ((terminalMatch = terminalRegex.exec(content)) !== null) {
        let lines = terminalMatch[0].split('\n');
        
        let currentId = '';
        let currentDesc = '';
        let currentExpectedCmd = '';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.includes('id:') && line.includes('"')) {
                const idMatch = line.match(/id:\s*"([^"]+)"/);
                if (idMatch) {
                    currentId = idMatch[1];
                    currentDesc = '';
                    currentExpectedCmd = '';
                }
            }
            if (line.includes('description:') && line.includes('"')) {
                const descMatch = line.match(/description:\s*"([^"]+)"/);
                if (descMatch) currentDesc = descMatch[1];
            }
            if (line.includes('expectedCommand:') && line.includes('"')) {
                const cmdMatch = line.match(/expectedCommand:\s*"([^"]+)"/);
                if (cmdMatch) {
                    currentExpectedCmd = cmdMatch[1];
                    
                    if (currentId && currentDesc) {
                         const dToLower = currentDesc.toLowerCase();
                         const asksForCommand = dToLower.includes('comand') || 
                                                dToLower.includes('usa') || 
                                                dToLower.includes('flag') || 
                                                dToLower.includes('utilit') || 
                                                dToLower.includes('bash') || 
                                                dToLower.includes('shell') || 
                                                dToLower.includes('digiti') || 
                                                dToLower.includes('lanci') || 
                                                dToLower.includes('esegui') || 
                                                dToLower.includes('grep') ||
                                                dToLower.includes('script') ||
                                                dToLower.includes('parametro');
                         
                         if (!asksForCommand) {
                             mismatches.push({
                                 file,
                                 id: currentId,
                                 desc: currentDesc,
                                 cmd: currentExpectedCmd
                             });
                         }
                    }
                }
            }
        }
    }
});

fs.writeFileSync(path.join(__dirname, 'mismatches.json'), JSON.stringify(mismatches, null, 2));
console.log("Found " + mismatches.length + " mismatches.");
