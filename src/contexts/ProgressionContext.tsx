import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ProgressionState {
    xp: number;
    level: number;
    completedLessons: string[];
    completedActivities: string[];
}

interface ProgressionContextType extends ProgressionState {
    progressToNextLevel: number;
    xpToNextLevel: number;
    addXP: (amount: number, activityId?: string) => void;
    completeLesson: (lessonSlug: string) => void;
}

const XP_PER_LEVEL = 1000;
const INITIAL_STATE: ProgressionState = {
    xp: 0,
    level: 1,
    completedLessons: [],
    completedActivities: []
};

const ProgressionContext = createContext<ProgressionContextType | undefined>(undefined);

export function ProgressionProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ProgressionState>(() => {
        const saved = localStorage.getItem('cyber-c-progression');
        return saved ? JSON.parse(saved) : INITIAL_STATE;
    });

    useEffect(() => {
        localStorage.setItem('cyber-c-progression', JSON.stringify(state));
    }, [state]);

    const addXP = (amount: number, activityId?: string) => {
        if (activityId && state.completedActivities.includes(activityId)) return;

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

    const completeLesson = (lessonSlug: string) => {
        if (state.completedLessons.includes(lessonSlug)) return;
        setState(prev => ({
            ...prev,
            completedLessons: [...prev.completedLessons, lessonSlug]
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
            completeLesson
        }}>
            {children}
        </ProgressionContext.Provider>
    );
}

export function useProgression() {
    const context = useContext(ProgressionContext);
    if (context === undefined) {
        throw new Error('useProgression must be used within a ProgressionProvider');
    }
    return context;
}
