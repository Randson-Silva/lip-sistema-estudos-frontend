import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Discipline, DISCIPLINES } from '@/types/study';

interface DisciplineContextType {
    disciplines: Discipline[];
    addDiscipline: (discipline: Omit<Discipline, 'id'>) => void;
    updateDiscipline: (id: string, updates: Partial<Discipline>) => void;
    deleteDiscipline: (id: string) => void;
    resetDisciplines: () => void;
}

const DisciplineContext = createContext<DisciplineContextType | undefined>(undefined);

const STORAGE_KEY = 'sistema_estudos_disciplines_v1';

export function DisciplineProvider({ children }: { children: ReactNode }) {
    const [disciplines, setDisciplines] = useState<Discipline[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : DISCIPLINES;
        } catch {
            return DISCIPLINES;
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(disciplines));
    }, [disciplines]);

    const addDiscipline = (discipline: Omit<Discipline, 'id'>) => {
        const newDiscipline: Discipline = {
            ...discipline,
            id: crypto.randomUUID(),
        };
        setDisciplines(prev => [...prev, newDiscipline]);
    };

    const updateDiscipline = (id: string, updates: Partial<Discipline>) => {
        setDisciplines(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)));
    };

    const deleteDiscipline = (id: string) => {
        setDisciplines(prev => prev.filter(d => d.id !== id));
    };

    const resetDisciplines = () => {
        setDisciplines(DISCIPLINES);
    };

    return (
        <DisciplineContext.Provider
            value={{
                disciplines,
                addDiscipline,
                updateDiscipline,
                deleteDiscipline,
                resetDisciplines,
            }}
        >
            {children}
        </DisciplineContext.Provider>
    );
}

export function useDisciplines() {
    const context = useContext(DisciplineContext);
    if (context === undefined) {
        throw new Error('useDisciplines must be used within a DisciplineProvider');
    }
    return context;
}
