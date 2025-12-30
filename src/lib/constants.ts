// src/lib/constants.ts

// Definição das cores e estilos visuais
export const THEMES = {
  purple: { hex: '#9333ea', bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-500', badge: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
  blue: { hex: '#2563eb', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-500', badge: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  navy: { hex: '#1e3a8a', bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-800', badge: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' },
  green: { hex: '#16a34a', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-500', badge: 'bg-green-100 text-green-700 hover:bg-green-200' },
  red: { hex: '#dc2626', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-500', badge: 'bg-red-100 text-red-700 hover:bg-red-200' },
  orange: { hex: '#ea580c', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-500', badge: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  gray: { hex: '#6b7280', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-500', badge: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
};

// Helper seguro: se a cor não existir, retorna cinza
export function getDisciplineTheme(colorName: string) {
  // @ts-ignore: Ignora erro de indexação dinâmica para manter simples
  return THEMES[colorName] || THEMES.gray;
}