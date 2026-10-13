import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Clock, CheckCircle2, Home, Circle } from 'lucide-react';
import { lessons } from '../../data/lessons';
import { useProgression } from '../../hooks/useProgression';

interface LessonHeaderProps {
    slug: string;
}

/** Breadcrumb + lesson meta + completion toggle, rendered above the MDX body. */
export default function LessonHeader({ slug }: LessonHeaderProps) {
    const { t, i18n } = useTranslation();
    const { completedLessons, completeLesson } = useProgression();
    const lang = (i18n.language === 'en' ? 'en' : 'it') as 'it' | 'en';

    const index = lessons.findIndex((l) => l.slug === slug);
    const lesson = lessons[index];
    if (!lesson) return null;

    const isDone = completedLessons.includes(slug);
    const [kicker, ...rest] = lesson.title[lang].split(':');
    const shortTitle = rest.join(':').trim() || kicker;
    const pct = Math.round(((index + 1) / lessons.length) * 100);

    return (
        <header className="mb-8 space-y-4">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-500 min-w-0">
                <Link to="/" className="inline-flex items-center gap-1 hover:text-[var(--color-brand-secondary)] transition-colors shrink-0">
                    <Home size={13} aria-hidden /> Home
                </Link>
                <ChevronRight size={13} className="shrink-0 opacity-50" aria-hidden />
                <span className="truncate text-slate-700 dark:text-zinc-300" aria-current="page">{shortTitle}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-zinc-500">
                <span className="px-2 py-1 rounded-md bg-[var(--color-brand-secondary)]/10 text-[var(--color-brand-secondary)]">
                    {kicker}
                </span>
                <span className="font-mono normal-case tracking-normal" title={t('nav.progress')}>{index + 1}/{lessons.length}</span>
                <span className="inline-flex items-center gap-1 font-mono normal-case tracking-normal">
                    <Clock size={12} aria-hidden /> {lesson.duration}
                </span>
                <button
                    type="button"
                    onClick={() => completeLesson(slug)}
                    disabled={isDone}
                    className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors normal-case tracking-normal text-xs font-semibold ${isDone
                        ? 'border-[var(--color-brand-primary)]/40 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] cursor-default'
                        : 'border-black/10 dark:border-white/10 text-slate-600 dark:text-zinc-300 hover:border-[var(--color-brand-primary)]/50 hover:text-[var(--color-brand-primary)]'
                        }`}
                    aria-pressed={isDone}
                >
                    {isDone ? <CheckCircle2 size={14} aria-hidden /> : <Circle size={14} aria-hidden />}
                    {isDone ? t('lesson_page.completed') : t('lesson_page.mark_complete')}
                    {!isDone && <span className="text-[10px] text-[var(--color-brand-primary)]">{t('lesson_page.mark_complete_hint')}</span>}
                </button>
            </div>

            <div
                className="h-1 w-full rounded-full bg-black/5 dark:bg-white/[0.06] overflow-hidden"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={lessons.length}
                aria-valuenow={index + 1}
                aria-label={t('nav.progress')}
            >
                <div className="h-full rounded-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)]" style={{ width: `${pct}%` }} />
            </div>
        </header>
    );
}
