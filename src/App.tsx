import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { StudyProvider } from "@/contexts/StudyContext";
import { DisciplineProvider } from "@/contexts/DisciplineContext";

import { ProtectedRoute } from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Home from "./pages/Home";
import RegistrarEstudo from "./pages/RegistrarEstudo";
import Revisoes from "./pages/Revisoes";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Disciplinas from "./pages/Disciplinas";

import RecuperarSenha from "./pages/RecuperarSenha";
import VerificarCodigo from "./pages/VerificarCodigo";
import NovaSenha from "./pages/NovaSenha";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <StudyProvider>
          <DisciplineProvider>
            <Toaster />

            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/recuperar-senha" element={<RecuperarSenha />} />
              <Route path="/verificar-codigo" element={<VerificarCodigo />} />
              <Route path="/nova-senha" element={<NovaSenha />} />

              {/* Rotas Protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/registrar-estudo" element={<RegistrarEstudo />} />
                <Route path="/revisoes" element={<Revisoes />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                <Route path="/disciplinas" element={<Disciplinas />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DisciplineProvider>
        </StudyProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
