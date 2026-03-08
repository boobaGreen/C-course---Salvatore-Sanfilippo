import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.resolve('./src/content/it');

function processChallenges(content) {
  let modified = false;

  const regex = /<HackerTerminal\s+challenges={(\[[\s\S]*?\])}\s*\/>/g;
  
  const newContent = content.replace(regex, (match, challengesStr) => {
    try {
      // Evaluate the challenges array
      const challenges = eval(challengesStr);
      let changedThisBlock = false;

      for (let i = 0; i < challenges.length; i++) {
        const c = challenges[i];
        const desc = c.description.toLowerCase();

        // Check if it's asking for a command, flag, tool, macro, function
        const asksForCommand = /quale comando|qual è il comando|quale flag|quale strumento|quale macro|quale funzione|usa il comando|comando linux|scrivi l\'espressione/.test(desc);

        // If it asks for a command, but expectedCommand is not set, we should set it
        if (asksForCommand && !c.expectedCommand && c.commands && c.commands.length > 0) {
            // Usually the last command is the answer
            c.expectedCommand = c.commands[c.commands.length - 1];
            c.commands = []; // clear commands to avoid leaking
            changedThisBlock = true;
        }

        // Even if expectedCommand is set, ensure commands array doesn't leak it
        if (c.expectedCommand && c.commands) {
            const hasLeak = c.commands.some(cmd => cmd.trim() === c.expectedCommand.trim() || c.expectedCommand.includes(cmd.trim()));
            if (hasLeak || c.commands.length === 1) { // If there's only 1 command and it asks for a command, safe to clear
                c.commands = [];
                changedThisBlock = true;
            }
        }

        // Check for arbitrary question leaks (expectedOutput is leaked in commands)
        if (c.expectedOutput && c.commands) {
            const hasLeak = c.commands.some(cmd => cmd.trim() === c.expectedOutput.trim() || cmd.trim() === `"${c.expectedOutput.trim()}"`);
            if (hasLeak) {
                c.commands = [];
                changedThisBlock = true;
            }
        }
      }

      if (changedThisBlock) {
        modified = true;
        // Format the new challenges array nicely
        const newChallengesStr = JSON.stringify(challenges, null, 4)
             // remove quotes around keys
            .replace(/"([^"]+)":/g, '$1:')
            // unescape quotes in description/hints safely by just keeping standard JSON formatting but adjusting keys
            // Wait, JSON.stringify escapes double quotes inside strings. 
            // MDX files usually use double quotes. This is fine.
            ;
        
        return `<HackerTerminal \n  challenges={${newChallengesStr}}\n/>`;
      }

    } catch (e) {
      console.error("Error evaluating challenges:", e);
    }
    return match;
  });

  return { newContent, modified };
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let totalModified = 0;

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      totalModified += processDirectory(fullPath);
    } else if (file.endsWith('.mdx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const { newContent, modified } = processChallenges(content);
      
      if (modified) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Fixed leaks in: ${file}`);
        totalModified++;
      }
    }
  }
  return totalModified;
}

const modifiedCount = processDirectory(CONTENT_DIR);
console.log(`\nSecond pass complete. Modified ${modifiedCount} files.`);
