import type { ReactNode } from 'react';
import { Lightbulb, AlertTriangle, Info, Terminal } from 'lucide-react';

interface CalloutProps {
    children: ReactNode;
    type?: 'tip' | 'warning' | 'info' | 'hacker';
    title?: string;
}

export default function Callout({ children, type = 'tip', title }: CalloutProps) {
    const styles = {
        tip: {
            icon: <Lightbulb className="text-yellow-400" size={20} />,
            bg: 'bg-yellow-500/5',
            border: 'border-yellow-500/20',
            titleColor: 'text-yellow-400',
            defaultTitle: 'Suggerimento'
        },
        warning: {
            icon: <AlertTriangle className="text-red-400" size={20} />,
            bg: 'bg-red-500/5',
            border: 'border-red-500/20',
            titleColor: 'text-red-400',
            defaultTitle: 'Attenzione'
        },
        info: {
            icon: <Info className="text-blue-400" size={20} />,
            bg: 'bg-blue-500/5',
            border: 'border-blue-500/20',
            titleColor: 'text-blue-400',
            defaultTitle: 'Nota'
        },
        hacker: {
            icon: <Terminal className="text-[var(--color-brand-primary)]" size={20} />,
            bg: 'bg-[var(--color-brand-primary)]/5',
            border: 'border-[var(--color-brand-primary)]/20',
            titleColor: 'text-[var(--color-brand-primary)]',
            defaultTitle: 'Hacker Mindset'
        }
    };

    const current = styles[type];

    return (
        <div className={`my-6 p-5 rounded-2xl border ${current.border} ${current.bg} backdrop-blur-sm shadow-lg`}>
            <div className="flex items-center gap-3 mb-2">
                {current.icon}
                <span className={`text-xs font-black uppercase tracking-widest ${current.titleColor}`}>
                    {title || current.defaultTitle}
                </span>
            </div>
            <div className="text-sm dark:text-zinc-300 text-slate-700 leading-relaxed italic">
                {children}
            </div>
        </div>
    );
}
