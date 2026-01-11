import { api } from "./index";

export function downloadPdfReport() {
  return api.get("/reports/pdf", {
    responseType: "blob",
  });
}
