const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'src', 'content');

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.mdx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;

            // Fix malformed title attribute in Quizzes
            // Pattern: title="Pro Challenge (missing " at end of line)
            if (content.match(/title="Pro Challenge$/m)) {
                content = content.replace(/title="Pro Challenge$/gm, 'title="Pro Challenge"');
                changed = true;
                console.log(`Fixed malformed title in ${fullPath}`);
            }

            if (changed) {
                fs.writeFileSync(fullPath, content, 'utf8');
            }
        }
    }
}

walk(baseDir);
console.log('Done.');
