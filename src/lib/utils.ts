import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { DISCIPLINES, Discipline } from '@/types/study';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function truncateLabel(label: string, isMobile: boolean, totalItems: number = 0): string {
  if (isMobile) {
    return label.length > 6 ? label.substring(0, 6) + '..' : label;
  }

  if (totalItems > 10) {
    return label.length > 12 ? label.substring(0, 12) + '..' : label;
  }

  return label.length > 30 ? label.substring(0, 30) + '..' : label;
}

export const getDiscipline = (id: string): Discipline => {
  const found = DISCIPLINES.find(d => d.id === id);
  return found || { id: 'unknown', name: 'Desconhecido', color: 'blue' };
};

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}