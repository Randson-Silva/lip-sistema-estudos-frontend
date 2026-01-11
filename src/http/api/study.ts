import { api } from "./index";

export interface StudyDTO {
  disciplineId: string;
  timeSpent: string;
  date: string;
  topic: string;
  notes?: string;
}

export function createStudy(data: StudyDTO) {
  const { date, disciplineId, timeSpent, topic, notes } = data;
  console.log(date);
  console.log(disciplineId);
  console.log(timeSpent);
  console.log(topic);
  console.log(notes);

  const payload = {
    disciplineId: Number(data.disciplineId),
    timeSpent,
    date,
    topic,
    notes,
  };

  console.log(payload);

  return api.post("/studies", payload);
}

export function getStudies() {
  return api.get("/studies");
}

export function updateStudy(id: string, data: StudyDTO) {
  return api.put(`/studies/${id}`, data);
}

export function deleteStudy(id: string) {
  return api.delete(`/studies/${id}`);
}
