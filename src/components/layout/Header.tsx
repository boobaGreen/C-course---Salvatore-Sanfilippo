import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Languages, Menu, X, BookOpen } from 'lucide-react';
import { lessons } from '../../data/lessons';
import { AnimatePresence, motion } from 'framer-motion';

export default function Header() {
    const { t, i18n } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'it' ? 'en' : 'it');
    };

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
    };

    // Close mobile menu on navigation
    const handleLessonClick = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full glass-panel !border-b-0">
                <div className="flex h-16 items-center px-4 sm:px-6 gap-3 sm:gap-4">
                    {/* Hamburger — mobile only */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 -ml-1 rounded-lg border border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-colors text-slate-700 dark:text-zinc-300"
                        aria-label="Menu lezioni"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

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

            {/* Mobile Lesson Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
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
