import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Code, Cpu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ASSEMBLY_O0 = `main:
    push    rbp
    mov     rbp, rsp
    sub     rsp, 16
    mov     edi, OFFSET FLAT:.LC0
    call    puts
    mov     eax, 0
    leave
    ret

.LC0:
    .string "Hello, World!"`;

const ASSEMBLY_O2 = `main:
    mov     edi, OFFSET FLAT:.LC0
    jmp     puts

.LC0:
    .string "Hello, World!"`;

export default function AssemblyExplorer() {
    const [optLevel, setOptLevel] = useState<'O0' | 'O2'>('O0');
    const { t } = useTranslation();

    const lines = (optLevel === 'O0' ? ASSEMBLY_O0 : ASSEMBLY_O2).split('\n');

    return (
        <div className="my-8 rounded-2xl border border-white/10 glass-panel overflow-hidden shadow-2xl theme-asm">
            <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Cpu size={18} className="text-[var(--color-brand-primary)]" />
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white">{t('lesson.asm_explorer.title')}</h4>
                </div>
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                    {['O0', 'O2'].map((level) => (
                        <button
                            key={level}
                            onClick={() => setOptLevel(level as 'O0' | 'O2')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${optLevel === level
                                    ? 'bg-[var(--color-brand-primary)] text-black shadow-lg'
                                    : 'text-zinc-500 hover:text-white'
                                }`}
                        >
                            -{level}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 bg-black/20">
                <div className="p-6 border-b md:border-b-0 md:border-r border-white/5">
                    <div className="flex items-center gap-2 mb-4 opacity-60">
                        <Code size={14} />
                        <span className="text-[10px] uppercase font-bold tracking-tighter">{t('lesson.asm_explorer.c_code')}</span>
                    </div>
                    <pre className="text-sm font-mono text-zinc-300">
                        <code>{`int main() {
    printf("Hello, World!\\n");
    return 0;
}`}</code>
                    </pre>

                    <div className="mt-8 p-4 rounded-xl bg-[var(--color-brand-primary)]/5 border border-[var(--color-brand-primary)]/10">
                        <p className="text-xs text-zinc-400 italic leading-relaxed">
                            {optLevel === 'O0'
                                ? t('lesson.asm_explorer.desc_o0')
                                : t('lesson.asm_explorer.desc_o2')}
                        </p>
                    </div>
                </div>

                <div className="p-6 relative">
                    <div className="flex items-center gap-2 mb-4 opacity-60">
                        <Search size={14} />
                        <span className="text-[10px] uppercase font-bold tracking-tighter">{t('lesson.asm_explorer.output_label')}</span>
                    </div>
                    <div className="font-mono text-xs space-y-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={optLevel}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                            >
                                {lines.map((line, i) => (
                                    <div key={i} className="flex gap-4 group hover:bg-white/5 transition-colors px-1 rounded">
                                        <span className="text-zinc-600 block w-4 text-right">{i + 1}</span>
                                        <span className={line.includes('LC0') ? 'text-[var(--color-brand-secondary)] font-bold' : line.startsWith('.') ? 'text-zinc-500' : 'text-zinc-200'}>
                                            {line}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
