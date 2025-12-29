import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Insira um e-mail válido."),
  senha: z.string().min(1, "A senha é obrigatória."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log("Dados de Login:", data);

    toast({
      title: "Bem-vindo de volta!",
      description: "Login realizado com sucesso.",
    });

    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold text-primary tracking-wide">ESTUDOS</h1>
        </div>

        {/* Card de Login */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg animate-scale-in">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">
            LOGIN
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Campo Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="seu@email.com" 
                        className="bg-input border-border" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo Senha */}
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>senha</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        className="bg-input border-border" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg">
                ENTRAR
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6 flex flex-col gap-3">
            <Link 
              to="/cadastro" 
              className="text-primary hover:underline text-sm font-medium transition-colors"
            >
              criar uma conta
            </Link>
            
            <Link 
              to="/recuperar-senha" 
              className="text-primary hover:underline text-sm font-medium transition-colors"
            >
              esqueceu sua senha?
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;