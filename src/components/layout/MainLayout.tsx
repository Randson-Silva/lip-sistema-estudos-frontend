import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-[200px] p-8">
        <h1 className="text-2xl font-bold text-foreground mb-8">{title}</h1>
        {children}
      </main>
    </div>
  );
}
