import { useTranslation } from 'react-i18next';
import { lessons } from '../../data/lessons';
import { useProgression } from '../../hooks/useProgression';
import LessonCard from './LessonCard';

interface LessonGridProps {
    lastSlug?: string | null;
}

export default function LessonGrid({ lastSlug }: LessonGridProps) {
    const { i18n } = useTranslation();
    const { completedLessons } = useProgression();

    return (
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            {lessons.map((lesson) => (
                <li key={lesson.id}>
                    <LessonCard
                        lesson={lesson}
                        language={i18n.language}
                        isDone={completedLessons.includes(lesson.slug)}
                        isLast={lastSlug === lesson.slug}
                    />
                </li>
            ))}
        </ol>
    );
}
