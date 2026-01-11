import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

const schema = z.object({
  email: z.string().email("Email inválido"),
});

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const form = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await forgotPassword(data.email);
    } catch (error) {
      // Erro já tratado no AuthContext
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center">
          <Logo className="text-white h-16 md:h-24 w-auto" />
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-lg animate-scale-in">
          <h2 className="text-2xl font-semibold text-center mb-2">
            Esqueceu a senha?
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Digite seu email para receber instruções
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu@email.com"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar"
                )}
              </Button>
            </form>
          </Form>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 mt-4 text-sm text-primary hover:underline"
          >
            <ArrowLeft size={16} /> Voltar para login
          </Link>
        </div>
      </div>
    </div>
  );
}
