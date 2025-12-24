import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, FileEdit, BookOpen, BarChart3, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useStudy } from '@/contexts/StudyContext';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/cronograma', label: 'Cronograma', icon: LayoutGrid },
  { path: '/registrar', label: 'Registrar Estudo', icon: FileEdit },
  { path: '/revisoes', label: 'Revisões', icon: BookOpen, hasBadge: true },
  { path: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  { path: '/configuracoes', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { getPendingReviews } = useStudy();
  const pendingCount = getPendingReviews();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[200px] bg-card border-r border-border flex flex-col py-6 px-4">
      {/* Profile Section */}
      <div className="flex items-center gap-3 mb-8">
        <Avatar className="h-10 w-10">
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">CL</AvatarFallback>
        </Avatar>
        <span className="font-medium text-foreground text-sm">Clidenor</span>
        <button className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
          <LogOut size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.hasBadge && pendingCount > 0 && (
                <Badge 
                  className={cn(
                    "ml-auto h-5 min-w-5 px-1.5 text-xs font-semibold rounded-full flex items-center justify-center",
                    isActive 
                      ? "bg-primary-foreground text-primary" 
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {pendingCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
