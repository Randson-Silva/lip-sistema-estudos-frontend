import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InputPassword } from "@/components/ui/input-password";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { resetPassword } from "@/http/api/auth";
import { toast } from "sonner";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { Logo } from "@/components/Logo";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams.get("token");

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Token inválido", {
        description: "Link de redefinição de senha inválido ou expirado.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({
        token,
        newPassword: data.newPassword,
      });

      setIsSuccess(true);
      toast.success("Senha redefinida com sucesso!", {
        description: "Você já pode fazer login com sua nova senha.",
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error("Erro ao redefinir senha", {
        description:
          error.message || "Token inválido ou expirado. Solicite um novo link.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Se não tiver token na URL
  if (!token) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center justify-center mb-8">
            <Logo className="text-white h-16 md:h-24 w-auto" />
          </div>

          <div className="bg-card rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-destructive text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Link Inválido</h2>
            <p className="text-muted-foreground mb-6">
              Este link de redefinição de senha é inválido ou expirou.
            </p>
            <Link to="/forgot-password">
              <Button className="w-full">Solicitar Novo Link</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Tela de sucesso
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center justify-center mb-8">
            <Logo className="text-white h-16 md:h-24 w-auto" />
          </div>

          <div className="bg-card rounded-2xl p-8 text-center animate-scale-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Senha Redefinida!</h2>
            <p className="text-muted-foreground mb-6">
              Sua senha foi alterada com sucesso. Redirecionando para o login...
            </p>
            <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Formulário de redefinição
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center">
          <Logo className="text-white h-16 md:h-24 w-auto" />
        </div>

        {/* Card de Reset */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg animate-scale-in">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-2">
            Nova Senha
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Digite sua nova senha abaixo
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Campo Nova Senha */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nova Senha <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <InputPassword
                        placeholder="Mínimo 6 caracteres"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo Confirmar Senha */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Confirmar Senha{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <InputPassword placeholder="Repita a senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-4"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redefinindo...
                  </>
                ) : (
                  "REDEFINIR SENHA"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
