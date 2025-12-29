import { useState } from "react";
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
import { Logo } from "@/components/Logo";
import { InputPassword } from "@/components/ui/input-password";
// import { useToast } from "@/hooks/use-toast"; 


const formSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("Insira um e-mail válido."),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  confirmaSenha: z.string(),
}).refine((data) => data.senha === data.confirmaSenha, {
  message: "As senhas não coincidem.",
  path: ["confirmaSenha"], 
});

type FormValues = z.infer<typeof formSchema>;

const Cadastro = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmaSenha: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Dados validados:", data);
    setShowSuccess(true);
  };

  const handleContinue = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
  
              <div className="flex flex-col items-center justify-center">
                <Logo className="text-white h-16 md:h-24 w-auto" />
              </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg animate-scale-in">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">
            CADASTRO
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>nome <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage /> 
                  </FormItem>
                )}
              />

              {/* Campo Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>email <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} />
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
                    <FormLabel>senha <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <InputPassword placeholder="Crie uma senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo Confirma Senha */}
              <FormField
                control={form.control}
                name="confirmaSenha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>confirme a senha <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <InputPassword placeholder="Repita a senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-4" size="lg">
                CADASTRAR
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6">
            <Link to="/login" className="text-primary hover:underline text-sm font-medium">
              já possuo conta
            </Link>
          </div>
        </div>
      </div>

      {/* Modal de Sucesso (Mantido igual) */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl animate-scale-in">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Conta Criada!</h3>
            <p className="text-muted-foreground mb-6">
              Seu cadastro foi realizado com sucesso. Agora você pode fazer login.
            </p>
            <Button onClick={handleContinue} className="w-full">
              Continuar para Login
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cadastro;