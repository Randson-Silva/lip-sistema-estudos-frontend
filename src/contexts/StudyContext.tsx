import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
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
  
  // Novos campos memoizados (Dados prontos)
  totalHours: number;
  reviewsCompletedCount: number;
  pendingReviewsCount: number;

  addStudyRecord: (record: Omit<StudyRecord, 'id' | 'createdAt' | 'revisions'>) => StudyRecord;
  updateStudyRecord: (id: string, record: Partial<StudyRecord>) => void;
  toggleReviewComplete: (reviewId: string) => void;
  updateAlgorithmSettings: (settings: AlgorithmSettings) => void;
  
  // Getters
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

// --- FUNÇÃO DE SEGURANÇA (NOVA) ---
const safeLoad = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    
    const parsed = JSON.parse(saved);
    
    // Validação específica para Estudos: Se existir dados mas sem o campo novo 'disciplineId',
    // considera inválido (formato antigo) e força o fallback para evitar crash.
    if (key === STORAGE_KEYS.STUDIES && Array.isArray(parsed) && parsed.length > 0) {
      if (!parsed[0].disciplineId) {
        console.warn(`[Migration] Dados antigos detectados em ${key}. Resetando para evitar conflito.`);
        return fallback; 
      }
    }

    return parsed;
  } catch (error) {
    console.error(`[Storage] Erro ao carregar ${key}, usando fallback.`, error);
    return fallback;
  }
};

export function StudyProvider({ children }: { children: ReactNode }) {
  // Inicialização segura usando safeLoad
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>(() => 
    safeLoad(STORAGE_KEYS.STUDIES, MOCK_STUDIES)
  );

  const [reviews, setReviews] = useState<Review[]>(() => 
    safeLoad(STORAGE_KEYS.REVIEWS, MOCK_REVIEWS)
  );

  const [algorithmSettings, setAlgorithmSettings] = useState<AlgorithmSettings>(() => 
    safeLoad(STORAGE_KEYS.SETTINGS, DEFAULT_ALGORITHM_SETTINGS)
  );

  const [overdueCount, setOverdueCount] = useState(0);
  const [todayReviewsList, setTodayReviewsList] = useState<Review[]>([]);

  useEffect(() => {
    const overdue = Logic.filterOverdueReviews(reviews);
    const today = Logic.filterTodayReviews(reviews);
    setOverdueCount(overdue.length);
    setTodayReviewsList(today);
  }, [reviews]);

  // --- OTIMIZAÇÃO DE PERFORMANCE (MEMOIZAÇÃO) ---
  const totalHours = useMemo(() => 
    Logic.calculateTotalStudyHours(studyRecords), 
    [studyRecords]
  );

  const reviewsCompletedCount = useMemo(() => 
    reviews.filter(r => r.completed).length, 
    [reviews]
  );

  const pendingReviewsCount = useMemo(() => 
    Logic.filterPendingReviews(reviews), 
    [reviews]
  );

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
    const newEntryRequest = { ...recordData };
    const serverSideId = generateId(); 
    const serverSideTimestamp = new Date().toISOString(); 
    const revisoesRef = Logic.createRevisionsForRecord(recordData.date, algorithmSettings);

    const savedRecord: StudyRecord = {
      ...newEntryRequest,
      id: serverSideId,
      createdAt: serverSideTimestamp,
      revisions: revisoesRef,
    };

    const newReviews = Logic.createReviewsFromRevisions(savedRecord, revisoesRef);
    
    setStudyRecords(prev => [...prev, savedRecord]);
    setReviews(prev => [...prev, ...newReviews]);
    
    return savedRecord;
  };

  const updateStudyRecord = (id: string, updatedData: Partial<StudyRecord>) => {
    setStudyRecords(prev => prev.map(record => {
      if (record.id === id) {
        const { id: _ignoredId, createdAt: _ignoredCreated, ...rest } = updatedData;
        const newRecord = { ...record, ...rest };

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

  return (
    <StudyContext.Provider value={{
      studyRecords,
      reviews,
      algorithmSettings,
      overdueCount,
      todayReviews: todayReviewsList,
      totalHours,
      reviewsCompletedCount,
      pendingReviewsCount,
      
      addStudyRecord,
      updateStudyRecord,
      toggleReviewComplete,
      updateAlgorithmSettings,
      
      getOverdueReviews,
      getTodayReviews,
      getCompletedReviews,
      getTotalHours: () => totalHours,
      getReviewsCompleted: () => reviewsCompletedCount,
      getPendingReviews: () => pendingReviewsCount,
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