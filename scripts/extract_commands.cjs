const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../src/content/it');
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));

const results = [];

files.forEach(file => {
  const filePath = path.join(contentDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Parse ProTerminal challenges
  const hTermRegex = /<ProTerminal\s+challenges={\[\s*([\s\S]*?)\s*\]}/g;
  let hTermMatch;
  while ((hTermMatch = hTermRegex.exec(content)) !== null) {
      const challengesBlock = hTermMatch[1];
      
      const idRegex = /id:\s*['"]([^'"]+)['"]/g;
      const cmdRegex = /expectedCommand:\s*['"]([^'"]+)['"]/g;
      
      // Since it's an array of objects, we can just look for id and expectedCommand
      // A more robust way is to split by "{"
      
      // Let's use a simple regex for the whole object if possible, or just extract them
      const challengeRegex = /{[^{}]*(?:{[^{}]*}[^{}]*)*}/g;
      let challengeMatch;
      while ((challengeMatch = challengeRegex.exec(challengesBlock)) !== null) {
          const block = challengeMatch[0];
          const idMatch = /id:\s*['"]([^'"]+)['"]/.exec(block);
          const cmdMatch = /expectedCommand:\s*['"]([^'"]+)['"]/.exec(block);
          
          if (idMatch && cmdMatch) {
              results.push({
                  file,
                  id: idMatch[1],
                  command: cmdMatch[1]
              });
          }
      }
  }
});

console.log(JSON.stringify(results, null, 2));
