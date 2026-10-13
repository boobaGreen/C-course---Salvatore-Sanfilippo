import CourseIndex from './CourseIndex';

export default function Sidebar() {
    return (
        <aside className="w-72 hidden md:block border-r border-black/5 dark:border-white/5 bg-white/40 dark:bg-[#0c0c0e]/60 backdrop-blur-xl h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 z-30">
            <CourseIndex />
        </aside>
    );
}
