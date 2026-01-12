import { toast } from "sonner";

export const handleDownloadBlob = (data, filename: string) => {
  try {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao processar download:", error);
    toast.error("Erro ao processar o arquivo PDF.");
  }
};
