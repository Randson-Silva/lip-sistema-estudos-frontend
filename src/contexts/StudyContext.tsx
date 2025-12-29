import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StudyRecord, Review, AlgorithmSettings, DEFAULT_ALGORITHM_SETTINGS } from '@/types/study';
import { addDays, format, differenceInDays, subDays } from 'date-fns';

// --- MOCK DATA (DADOS FICTÍCIOS AJUSTADOS) ---
const TODAY_DATE = new Date();
const TODAY_STR = format(TODAY_DATE, 'yyyy-MM-dd');

// Datas calculadas para fazer sentido lógico
const YESTERDAY_STR = format(subDays(TODAY_DATE, 1), 'yyyy-MM-dd');
const TWO_DAYS_AGO_STR = format(subDays(TODAY_DATE, 2), 'yyyy-MM-dd');
const TOMORROW_STR = format(addDays(TODAY_DATE, 1), 'yyyy-MM-dd');

const MOCK_STUDIES: StudyRecord[] = [
  // Cenario 1: Estudo Hoje -> Revisão Futura (Amanhã)
  {
    id: '1',
    discipline: 'Engenharia de Software',
    disciplineColor: 'purple',
    topic: 'Padrões de Projeto (MVC)',
    timeSpent: '02:00',
    date: TODAY_STR, // Feito HOJE
    createdAt: new Date().toISOString(),
    revisions: [],
    notes: 'Estudo fresco, revisão só amanhã.'
  },
  // Cenario 2: Estudo Ontem -> Revisão Hoje (Pendente)
  {
    id: '2',
    discipline: 'Banco de Dados',
    disciplineColor: 'blue',
    topic: 'Normalização e Formas Normais',
    timeSpent: '01:30',
    date: YESTERDAY_STR, // Feito ONTEM
    createdAt: new Date().toISOString(),
    revisions: [],
  },
  // Cenario 3: Estudo Anteontem -> Revisão Ontem (Atrasada)
  {
    id: '3',
    discipline: 'Inteligência Artificial',
    disciplineColor: 'navy',
    topic: 'Redes Neurais - Perceptron',
    timeSpent: '03:00',
    date: TWO_DAYS_AGO_STR, // Feito ANTEONTEM
    createdAt: new Date().toISOString(),
    revisions: [],
  }
];

const MOCK_REVIEWS: Review[] = [
  // Revisão do Estudo 3 (IA): Era pra ontem -> ATRASADA
  {
    id: 'r1',
    studyRecordId: '3',
    discipline: 'Inteligência Artificial',
    disciplineColor: 'navy',
    topic: 'Redes Neurais - Perceptron',
    dueDate: YESTERDAY_STR, 
    completed: false,
  },
  // Revisão do Estudo 2 (Banco): É pra hoje -> HOJE
  {
    id: 'r2',
    studyRecordId: '2',
    discipline: 'Banco de Dados',
    disciplineColor: 'blue',
    topic: 'Normalização e Formas Normais',
    dueDate: TODAY_STR, 
    completed: false,
  },
  // Revisão do Estudo 1 (Eng Soft): É pra amanhã -> FUTURA
  {
    id: 'r3',
    studyRecordId: '1',
    discipline: 'Engenharia de Software',
    disciplineColor: 'purple',
    topic: 'Padrões de Projeto (MVC)',
    dueDate: TOMORROW_STR, 
    completed: false,
  }
];
// --- FIM MOCK DATA ---

interface StudyContextType {
  studyRecords: StudyRecord[];
  reviews: Review[];
  algorithmSettings: AlgorithmSettings;
  addStudyRecord: (record: Omit<StudyRecord, 'id' | 'createdAt' | 'revisions'>) => StudyRecord;
  updateStudyRecord: (id: string, record: Partial<StudyRecord>) => void;
  toggleReviewComplete: (reviewId: string) => void;
  updateAlgorithmSettings: (settings: AlgorithmSettings) => void;
  getOverdueReviews: () => Review[];
  getTodayReviews: () => Review[];
  getCompletedReviews: () => Review[];
  getTotalHours: () => number;
  getReviewsCompleted: () => number;
  getPendingReviews: () => number;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const timeToDecimal = (timeStr: string) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours + (minutes / 60);
};

export function StudyProvider({ children }: { children: ReactNode }) {
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>(MOCK_STUDIES);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [algorithmSettings, setAlgorithmSettings] = useState<AlgorithmSettings>(DEFAULT_ALGORITHM_SETTINGS);

  const addStudyRecord = (record: Omit<StudyRecord, 'id' | 'createdAt' | 'revisions'>): StudyRecord => {
    // Fuso horário corrigido
    const baseDate = new Date(record.date.replace(/-/g, '/'));
    
    const revisions = [
      { date: format(addDays(baseDate, algorithmSettings.firstInterval), 'yyyy-MM-dd'), completed: false },
      { date: format(addDays(baseDate, algorithmSettings.secondInterval), 'yyyy-MM-dd'), completed: false },
      { date: format(addDays(baseDate, algorithmSettings.thirdInterval), 'yyyy-MM-dd'), completed: false },
    ];

    const newRecord: StudyRecord = {
      ...record,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      revisions,
    };

    setStudyRecords(prev => [...prev, newRecord]);

    const newReviews: Review[] = revisions.map((rev) => ({
      id: crypto.randomUUID(),
      studyRecordId: newRecord.id,
      discipline: record.discipline,
      disciplineColor: record.disciplineColor,
      topic: record.topic,
      dueDate: rev.date,
      completed: false,
    }));

    setReviews(prev => [...prev, ...newReviews]);
    return newRecord;
  };

  const updateStudyRecord = (id: string, updatedData: Partial<StudyRecord>) => {
    setStudyRecords(prev => prev.map(record => 
      record.id === id ? { ...record, ...updatedData } : record
    ));
    
    setReviews(prev => prev.map(review => {
      if (review.studyRecordId === id) {
        return {
          ...review,
          topic: updatedData.topic || review.topic,
          discipline: updatedData.discipline || review.discipline,
          disciplineColor: updatedData.disciplineColor || review.disciplineColor
        };
      }
      return review;
    }));
  };

  const toggleReviewComplete = (reviewId: string) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          completed: !review.completed,
          completedAt: !review.completed ? format(new Date(), 'yyyy-MM-dd') : undefined,
        };
      }
      return review;
    }));
  };

  const updateAlgorithmSettings = (settings: AlgorithmSettings) => setAlgorithmSettings(settings);

  // Lógica de Comparação por String (Blindada)
  const getOverdueReviews = () => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    return reviews
      .filter(r => !r.completed && r.dueDate < todayStr)
      .map(r => ({ 
        ...r, 
        daysOverdue: differenceInDays(new Date(), new Date(r.dueDate.replace(/-/g, '/'))) 
      }));
  };

  const getTodayReviews = () => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    return reviews.filter(r => !r.completed && r.dueDate === todayStr);
  };

  const getCompletedReviews = () => reviews.filter(r => r.completed);

  // Badge da Sidebar: Conta Atrasadas + Hoje (Ignora Futuras)
  const getPendingReviews = () => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    return reviews.filter(r => !r.completed && r.dueDate <= todayStr).length;
  };

  const getTotalHours = () => {
      return studyRecords.reduce((total, record) => {
        return total + timeToDecimal(record.timeSpent);
      }, 0);
  };
  
  const getReviewsCompleted = () => reviews.filter(r => r.completed).length;

  return (
    <StudyContext.Provider value={{
      studyRecords,
      reviews,
      algorithmSettings,
      addStudyRecord,
      updateStudyRecord,
      toggleReviewComplete,
      updateAlgorithmSettings,
      getOverdueReviews,
      getTodayReviews,
      getCompletedReviews,
      getTotalHours,
      getReviewsCompleted,
      getPendingReviews,
    }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
}