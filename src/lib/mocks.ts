import { format, subDays, addDays } from 'date-fns';
import { StudyRecord, Review } from '@/types/study';

const TODAY_STR = format(new Date(), 'yyyy-MM-dd');
const YESTERDAY_STR = format(subDays(new Date(), 1), 'yyyy-MM-dd');
const TWO_DAYS_AGO_STR = format(subDays(new Date(), 2), 'yyyy-MM-dd');
const TOMORROW_STR = format(addDays(new Date(), 1), 'yyyy-MM-dd');

export const MOCK_STUDIES: StudyRecord[] = [
  {
    id: '1',
    disciplineId: '1', // ID da Eng. de Software (Roxo)
    topic: 'Padrões de Projeto (MVC)',
    timeSpent: '02:00',
    date: TODAY_STR,
    createdAt: new Date().toISOString(),
    revisions: [],
    notes: 'Estudo fresco, revisão só amanhã.'
  },
  {
    id: '2',
    disciplineId: '2', // ID de Banco de Dados (Azul)
    topic: 'Normalização e Formas Normais',
    timeSpent: '01:30',
    date: YESTERDAY_STR,
    createdAt: new Date().toISOString(),
    revisions: [],
  },
  {
    id: '3',
    disciplineId: '3', // ID de IA (Navy)
    topic: 'Redes Neurais - Perceptron',
    timeSpent: '03:00',
    date: TWO_DAYS_AGO_STR,
    createdAt: new Date().toISOString(),
    revisions: [],
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    studyRecordId: '3',
    disciplineId: '3', // ID de IA
    topic: 'Redes Neurais - Perceptron',
    dueDate: YESTERDAY_STR, 
    completed: false,
  },
  {
    id: 'r2',
    studyRecordId: '2',
    disciplineId: '2', // ID de Banco de Dados
    topic: 'Normalização e Formas Normais',
    dueDate: TODAY_STR, 
    completed: false,
  },
  {
    id: 'r3',
    studyRecordId: '1',
    disciplineId: '1', // ID da Eng. de Software
    topic: 'Padrões de Projeto (MVC)',
    dueDate: TOMORROW_STR, 
    completed: false,
  }
];