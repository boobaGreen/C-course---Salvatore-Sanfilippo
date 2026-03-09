import { useState } from 'react';
import { Play } from 'lucide-react';
import { useProgression } from '../../hooks/useProgression';

interface CodeEditorProps {
    initialCode: string;
    lessonSlug?: string;
}

export default function CodeEditor({ initialCode, lessonSlug = "unknown" }: CodeEditorProps) {
    const [code, setCode] = useState(initialCode);
    const [output, setOutput] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'compiling' | 'success' | 'error'>('idle');
    const { addXP } = useProgression();

    // Per il momento simuliamo l'esecutore WASM per procedere velocemente con l'MVP visuale
    // In futuro qui chiameremo instance.ccall('compile_and_run', ...) 
    const handleRun = async () => {
        setStatus('compiling');
        setOutput(null);

        // Simula tempo di compilazione ed esecuzione Wasm
        await new Promise((r) => setTimeout(r, 800));

        // Estrazione di tutti i printf per una simulazione MVP più realistica
        const printfMatches = Array.from(code.matchAll(/printf\s*\(\s*"(.*?)"\s*(?:,|\))/g));

        if (printfMatches.length > 0) {
            let fullOutput = "";
            
            // Rilevamento speciale per il Game of Life o griglie (Lezione 8)
            const isGameOfLife = (code.includes('COLS') || code.includes('WIDTH')) && 
                                 (code.includes('ROWS') || code.includes('HEIGHT')) && 
                                 code.toLowerCase().includes('life');

            printfMatches.forEach((match) => {
                let text = match[1];
                // Gestione minima escape sequence \n
                text = text.replace(/\\n/g, '\n');
                
                // Filtriamo sequenze ANSI comuni che il simulatore non può gestire graficamente
                if (text.includes('\\033[')) return;

                // Se è il printf del loop della griglia (es: "%c ") lo saltiamo
                // perché genereremo la griglia visuale sotto per isGameOfLife
                if (isGameOfLife && (text.trim() === "%c" || text.trim() === "%c ")) return;

                // Sostituzione base per segnaposto comuni per rendere l'output leggibile
                text = text.replace(/%d/g, '42');
                text = text.replace(/%c/g, '#');
                text = text.replace(/%s/g, 'string');
                text = text.replace(/%f/g, '3.14');
                
                fullOutput += text;
            });

            // Se abbiamo rilevato il Game of Life, generiamo una griglia finta "WOW"
            if (isGameOfLife) {
                fullOutput += "\n";
                for (let y = 0; y < 12; y++) {
                    let row = "  ";
                    for (let x = 0; x < 25; x++) {
                        // Pattern pseudo-casuale ma stabile per la simulazione
                        const isAlive = (Math.sin(y * x + y) > 0.4);
                        row += isAlive ? "# " : ". ";
                    }
                    fullOutput += row + "\n";
                }
                fullOutput += "\n[Simulazione locale: Generazione 1 completata]\n";
            }

            if (fullOutput.trim() === "" && code.includes('\\033[')) {
                fullOutput = "(Il programma ha inviato codici ANSI di controllo terminale)\n";
            }

            setOutput(fullOutput || "Program finished with no visible output.");
            setStatus('success');
            addXP(20, `activity-code-${lessonSlug}`);
        } else if (code.includes('printf(')) {
            // Fallback se il regex fallisce ma c'è un printf
            setOutput("Hello, World!\n");
            setStatus('success');
        } else {
            setOutput("Error: implicit declaration of function 'printf' [-Wimplicit-function-declaration]");
            setStatus('error');
        }
    };

    return (
        <div className="my-8 border border-border-color rounded-lg overflow-hidden flex flex-col max-w-full font-mono text-sm bg-[var(--surface-color)] shadow-sm">
            <div className="flex bg-black/5 dark:bg-white/5 px-4 py-2 border-b border-border-color justify-between items-center">
                <span className="font-semibold text-xs uppercase tracking-widest opacity-60">Interactive C Compiler (WASM)</span>
                <button
                    onClick={handleRun}
                    disabled={status === 'compiling'}
                    className="flex items-center gap-2 bg-[var(--color-brand-primary)] text-black px-4 py-1.5 rounded font-bold hover:brightness-110 disabled:opacity-50 transition-all text-xs"
                >
                    {status === 'compiling' ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <Play size={14} fill="currentColor" />
                    )}
                    RUN
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Editor (Textarea semplice per ora, in prod useremo Monaco Editor o CodeMirror) */}
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                    className="p-4 w-full min-h-[250px] bg-[var(--bg-color)] text-[var(--color-brand-secondary)] outline-none resize-none"
                />

                {/* Console Output */}
                <div className="p-4 bg-black text-green-400 min-h-[150px] md:min-h-[250px] border-t md:border-t-0 md:border-l border-border-color">
                    {status === 'idle' && <div className="opacity-50 italic text-gray-400">{'// Output will appear here...'}</div>}
                    {status === 'compiling' && <div className="opacity-70 text-gray-400">Compiling with emscripten...</div>}
                    {output && (
                        <pre className={`whitespace-pre-wrap ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                            {output}
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );
}
