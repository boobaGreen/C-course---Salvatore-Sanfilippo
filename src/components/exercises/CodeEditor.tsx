import { useState } from 'react';
import { Play, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProgression } from '../../hooks/useProgression';

interface CodeEditorProps {
    initialCode: string;
    lessonSlug?: string;
}

/**
 * Lightweight C playground. The output is a *simulation* that previews the
 * printf() calls found in the source; it is not a real compiler.
 */
export default function CodeEditor({ initialCode, lessonSlug = 'unknown' }: CodeEditorProps) {
    const [code, setCode] = useState(initialCode);
    const [output, setOutput] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'compiling' | 'success' | 'error'>('idle');
    const { addXP } = useProgression();
    const { t } = useTranslation();

    const handleRun = async () => {
        setStatus('compiling');
        setOutput(null);
        await new Promise((r) => setTimeout(r, 600));

        const printfMatches = Array.from(code.matchAll(/printf\s*\(\s*"(.*?)"\s*(?:,|\))/g));

        if (printfMatches.length > 0) {
            let fullOutput = '';
            printfMatches.forEach((match) => {
                let text = match[1];
                if (text.includes('\\033[')) return;
                text = text.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
                text = text.replace(/%d|%i|%ld|%lu|%u|%zu/g, '42').replace(/%s/g, 'string').replace(/%c/g, '#').replace(/%\.?\d*f/g, '3.14').replace(/%p/g, '0x7ffd1c2a').replace(/%x/g, '2a').replace(/%%/g, '%');
                fullOutput += text;
            });
            if (fullOutput.trim() === '' && code.includes('\\033[')) fullOutput = t('editor.ansi') + '\n';
            setOutput(fullOutput || t('editor.no_output'));
            setStatus('success');
            addXP(20, `activity-code-${lessonSlug}`);
        } else if (code.includes('printf(')) {
            setOutput('Hello, World!\n');
            setStatus('success');
        } else {
            setOutput("Error: implicit declaration of function 'printf' [-Wimplicit-function-declaration]");
            setStatus('error');
        }
    };

    // Keep Tab inside the textarea as indentation
    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const el = e.currentTarget;
            const { selectionStart, selectionEnd } = el;
            const next = code.slice(0, selectionStart) + '    ' + code.slice(selectionEnd);
            setCode(next);
            requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = selectionStart + 4; });
        }
    };

    return (
        <div className="my-8 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col max-w-full font-mono text-sm bg-white dark:bg-[#0c0c0e] shadow-sm">
            <div className="flex bg-black/5 dark:bg-white/5 px-4 py-2 border-b border-black/10 dark:border-white/10 justify-between items-center gap-3">
                <span className="min-w-0 flex items-center gap-2 text-xs">
                    <span className="font-semibold uppercase tracking-widest text-slate-600 dark:text-zinc-300 shrink-0">{t('editor.title')}</span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-slate-400 dark:text-zinc-500 truncate"><Info size={12} aria-hidden /> {t('editor.subtitle')}</span>
                </span>
                <button
                    type="button"
                    onClick={handleRun}
                    disabled={status === 'compiling'}
                    className="flex items-center gap-2 bg-[var(--color-brand-primary)] text-black px-4 py-1.5 rounded-lg font-bold hover:brightness-110 disabled:opacity-50 transition-all text-xs shrink-0"
                >
                    {status === 'compiling' ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Play size={14} fill="currentColor" aria-hidden />}
                    {t('editor.run')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={onKeyDown}
                    spellCheck={false}
                    aria-label="C source"
                    className="p-4 w-full min-h-[250px] bg-slate-50 dark:bg-[#0c0c0e] text-slate-800 dark:text-[var(--color-brand-secondary)] outline-none resize-y leading-relaxed"
                />
                <div className="p-4 bg-[#0a0a0a] text-green-400 min-h-[150px] md:min-h-[250px] border-t md:border-t-0 md:border-l border-black/10 dark:border-white/10" aria-live="polite">
                    {status === 'idle' && <div className="opacity-50 italic text-gray-400">{t('editor.placeholder')}</div>}
                    {status === 'compiling' && <div className="opacity-70 text-gray-400">{t('editor.compiling')}</div>}
                    {output && (
                        <pre className={`whitespace-pre-wrap ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>{output}</pre>
                    )}
                </div>
            </div>
        </div>
    );
}
