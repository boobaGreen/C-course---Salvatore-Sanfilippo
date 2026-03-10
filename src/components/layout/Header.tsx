import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Languages, Menu, X, BookOpen, Zap } from 'lucide-react';
import { lessons } from '../../data/lessons';
import { AnimatePresence, motion } from 'framer-motion';
import { useProgression } from '../../hooks/useProgression';
import storage, { STORAGE_KEYS } from '../../utils/storage';

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
    };

    // Close mobile menu on navigation
    const handleLessonClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <header className="h-16 sticky top-0 z-50 w-full border-b border-black/5 dark:border-white/5 bg-white/60 dark:bg-[#0c0c0e]/80 backdrop-blur-xl">
                <div className="max-w-[1400px] mx-auto h-full px-4 sm:px-6 flex items-center gap-4">
                    {/* Hamburger — mobile only */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 -ml-1 rounded-lg border border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-colors text-slate-700 dark:text-zinc-300"
                        aria-label="Menu lezioni"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-zinc-100 hover:opacity-80 transition-opacity">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] text-white shadow-lg shadow-[var(--color-brand-primary)]/20">
                            <span className="font-mono text-sm leading-none">C_</span>
                        </div>
                        <span className="ml-1 tracking-tight hidden sm:inline">Learn <span className="text-[var(--color-brand-secondary)] font-mono">C</span></span>
                    </Link>

                    {/* Desktop/Tablet - Progress Indicator */}
                    <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-default group relative ml-1">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500 dark:text-zinc-500 leading-none mb-0.5">Level</span>
                            <span className="text-sm font-black text-slate-900 dark:text-white leading-none">{level}</span>
                        </div>
                        <div className="flex flex-col gap-1 w-24">
                            <div className="h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressToNextLevel}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] shadow-[0_0_8px_var(--color-brand-primary)]"
                                />
                            </div>
                            <span className="text-[9px] font-mono text-slate-400 dark:text-zinc-500 text-right leading-none uppercase">{xpToNextLevel} to next</span>
                        </div>
                        
                        {/* Tooltip on hover */}
                        <div className="absolute top-full right-0 mt-2 p-2 bg-zinc-900 border border-white/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] shadow-2xl pointer-events-none min-w-[120px]">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Experience</p>
                            <p className="text-sm font-mono text-white flex items-center gap-2">
                                <Zap size={12} className="text-[var(--color-brand-primary)]" fill="currentColor" />
                                {xp} XP
                            </p>
                        </div>
                    </div>

                    <div className="flex-1" />

                    <div className="flex items-center gap-2">
                        <span className="hidden lg:inline text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-widest border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
                            v1.1.0
                        </span>
                        <button
                            onClick={() => i18n.language === 'it' ? changeLanguage('en') : changeLanguage('it')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 hover:border-[var(--color-brand-secondary)]/50 hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-all text-sm font-medium"
                            title="Cambia lingua / Change language"
                        >
                            <Languages size={16} className="text-[var(--color-brand-secondary)]" />
                            {i18n.language.toUpperCase()}
                        </button>
                    </div>

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

            {/* Mobile Lesson Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="fixed top-16 left-0 bottom-0 z-50 w-[280px] bg-white dark:bg-[#18181b] border-r border-black/10 dark:border-white/10 overflow-y-auto md:hidden shadow-2xl"
                        >
                            <div className="p-5">
                                <h3 className="font-semibold text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400 mb-5 flex items-center gap-2">
                                    <BookOpen size={14} />
                                    {t('nav.course_index')}
                                </h3>
                                <nav className="space-y-1 relative">
                                    {/* Decorative line */}
                                    <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-black/10 via-black/10 dark:from-white/10 dark:via-white/10 to-transparent pointer-events-none" />

                                    {lessons.map((lesson) => (
                                        <NavLink
                                            key={lesson.id}
                                            to={`/lesson/${lesson.slug}`}
                                            onClick={handleLessonClick}
                                            className={({ isActive }) =>
                                                `group relative block pl-8 pr-4 py-2.5 text-sm rounded-r-lg transition-all duration-300 ${isActive
                                                    ? 'bg-gradient-to-r from-[var(--color-brand-secondary)]/10 to-transparent text-slate-900 dark:text-zinc-100 font-medium'
                                                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800/50'
                                                }`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <div className={`absolute left-[9px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-lg ${isActive
                                                        ? 'bg-[var(--color-brand-secondary)] shadow-[var(--color-brand-secondary)] scale-125'
                                                        : 'bg-black/10 dark:bg-white/10 group-hover:bg-slate-500 dark:group-hover:bg-zinc-400'
                                                        }`} />
                                                    {isActive && (
                                                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--color-brand-secondary)] rounded-r-full shadow-[0_0_8px_var(--color-brand-secondary)]" />
                                                    )}
                                                    <span className="block truncate">
                                                        {typeof lesson.title === 'string' ? lesson.title : lesson.title[i18n.language as 'it' | 'en'] || lesson.title['it']}
                                                    </span>
                                                </>
                                            )}
                                        </NavLink>
                                    ))}
                                </nav>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
