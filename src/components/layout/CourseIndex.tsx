import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, CheckCircle2, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { lessons } from '../../data/lessons';
import { useProgression } from '../../hooks/useProgression';

interface CourseIndexProps {
    onNavigate?: () => void;
}

/** Numbered lesson list with completion state. Used by the sidebar and the mobile drawer. */
export default function CourseIndex({ onNavigate }: CourseIndexProps) {
    const { t, i18n } = useTranslation();
    const { completedLessons } = useProgression();
    const lang = (i18n.language === 'en' ? 'en' : 'it') as 'it' | 'en';
    const activeRef = useRef<HTMLAnchorElement>(null);

    const done = completedLessons.filter((s) => lessons.some((l) => l.slug === s)).length;
    const pct = Math.round((done / lessons.length) * 100);

    // Keep the active lesson visible when the index mounts
    useEffect(() => {
        activeRef.current?.scrollIntoView({ block: 'center' });
    }, []);

    return (
        <div className="p-4 sm:p-5">
            <div className="mb-4">
                <h3 className="font-semibold text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
                    <BookOpen size={14} aria-hidden />
                    {t('nav.course_index')}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 mb-1.5">
                    <span>{t('nav.lessons_done', { done, total: lessons.length })}</span>
                    <span className="font-mono">{pct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={lessons.length} aria-label={t('nav.progress')}>
                    <div className="h-full rounded-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] transition-[width] duration-500" style={{ width: `${pct}%` }} />
                </div>
            </div>

            <nav aria-label={t('nav.course_index')}>
                <ol className="space-y-0.5">
                    {lessons.map((lesson) => {
                        const isDone = completedLessons.includes(lesson.slug);
                        const isSpecial = lesson.slug.startsWith('special') || lesson.slug.includes('appendix');
                        const title = lesson.title[lang].replace(/^(Lezione|Lesson|Appendice|Appendix|Speciale|Special)\s*\d*:\s*/i, '');
                        const num = lesson.slug.match(/\d+/)?.[0] ?? '★';
                        return (
                            <li key={lesson.id}>
                                <NavLink
                                    to={`/lesson/${lesson.slug}`}
                                    onClick={onNavigate}
                                    className={({ isActive }) =>
                                        `group flex items-start gap-2.5 px-2 py-2 rounded-lg text-[13px] leading-snug transition-colors ${isActive
                                            ? 'bg-[var(--color-brand-secondary)]/10 text-slate-900 dark:text-zinc-50 font-medium'
                                            : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span
                                                ref={isActive ? activeRef : undefined}
                                                className={`mt-px w-6 h-6 shrink-0 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${isDone
                                                    ? 'bg-[var(--color-brand-primary)]/15 text-[var(--color-brand-primary)]'
                                                    : isActive
                                                        ? 'bg-[var(--color-brand-secondary)] text-white'
                                                        : isSpecial
                                                            ? 'bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)]'
                                                            : 'bg-black/5 dark:bg-white/5 text-slate-500 dark:text-zinc-500'
                                                    }`}
                                                aria-hidden
                                            >
                                                {isDone ? <CheckCircle2 size={13} /> : isSpecial && !/\d/.test(num) ? <Star size={11} /> : num.padStart(2, '0')}
                                            </span>
                                            <span className="min-w-0">
                                                {isSpecial && <span className="block text-[10px] uppercase tracking-wider text-[var(--color-brand-accent)] font-bold">{lesson.title[lang].split(':')[0]}</span>}
                                                <span className="block">{title}</span>
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </div>
    );
}
