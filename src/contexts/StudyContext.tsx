import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudyRecord, Review, AlgorithmSettings, DEFAULT_ALGORITHM_SETTINGS, DisciplineColor } from '@/types/study';
import { addDays, format, parseISO, differenceInDays, isToday, isBefore, startOfDay } from 'date-fns';

interface StudyContextType {
  studyRecords: StudyRecord[];
  reviews: Review[];
  algorithmSettings: AlgorithmSettings;
  addStudyRecord: (record: Omit<StudyRecord, 'id' | 'createdAt' | 'revisions'>) => StudyRecord;
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

export function StudyProvider({ children }: { children: ReactNode }) {
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [algorithmSettings, setAlgorithmSettings] = useState<AlgorithmSettings>(DEFAULT_ALGORITHM_SETTINGS);

  // Initialize with sample data
  useEffect(() => {
    const sampleReviews: Review[] = [
      {
        id: '1',
        studyRecordId: 's1',
        discipline: 'BANCO DE DADOS',
        disciplineColor: 'blue',
        topic: 'Normalização (1FN, 2FN, 3FN)',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        completed: false,
      },
      {
        id: '2',
        studyRecordId: 's2',
        discipline: 'ENGENHARIA DE SOFTWARE',
        disciplineColor: 'purple',
        topic: 'Design Patterns: State e Strategy',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        completed: false,
      },
      {
        id: '3',
        studyRecordId: 's3',
        discipline: 'REDES DE COMPUTADORES',
        disciplineColor: 'green',
        topic: 'Camada de Transporte (TCP/UDP)',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        completed: false,
      },
      {
        id: '4',
        studyRecordId: 's4',
        discipline: 'ESTRUTURA DE DADOS',
        disciplineColor: 'red',
        topic: 'Árvores Binárias de Busca',
        dueDate: format(addDays(new Date(), -1), 'yyyy-MM-dd'),
        completed: false,
        daysOverdue: 1,
      },
      {
        id: '5',
        studyRecordId: 's5',
        discipline: 'JAVA / POO',
        disciplineColor: 'orange',
        topic: 'Streams API e Lambdas',
        dueDate: format(addDays(new Date(), -5), 'yyyy-MM-dd'),
        completed: false,
        daysOverdue: 5,
      },
      {
        id: '6',
        studyRecordId: 's6',
        discipline: 'BANCO DE DADOS',
        disciplineColor: 'blue',
        topic: 'Joins e Subqueries Avançadas',
        dueDate: format(addDays(new Date(), -2), 'yyyy-MM-dd'),
        completed: true,
        completedAt: format(new Date(), 'yyyy-MM-dd'),
      },
      {
        id: '7',
        studyRecordId: 's7',
        discipline: 'VERSIONAMENTO',
        disciplineColor: 'purple',
        topic: 'Git Flow e Resolve Conflicts',
        dueDate: format(addDays(new Date(), -3), 'yyyy-MM-dd'),
        completed: true,
        completedAt: format(new Date(), 'yyyy-MM-dd'),
      },
      {
        id: '8',
        studyRecordId: 's8',
        discipline: 'GAME DESIGN',
        disciplineColor: 'navy',
        topic: 'Análise de Level Design (DS1)',
        dueDate: format(addDays(new Date(), -1), 'yyyy-MM-dd'),
        completed: true,
        completedAt: format(new Date(), 'yyyy-MM-dd'),
      },
    ];
    setReviews(sampleReviews);
  }, []);

  const addStudyRecord = (record: Omit<StudyRecord, 'id' | 'createdAt' | 'revisions'>): StudyRecord => {
    const baseDate = parseISO(record.date);
    const revisions: StudyRecord['revisions'] = [
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

    // Log the JSON to console
    console.log('📚 Novo Registro de Estudo:', JSON.stringify(newRecord, null, 2));

    setStudyRecords(prev => [...prev, newRecord]);

    // Create review entries
    const newReviews: Review[] = revisions.map((rev, index) => ({
      id: crypto.randomUUID(),
      studyRecordId: newRecord.id,
      discipline: record.discipline.toUpperCase(),
      disciplineColor: record.disciplineColor,
      topic: record.topic,
      dueDate: rev.date,
      completed: false,
    }));

    setReviews(prev => [...prev, ...newReviews]);

    return newRecord;
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

  const updateAlgorithmSettings = (settings: AlgorithmSettings) => {
    setAlgorithmSettings(settings);
  };

  const getOverdueReviews = (): Review[] => {
    const today = startOfDay(new Date());
    return reviews
      .filter(r => !r.completed && isBefore(parseISO(r.dueDate), today))
      .map(r => ({
        ...r,
        daysOverdue: differenceInDays(today, parseISO(r.dueDate)),
      }));
  };

  const getTodayReviews = (): Review[] => {
    return reviews.filter(r => !r.completed && isToday(parseISO(r.dueDate)));
  };

  const getCompletedReviews = (): Review[] => {
    return reviews.filter(r => r.completed);
  };

  const getTotalHours = (): number => {
    return 42; // Sample data
  };

  const getReviewsCompleted = (): number => {
    return reviews.filter(r => r.completed).length + 121; // Sample + base
  };

  const getPendingReviews = (): number => {
    return reviews.filter(r => !r.completed).length;
  };

  return (
    <StudyContext.Provider value={{
      studyRecords,
      reviews,
      algorithmSettings,
      addStudyRecord,
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
