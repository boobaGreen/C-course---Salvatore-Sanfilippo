import { useTranslation } from 'react-i18next';
import { lessons } from '../../data/lessons';
import LessonCard from './LessonCard';

export default function LessonGrid() {
    const { i18n } = useTranslation();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {lessons.map((lesson) => (
                <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    language={i18n.language}
                />
            ))}
        </div>
    );
}
