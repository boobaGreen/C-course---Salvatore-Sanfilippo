import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Languages } from 'lucide-react';

export default function Header() {
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'it' ? 'en' : 'it');
    };

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="sticky top-0 z-50 w-full glass-panel !border-b-0">
            <div className="flex h-16 items-center px-6 gap-4">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-zinc-100 hover:opacity-80 transition-opacity">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] text-white shadow-lg shadow-[var(--color-brand-primary)]/20">
                        <span className="font-mono text-sm leading-none">C_</span>
                    </div>
                    <span className="ml-1 tracking-tight">Learn <span className="text-[var(--color-brand-secondary)] font-mono">C</span></span>
                </Link>

                <div className="flex-1" />

                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 hover:border-[var(--color-brand-secondary)]/50 hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-all text-sm font-medium"
                    title="Cambia lingua / Change language"
                >
                    <Languages size={16} className="text-[var(--color-brand-secondary)]" />
                    {i18n.language.toUpperCase()}
                </button>

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full border border-black/10 dark:border-white/10 hover:border-[var(--color-brand-accent)]/50 hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-all text-[#eab308] dark:text-[#a78bfa]"
                    title={t('nav.theme_dark')}
                >
                    <Sun className="hidden dark:block" size={18} />
                    <Moon className="block dark:hidden" size={18} />
                </button>
            </div>
        </header>
    );
}
