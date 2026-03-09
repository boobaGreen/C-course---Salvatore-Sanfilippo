import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Code, Cpu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProgression } from '../../hooks/useProgression';

const ASSEMBLY_O0 = `	.file	"hello.c"
	.text
	.section	.rodata
.LC0:
	.string	"Hello, World!"
	.text
	.globl	main
	.type	main, @function
main:
.LFB0:
	.cfi_startproc
	endbr64
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset 6, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register 6
	leaq	.LC0(%rip), %rax
	movq	%rax, %rdi
	call	puts@PLT
	movl	$0, %eax
	popq	%rbp
	.cfi_def_cfa 7, 8
	ret
	.cfi_endproc
.LFE0:
	.size	main, .-main
	.ident	"GCC: (Ubuntu 13.3.0-6ubuntu2~24.04) 13.3.0"
	.section	.note.GNU-stack,"",@progbits
	.section	.note.gnu.property,"a"
	.align 8
	.long	1f - 0f
	.long	4f - 1f
	.long	5
0:
	.string	"GNU"
1:
	.align 8
	.long	0xc0000002
	.long	3f - 2f
2:
	.long	0x3
3:
	.align 8
4:`;

const ASSEMBLY_O2 = `	.file	"hello02.c"
	.text
	.section	.rodata.str1.1,"aMS",@progbits,1
.LC0:
	.string	"Hello, World!"
	.section	.text.startup,"ax",@progbits
	.p2align 4
	.globl	main
	.type	main, @function
main:
.LFB23:
	.cfi_startproc
	endbr64
	subq	$8, %rsp
	.cfi_def_cfa_offset 16
	leaq	.LC0(%rip), %rdi
	call	puts@PLT
	xorl	%eax, %eax
	addq	$8, %rsp
	.cfi_def_cfa_offset 8
	ret
	.cfi_endproc
.LFE23:
	.size	main, .-main
	.ident	"GCC: (Ubuntu 13.3.0-6ubuntu2~24.04) 13.3.0"
	.section	.note.GNU-stack,"",@progbits
	.section	.note.gnu.property,"a"
	.align 8
	.long	1f - 0f
	.long	4f - 1f
	.long	5
0:
	.string	"GNU"
1:
	.align 8
	.long	0xc0000002
	.long	3f - 2f
2:
	.long	0x3
3:
	.align 8
4:`;

export default function AssemblyExplorer() {
    const [optLevel, setOptLevel] = useState<'O0' | 'O2'>('O0');
    const { t } = useTranslation();
    const { addXP } = useProgression();

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
                            onClick={() => {
                                setOptLevel(level as 'O0' | 'O2');
                                addXP(20, `asm-explorer-${level}`);
                            }}
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
                    <div className="font-mono text-xs space-y-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
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
