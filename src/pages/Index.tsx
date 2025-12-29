import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-8">

            <div className="flex flex-col items-center justify-center">
              <Logo className="text-primary h-16 md:h-24 w-auto" />
            </div>

        <p className="text-xl text-muted-foreground">
          Sistema de Gerenciamento de Estudos e Revisões
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/cadastro">Criar Conta</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">Entrar</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
