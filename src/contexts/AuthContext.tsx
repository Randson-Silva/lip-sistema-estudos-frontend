import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  loginUser,
  registerUser,
  logout as logoutApi,
  verifyEmail as verifyEmailApi,
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
} from "@/http/api/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const token = localStorage.getItem("accessToken");

    if (userId && userName && token) {
      setUser({
        id: Number(userId),
        name: userName,
        email: "", // Pode buscar do backend se necessário
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser({ email, password });

      setUser({
        id: response.userId,
        name: response.name,
        email: response.email,
      });

      toast.success("Login realizado com sucesso!");
      navigate("/home");
    } catch (error) {
      const errorMessage = error.message || "Credenciais inválidas";
      toast.error("Erro no login", { description: errorMessage });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await registerUser({ name, email, password });

      toast.success("Cadastro realizado!", {
        description: "Verifique seu email para ativar a conta.",
      });
    } catch (error) {
      const errorMessage = error.message || "Erro ao cadastrar";
      toast.error("Erro no cadastro", { description: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
      localStorage.clear();
      toast.success("Logout realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      // Mesmo com erro, limpar localmente
      setUser(null);
      localStorage.clear();
      navigate("/login");
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      await verifyEmailApi(token);
      toast.success("Email verificado com sucesso!", {
        description: "Você já pode fazer login.",
      });
      navigate("/login");
    } catch (error) {
      const errorMessage = error.message || "Token inválido ou expirado";
      toast.error("Erro na verificação", { description: errorMessage });
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await forgotPasswordApi(email);
      toast.success("Email enviado!", {
        description: "Verifique sua caixa de entrada.",
      });
    } catch (error) {
      const errorMessage = error.message || "Erro ao enviar email";
      toast.error("Erro", { description: errorMessage });
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await resetPasswordApi({ token, newPassword });
      toast.success("Senha redefinida com sucesso!");
      navigate("/login");
    } catch (error) {
      const errorMessage = error.message || "Token inválido ou expirado";
      toast.error("Erro ao redefinir senha", { description: errorMessage });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        verifyEmail,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
