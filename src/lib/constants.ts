export type DisciplineColor = 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'navy' | 'gray';

export interface DisciplineTheme {
  hex: string;
  border: string;
  badge: string;
  bg: string;
}

export const DISCIPLINE_THEME: Record<DisciplineColor, DisciplineTheme> = {
  purple: {
    hex: '#8B5CF6',
    border: 'border-purple-500',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    bg: 'bg-purple-500/10',
  },
  blue: {
    hex: '#3B82F6',
    border: 'border-blue-500',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    bg: 'bg-blue-500/10',
  },
  navy: {
    hex: '#1E3A8A',
    border: 'border-indigo-800',
    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    bg: 'bg-indigo-500/10',
  },
  green: {
    hex: '#22C55E',
    border: 'border-green-500',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    bg: 'bg-green-500/10',
  },
  red: {
    hex: '#EF4444',
    border: 'border-red-500',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    bg: 'bg-red-500/10',
  },
  orange: {
    hex: '#F97316',
    border: 'border-orange-500',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    bg: 'bg-orange-500/10',
  },
  gray: {
    hex: '#6B7280',
    border: 'border-gray-500',
    badge: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    bg: 'bg-gray-500/10',
  },
};

// Helper para recuperar estilos com fallback seguro
export function getDisciplineTheme(color?: string): DisciplineTheme {
  const theme = DISCIPLINE_THEME[color as DisciplineColor];
  return theme || DISCIPLINE_THEME.gray;
}
