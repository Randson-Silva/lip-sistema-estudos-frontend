import { toast } from "sonner";

export const downloadBlob = (data, fileName: string) => {
  try {
    const url = window.URL.createObjectURL(
      new Blob([data], { type: "application/pdf" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao baixar o arquivo:", error);
    toast.error("Erro ao processar o download do PDF.");
  }
};
