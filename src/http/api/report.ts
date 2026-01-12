import { api } from "../api";

// Função para buscar os dados JSON (gráficos)
export const getGeneralStats = () => {
  return api.get(`/reports`);
};

// NOVA: Função para baixar o CRONOGRAMA
export const downloadSchedulePdf = () => {
  return api.get(`/reports/schedule/pdf`, {
    responseType: "blob", // ESSENCIAL para arquivos binários
  });
};

// NOVA: Função para baixar o RELATÓRIO COMPLETO
export const downloadFullReportPdf = () => {
  return api.get(`/reports/full-report/pdf`, {
    responseType: "blob",
  });
};
