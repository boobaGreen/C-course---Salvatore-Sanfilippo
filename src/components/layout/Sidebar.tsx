import { NavLink } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { lessons } from '../../data/lessons';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
    const { t, i18n } = useTranslation();

    return (
        <aside className="w-72 hidden md:block border-r border-black/5 dark:border-white/5 bg-white/40 dark:bg-[#0c0c0e]/60 backdrop-blur-xl h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 z-30">
            <div className="p-6">
                <h3 className="font-semibold text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400 mb-6 flex items-center gap-2">
                    <BookOpen size={14} />
                    {t('nav.course_index')}
                </h3>
                <nav className="space-y-2 relative">
                    {/* Decorative line */}
                    <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-black/10 via-black/10 dark:from-white/10 dark:via-white/10 to-transparent pointer-events-none" />

                    {lessons.map((lesson) => (
                        <NavLink
                            key={lesson.id}
                            to={`/lesson/${lesson.slug}`}
                            className={({ isActive }) =>
                                `group relative block pl-8 pr-4 py-2.5 text-sm rounded-r-lg transition-all duration-300 ${isActive
                                    ? 'bg-gradient-to-r from-[var(--color-brand-secondary)]/10 to-transparent text-slate-900 dark:text-zinc-100 font-medium'
                                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800/50'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Neon dot indicator */}
                                    <div className={`absolute left-[9px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-lg ${isActive
                                        ? 'bg-[var(--color-brand-secondary)] shadow-[var(--color-brand-secondary)] scale-125'
                                        : 'bg-black/10 dark:bg-white/10 group-hover:bg-slate-500 dark:group-hover:bg-zinc-400'
                                        }`} />

                                    {/* Left neon border */}
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--color-brand-secondary)] rounded-r-full shadow-[0_0_8px_var(--color-brand-secondary)]" />
                                    )}

                                    <span className="block whitespace-normal break-words">
                                        {/* Handle simple title or i18n object */}
                                        {typeof lesson.title === 'string' ? lesson.title : lesson.title[i18n.language as 'it' | 'en'] || lesson.title['it']}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </aside>
    );
}
