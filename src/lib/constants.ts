import { DisciplineColor } from "@/types/study";

// Mapeamento Centralizado de Cores
export const DISCIPLINE_THEME: Record<DisciplineColor, { badge: string; border: string; hex: string }> = {
  blue: { 
    badge: "bg-blue-100 text-blue-700 hover:bg-blue-200", 
    border: "border-blue-200",
    hex: "#3b82f6" // blue-500
  },
  purple: { 
    badge: "bg-purple-100 text-purple-700 hover:bg-purple-200", 
    border: "border-purple-200",
    hex: "#a855f7" // purple-500
  },
  green: { 
    badge: "bg-green-100 text-green-700 hover:bg-green-200", 
    border: "border-green-200",
    hex: "#22c55e" // green-500
  },
  red: { 
    badge: "bg-red-100 text-red-700 hover:bg-red-200", 
    border: "border-red-200",
    hex: "#ef4444" // red-500
  },
  orange: { 
    badge: "bg-orange-100 text-orange-700 hover:bg-orange-200", 
    border: "border-orange-200",
    hex: "#f97316" // orange-500
  },
  navy: { 
    badge: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200", 
    border: "border-indigo-200",
    hex: "#6366f1" // indigo-500 (Simulando Navy)
  },
};

// Helper para recuperar estilos com fallback seguro
export const getDisciplineTheme = (color?: string) => {
  const theme = DISCIPLINE_THEME[color as DisciplineColor];
  return theme || DISCIPLINE_THEME.blue; // Fallback para Blue se der erro
};