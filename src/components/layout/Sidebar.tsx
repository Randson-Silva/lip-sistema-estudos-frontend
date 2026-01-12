import { NavLink } from "react-router-dom";
import {
  Calendar,
  BookOpen,
  RefreshCcw,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useReviews } from "@/hooks/use-reviews";

interface SidebarProps {
  userName?: string;
  className?: string;
  onItemClick?: () => void;
}

export function SidebarContent({
  userName = "Usuário",
  onItemClick,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const { overdueCount } = useReviews();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const navItems = [
    { to: "/home", icon: Calendar, label: "Cronograma" },
    { to: "/registrar-estudo", icon: BookOpen, label: "Registrar Estudo" },
    { to: "/disciplinas", icon: GraduationCap, label: "Disciplinas" },
    {
      to: "/revisoes",
      icon: RefreshCcw,
      label: "Revisões",
      badge: overdueCount,
    },
    { to: "/relatorios", icon: BarChart3, label: "Relatórios" },
    { to: "/configuracoes", icon: Settings, label: "Configurações" },
  ];

  const displayName = user?.name || userName;

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      {/* Cabeçalho com Perfil */}
      <div className="p-6 flex items-center gap-3 border-b border-border/50 bg-muted/20">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 border border-primary/20">
          <img
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${displayName}&eyes=default&mouth=default&nose=default&eyebrows=defaultNatural&top=shortFlat&facialHairProbability=0&accessoriesProbability=0`}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <span
            className="font-bold text-sm text-foreground truncate block"
            title={displayName}
          >
            {displayName}
          </span>
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onItemClick}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={20}
                  className={cn(
                    "shrink-0",
                    isActive
                      ? "text-white"
                      : "group-hover:scale-110 transition-transform"
                  )}
                />
                <span className="truncate">{item.label}</span>

                {item.badge !== undefined && item.badge > 0 && (
                  <Badge
                    className={cn(
                      "ml-auto text-xs shadow-sm px-2 py-0.5",
                      isActive
                        ? "bg-white text-primary hover:bg-white"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Rodapé com Logout e Logo */}
      <div className="p-4 border-t border-border/50 space-y-4 bg-muted/5">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors h-11"
        >
          <LogOut size={18} />
          <span className="font-medium">Sair da Conta</span>
        </Button>

        <div className="w-full pt-2 flex items-center justify-center border-t border-border/30">
          <Logo className="text-primary/40 h-10 hover:text-primary transition-colors" />
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ className, userName }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-64 border-r border-border min-h-screen hidden md:flex flex-col bg-card",
        className
      )}
    >
      <SidebarContent userName={userName} />
    </aside>
  );
}
