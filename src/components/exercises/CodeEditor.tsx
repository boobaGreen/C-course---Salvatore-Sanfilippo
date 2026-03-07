import { useState } from 'react';
import { Play } from 'lucide-react';

interface CodeEditorProps {
    initialCode: string;
}

export default function CodeEditor({ initialCode }: CodeEditorProps) {
    const [code, setCode] = useState(initialCode);
    const [output, setOutput] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'compiling' | 'success' | 'error'>('idle');

    // Per il momento simuliamo l'esecutore WASM per procedere velocemente con l'MVP visuale
    // In futuro qui chiameremo instance.ccall('compile_and_run', ...) 
    const handleRun = async () => {
        setStatus('compiling');
        setOutput(null);

        // Simula tempo di compilazione ed esecuzione Wasm
        await new Promise((r) => setTimeout(r, 800));

        if (code.includes('printf("Hello')) {
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
