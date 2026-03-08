import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.join(__dirname, 'src', 'content', 'it');

// Let's manually write the replacements based on mismatches.json
const targetedFixes = [
  {
    file: "lesson-01.mdx",
    oldDesc: "Hai compilato un programma che stampa 'Hello World' con `printf`. Se guardi l'assembly generato con `-O2`, noterai che il compilatore ha sostituito la chiamata originale con una funzione più veloce per gestire stringhe costanti. Qual è il nome di questa funzione?",
    newDesc: "Hai compilato un programma che stampa 'Hello World' con `printf`. Se guardi l'assembly generato con `-O2`, noterai che il compilatore ha sostituito la chiamata originale con una funzione più veloce per gestire stringhe costanti. Usa `grep` per cercare la riga che chiama una funzione (contiene 'call') all'interno del file assembly `hello.s`."
  },
  {
    file: "lesson-06.mdx",
    oldDesc: "Hai due versioni dello stesso sorgente C e vuoi stampare a video solo le righe che sono state modificate tra l'uno e l'altro. Quale classico programma UNIX usi?",
    newDesc: "Hai due versioni dello stesso sorgente C e vuoi stampare a video solo le righe che sono state modificate tra l'uno e l'altro. Lancia il classico programma UNIX passandogli `file1.c` e `file2.c`."
  },
  {
    file: "lesson-10.mdx",
    oldDesc: "Il tuo programma va in Segmentation Fault ma scompare nel nulla. Per poter analizzare il crash post-mortem con GDB, devi rimuovere il limite alla dimensione dei file di dump. Qual è la parolina magica da passare a `ulimit -c`?",
    newDesc: "Il tuo programma va in Segmentation Fault ma scompare nel nulla. Per poter analizzare il crash post-mortem con GDB, devi rimuovere il limite alla dimensione dei file di dump. Usa il comando `ulimit` con l'opzione `-c` e impostalo su illimitato."
  },
  {
    file: "lesson-12.mdx",
    oldDesc: "Compila un programma `test.c` che contiene un leak. Quale strumento formidabile di Linux usi eseguendo `strumeto ./test` per scoprire se hai dimenticato una free, e ti indica anche a quale riga di codice?",
    newDesc: "Compila un programma `test.c` che contiene un leak. Esegui il formidabile strumento di Linux per la gestione della memoria per scoprire se hai dimenticato una `free` (digita solo il nome dell'eseguibile dello strumento)."
  },
  {
    // The previous script didn't match the new description for redisObject, removing expectedCommand to make it a text-based challenge again
    file: "lesson-21.mdx",
    regexFix: /expectedCommand:\s*"redisObject"/g,
    replaceFix: 'expectedOutput: "redisObject"' // Wait, it already has expectedOutput. We just need to delete expectedCommand.
  },
  {
    // Removing expectedCommand for text question
    file: "lesson-24.mdx",
    regexFix: /expectedCommand:\s*"strcmp"/g,
    replaceFix: 'expectedOutput: "strcmp"' 
  },
  {
    // Removing expectedCommand for text question
    file: "lesson-28.mdx",
    regexFix: /expectedCommand:\s*"printf"/g,
    replaceFix: 'expectedOutput: "printf"' 
  },
  {
    // Taking out expectedCommand for formula
    file: "special-random-vars.mdx",
    regexFix: /expectedCommand:\s*"rand\(\) % 100"/g,
    replaceFix: 'expectedOutput: "rand() % 100"'
  },
  {
    // Taking out expectedCommand
    file: "special-ref-counting.mdx",
    regexFix: /expectedCommand:\s*"incref"/g,
    replaceFix: 'expectedOutput: "incref"'
  }
];

function doTargetedFixes() {
    for (const action of targetedFixes) {
        const filePath = path.join(contentDir, action.file);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf-8');
            
            if (action.oldDesc && action.newDesc) {
                if (content.includes(action.oldDesc)) {
                     content = content.replace(action.oldDesc, action.newDesc);
                     fs.writeFileSync(filePath, content, 'utf-8');
                     console.log(`Replaced string in ${action.file}`);
                } else {
                     console.log(`Warning: String not found in ${action.file}`);
                }
            } else if (action.regexFix) {
                if (content.match(action.regexFix)) {
                    // Just nuke the expectedCommand line completely to revert to expectedOutput check
                    // The frontmatter already has expectedOutput, so just removing expectedCommand is enough.
                    content = content.replace(/\s*expectedCommand:\s*"[^"]*",?/g, '');
                    fs.writeFileSync(filePath, content, 'utf-8');
                    console.log(`Removed expectedCommand from ${action.file}`);
                }
            }
        }
    }
}

doTargetedFixes();
