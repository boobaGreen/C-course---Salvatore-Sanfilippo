import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Languages, Menu, X, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useProgression } from '../../hooks/useProgression';
import storage, { STORAGE_KEYS } from '../../utils/storage';
import CourseIndex from './CourseIndex';

const APP_VERSION = __APP_VERSION__;

export default function Header() {
    const { t, i18n } = useTranslation();
    const { xp, level, progressToNextLevel, xpToNextLevel } = useProgression();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleTheme = () => {
        const isDark = document.documentElement.classList.toggle('dark');
        storage.set(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        storage.set(STORAGE_KEYS.LANGUAGE, lng);
        document.documentElement.lang = lng;
    };

    // Close the drawer with Escape
    useEffect(() => {
        if (!isMenuOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMenuOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isMenuOpen]);

    const iconBtn = 'h-9 px-2.5 inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-colors text-slate-700 dark:text-zinc-300';

    return (
        <>
            <a href="#main-content" className="skip-link">{t('nav.skip')}</a>
            <header className="h-16 sticky top-0 z-50 w-full border-b border-black/5 dark:border-white/5 bg-white/70 dark:bg-[#0c0c0e]/80 backdrop-blur-xl">
                <div className="max-w-[1400px] mx-auto h-full px-4 sm:px-6 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((o) => !o)}
                        className={`md:hidden ${iconBtn} -ml-1`}
                        aria-label={t('nav.menu')}
                        aria-expanded={isMenuOpen}
                        aria-controls="lesson-drawer"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-zinc-100 hover:opacity-80 transition-opacity" aria-label="Learn C, home">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] text-white shadow-lg shadow-[var(--color-brand-primary)]/20">
                            <span className="font-mono text-sm leading-none">C_</span>
                        </div>
                        <span className="ml-1 tracking-tight hidden sm:inline">Learn <span className="text-[var(--color-brand-secondary)] font-mono">C</span></span>
                    </Link>

                    {/* XP / level pill */}
                    <div
                        className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full ml-1 group relative"
                        tabIndex={0}
                        aria-label={`${t('nav.level')} ${level}, ${xp} XP`}
                    >
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 leading-none mb-0.5">{t('nav.level')}</span>
                            <span className="text-sm font-black text-slate-900 dark:text-white leading-none">{level}</span>
                        </div>
                        <div className="flex flex-col gap-1 w-24">
                            <div className="h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressToNextLevel}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)]"
                                />
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-500 text-right leading-none">{t('nav.to_next', { xp: xpToNextLevel })}</span>
                        </div>
                        <div className="absolute top-full right-0 mt-2 p-3 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-[100] shadow-2xl pointer-events-none min-w-[140px]" role="tooltip">
                            <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest mb-1">{t('nav.total_xp')}</p>
                            <p className="text-sm font-mono text-slate-900 dark:text-white flex items-center gap-2">
                                <Zap size={12} className="text-[var(--color-brand-primary)]" fill="currentColor" />
                                {xp} XP
                            </p>
                        </div>
                    </div>

                    <div className="flex-1" />

                    <span className="hidden lg:inline text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-widest border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
                        v{APP_VERSION}
                    </span>
                    <button
                        type="button"
                        onClick={() => changeLanguage(i18n.language === 'it' ? 'en' : 'it')}
                        className={`${iconBtn} text-sm font-semibold`}
                        aria-label={t('nav.language')}
                        title={t('nav.language')}
                    >
                        <Languages size={16} className="text-[var(--color-brand-secondary)]" />
                        {i18n.language.toUpperCase()}
                    </button>
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className={`${iconBtn} w-9 px-0 text-[#eab308] dark:text-[#a78bfa]`}
                        aria-label={t('nav.theme_dark')}
                        title={t('nav.theme_dark')}
                    >
                        <Sun className="hidden dark:block" size={18} />
                        <Moon className="block dark:hidden" size={18} />
                    </button>
                </div>
            </header>

            {/* Mobile lesson drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                            aria-hidden
                        />
                        <motion.div
                            id="lesson-drawer"
                            role="dialog"
                            aria-label={t('nav.course_index')}
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="fixed top-16 left-0 bottom-0 z-50 w-[300px] max-w-[85vw] bg-white dark:bg-[#18181b] border-r border-black/10 dark:border-white/10 overflow-y-auto md:hidden shadow-2xl"
                        >
                            <CourseIndex onNavigate={() => setIsMenuOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
