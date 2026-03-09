import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ProgressionState {
    xp: number;
    level: number;
    completedLessons: string[];
    completedActivities: string[];
    revealedSolutions: string[];
}

interface XpEvent {
    id: string;
    amount: number;
    activityId?: string;
}

interface ProgressionContextType extends ProgressionState {
    progressToNextLevel: number;
    xpToNextLevel: number;
    addXP: (amount: number, activityId?: string) => void;
    completeLesson: (lessonSlug: string) => void;
    revealSolution: (activityId: string) => void;
    xpEvents: XpEvent[];
    removeXpEvent: (id: string) => void;
}

const XP_PER_LEVEL = 1000;
const INITIAL_STATE: ProgressionState = {
    xp: 0,
    level: 1,
    completedLessons: [],
    completedActivities: [],
    revealedSolutions: []
};

const ProgressionContext = createContext<ProgressionContextType | undefined>(undefined);

export function ProgressionProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ProgressionState>(() => {
        const saved = localStorage.getItem('cyber-c-progression');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Ensure backwards compatibility by defining revealedSolutions if undefined
            return {
                ...INITIAL_STATE,
                ...parsed,
                revealedSolutions: parsed.revealedSolutions || []
            };
        }
        return INITIAL_STATE;
    });

    const [xpEvents, setXpEvents] = useState<XpEvent[]>([]);

    useEffect(() => {
        localStorage.setItem('cyber-c-progression', JSON.stringify(state));
    }, [state]);

    const addXP = (amount: number, activityId?: string) => {
        // Blocks if already completed OR if the player skipped/revealed the solution
        if (activityId && (state.completedActivities.includes(activityId) || state.revealedSolutions.includes(activityId))) {
            return;
        }

        // Trigger the visual event
        setXpEvents(prev => [...prev, {
            id: Math.random().toString(36).substring(2, 9),
            amount,
            activityId
        }]);

        setState(prev => {
            const newXP = prev.xp + amount;
            const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
            const newActivities = activityId
                ? [...prev.completedActivities, activityId]
                : prev.completedActivities;

            return {
                ...prev,
                xp: newXP,
                level: newLevel,
                completedActivities: newActivities
            };
        });
    };

    const removeXpEvent = (id: string) => {
        setXpEvents(prev => prev.filter(e => e.id !== id));
    };

    const completeLesson = (lessonSlug: string) => {
        if (state.completedLessons.includes(lessonSlug)) return;
        setState(prev => ({
            ...prev,
            completedLessons: [...prev.completedLessons, lessonSlug]
        }));
    };

    const revealSolution = (activityId: string) => {
        if (state.revealedSolutions.includes(activityId)) return;
        setState(prev => ({
            ...prev,
            revealedSolutions: [...prev.revealedSolutions, activityId]
        }));
    };

    const currentLevelXP = state.xp % XP_PER_LEVEL;
    const progressToNextLevel = (currentLevelXP / XP_PER_LEVEL) * 100;
    const xpToNextLevel = XP_PER_LEVEL - currentLevelXP;

    return (
        <ProgressionContext.Provider value={{
            ...state,
            progressToNextLevel,
            xpToNextLevel,
            addXP,
            completeLesson,
            revealSolution,
            xpEvents,
            removeXpEvent
        }}>
            {children}
        </ProgressionContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgression() {
    const context = useContext(ProgressionContext);
    if (context === undefined) {
        throw new Error('useProgression must be used within a ProgressionProvider');
    }
    return context;
}
