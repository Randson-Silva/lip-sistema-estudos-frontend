import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudyRecord, Review, AlgorithmSettings, DEFAULT_ALGORITHM_SETTINGS } from '@/types/study';
import * as Logic from '@/lib/study-logic';
import { getTodayStr } from '@/lib/date-utils'; 
import { MOCK_STUDIES, MOCK_REVIEWS } from '@/lib/mocks';
import { generateId } from '@/lib/utils';

interface StudyContextType {
  studyRecords: StudyRecord[];
  reviews: Review[];
  algorithmSettings: AlgorithmSettings;
  overdueCount: number; 
  todayReviews: Review[]; 
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

const STORAGE_KEYS = {
  STUDIES: 'study-manager:studies',
  REVIEWS: 'study-manager:reviews',
  SETTINGS: 'study-manager:settings',
};

export function StudyProvider({ children }: { children: ReactNode }) {
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDIES);
    return saved ? JSON.parse(saved) : MOCK_STUDIES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : MOCK_REVIEWS;
  });

  const [algorithmSettings, setAlgorithmSettings] = useState<AlgorithmSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_ALGORITHM_SETTINGS;
  });

  const [overdueCount, setOverdueCount] = useState(0);
  const [todayReviewsList, setTodayReviewsList] = useState<Review[]>([]);

  useEffect(() => {
    const overdue = Logic.filterOverdueReviews(reviews);
    const today = Logic.filterTodayReviews(reviews);
    setOverdueCount(overdue.length);
    setTodayReviewsList(today);
  }, [reviews]);

  // Persistência
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDIES, JSON.stringify(studyRecords));
  }, [studyRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(algorithmSettings));
  }, [algorithmSettings]);


  const addStudyRecord = (recordData: Omit<StudyRecord, 'id' | 'createdAt' | 'revisions'>): StudyRecord => {
  // prepara apenas os dados do formulário
  const newEntryRequest = { ...recordData };

  // Simulação apenas
  const serverSideId = generateId(); // O servidor geraria o UUID
  const serverSideTimestamp = new Date().toISOString(); // O servidor define a hora oficial
  
  // O algoritmo de agendamento também é processado aqui 
  const revisoesRef = Logic.createRevisionsForRecord(recordData.date, algorithmSettings);

  const savedRecord: StudyRecord = {
    ...newEntryRequest,
    id: serverSideId,
    createdAt: serverSideTimestamp,
    revisions: revisoesRef,
  };

  // O estado do Front-end apenas armazena o que o "servidor" confirmou
  const newReviews = Logic.createReviewsFromRevisions(savedRecord, revisoesRef);
  
  setStudyRecords(prev => [...prev, savedRecord]);
  setReviews(prev => [...prev, ...newReviews]);
  
  return savedRecord;
};

  const updateStudyRecord = (id: string, updatedData: Partial<StudyRecord>) => {
    setStudyRecords(prev => prev.map(record => {
      if (record.id === id) {
        const newRecord = { ...record, ...updatedData };
        if (updatedData.date && updatedData.date !== record.date) {
          const newRevisions = Logic.createRevisionsForRecord(updatedData.date, algorithmSettings);
          newRecord.revisions = newRevisions;
          setReviews(prevReviews => {
            const otherReviews = prevReviews.filter(r => r.studyRecordId !== id);
            const freshReviews = Logic.createReviewsFromRevisions(newRecord, newRevisions);
            return [...otherReviews, ...freshReviews];
          });
        }
        return newRecord;
      }
      return record;
    }));
  };

  const toggleReviewComplete = (reviewId: string) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        const isCompleting = !review.completed;
        return {
          ...review,
          completed: isCompleting,
          completedAt: isCompleting ? getTodayStr() : undefined,
        };
      }
      return review;
    }));
  };

  const updateAlgorithmSettings = (settings: AlgorithmSettings) => setAlgorithmSettings(settings);

  // --- Getters ---
  const getOverdueReviews = () => Logic.filterOverdueReviews(reviews);
  const getTodayReviews = () => todayReviewsList;
  const getCompletedReviews = () => reviews.filter(r => r.completed);
  const getPendingReviews = () => Logic.filterPendingReviews(reviews);
  const getTotalHours = () => Logic.calculateTotalStudyHours(studyRecords);
  const getReviewsCompleted = () => reviews.filter(r => r.completed).length;

  return (
    <StudyContext.Provider value={{
      studyRecords,
      reviews,
      algorithmSettings,
      overdueCount,
      todayReviews: todayReviewsList,
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