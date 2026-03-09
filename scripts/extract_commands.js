const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../src/content/it');
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));

const results = [];

files.forEach(file => {
  const filePath = path.join(contentDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // We need to parse ProTerminal challenges.
  // It looks like:
  // <ProTerminal
  //   challenges={[
  //     {
  //       id: "opt-trap",
  //       title: "L'Ottimizzazione Subdola",
  //       ...
  //       expectedCommand: "grep 'call' hello.s",
  //     },
  const regex = /id:\s*['"]([^'"]+)['"][\s\S]*?expectedCommand:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    results.push({
      file,
      id: match[1],
      command: match[2],
    });
  }
});

console.log(JSON.stringify(results, null, 2));
