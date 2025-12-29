import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";



const Index = () => {
  const buttonPrimaryStyles = "px-10 bg-white text-primary hover:bg-white/90 border-none shadow-xl hover:scale-105 transition-all font-bold";
  return (
  
    <div className="flex min-h-screen items-center justify-center bg-primary p-4 transition-colors duration-500">
      <div className="text-center space-y-12 w-full max-w-md animate-fade-in">
        
        <div className="flex flex-col items-center justify-center">
          <Logo className="text-white h-24 md:h-32 w-auto drop-shadow-xl" />
        </div>

        <div className="space-y-8">
          <p className="text-xl text-white/90 font-medium leading-relaxed">
            Sistema de Gerenciamento de Estudos e Revisões
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className={buttonPrimaryStyles}
            >
              <Link to="/cadastro">Criar Conta</Link>
            </Button>
            
            <Button 
              asChild 
              size="lg" 
              className={buttonPrimaryStyles}
            >
              <Link to="/login">Entrar</Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Index;