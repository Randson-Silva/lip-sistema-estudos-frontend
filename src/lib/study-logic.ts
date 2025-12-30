import { StudyRecord, Review, AlgorithmSettings } from '@/types/study';
import { getTodayStr, normalizeDate } from './date-utils';

// Mantemos auxiliares de cálculo simples (apenas leitura)
export const timeToDecimal = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours + (minutes / 60);
};

export const calculateTotalStudyHours = (records: StudyRecord[]): number => {
  return records.reduce((total, record) => total + timeToDecimal(record.timeSpent), 0);
};

// --- Para não quebrar o código que as chama) ---

export const createRevisionsForRecord = (
  recordDate: string, 
  settings: AlgorithmSettings
) => {
  // RETORNO VAZIO: O algoritmo foi desligado.
  return [];
};

export const createReviewsFromRevisions = (
  studyRecord: StudyRecord, 
  revisions: { date: string, completed: boolean }[]
): Review[] => {
  // RETORNO VAZIO: Sem revisões futuras automáticas.
  return [];
};

// --- FILTROS DE VISUALIZAÇÃO (Apenas comparações simples) ---

export const filterOverdueReviews = (reviews: Review[]): Review[] => {
  const todayStr = getTodayStr();
  // Apenas filtra quem tem data menor que hoje. 
  return reviews.filter(r => !r.completed && r.dueDate < todayStr);
};

export const filterTodayReviews = (reviews: Review[]): Review[] => {
  const todayStr = getTodayStr();
  return reviews.filter(r => !r.completed && r.dueDate === todayStr);
};

export const filterPendingReviews = (reviews: Review[]): number => {
  const todayStr = getTodayStr();
  return reviews.filter(r => !r.completed && r.dueDate <= todayStr).length;
};