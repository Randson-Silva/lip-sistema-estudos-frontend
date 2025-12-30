import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addDays, format } from 'date-fns';
import { useStudy } from '@/contexts/StudyContext';
import { DISCIPLINES } from '@/types/study';
import { normalizeDate, formatDateForStorage } from '@/lib/date-utils';

const studySchema = z.object({
  disciplineId: z.string({ required_error: "Selecione uma disciplina." }),
  timeSpent: z.string().min(1, "Informe o tempo de estudo."),
  date: z.date({ required_error: "A data é obrigatória." }),
  topic: z.string().min(3, "O tema deve ter pelo menos 3 caracteres."),
  notes: z.string().optional(),
});

export type StudyFormValues = z.infer<typeof studySchema>;

export function useStudyForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const dateParam = searchParams.get('date');

  const { addStudyRecord, updateStudyRecord, studyRecords, algorithmSettings } = useStudy();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const form = useForm<StudyFormValues>({
    resolver: zodResolver(studySchema),
    defaultValues: {
      disciplineId: '',
      timeSpent: '01:00',
      topic: '',
      notes: '',
      date: dateParam ? normalizeDate(dateParam) : new Date(),
    },
  });

  // Lógica de Edição isolada
  useEffect(() => {
    if (editId) {
      const studyToEdit = studyRecords.find(s => s.id === editId);
      if (studyToEdit) {
        // CORREÇÃO 1: Usamos o ID direto. Não precisa mais buscar na lista pelo nome.
        form.reset({
          disciplineId: studyToEdit.disciplineId, 
          timeSpent: studyToEdit.timeSpent,
          date: normalizeDate(studyToEdit.date),
          topic: studyToEdit.topic,
          notes: studyToEdit.notes || '',
        });
      }
    }
  }, [editId, studyRecords, form]);

  const onSubmit = (data: StudyFormValues) => {
    // Validação básica para garantir que o ID existe (opcional, mas boa prática)
    const selectedDiscipline = DISCIPLINES.find(d => d.id === data.disciplineId);
    if (!selectedDiscipline) return;

    const formattedDate = formatDateForStorage(data.date);
    
    // CORREÇÃO 2: Salvamos o ID em vez do Nome/Cor
    const commonData = {
      disciplineId: data.disciplineId, // Normalizado!
      timeSpent: data.timeSpent,
      date: formattedDate,
      topic: data.topic,
      notes: data.notes,
    };

    if (editId) {
      updateStudyRecord(editId, commonData);
      setSuccessMessage("Registro atualizado com sucesso!");
    } else {
      addStudyRecord(commonData);
      const nextReviewDate = addDays(data.date, algorithmSettings.firstInterval);
      setSuccessMessage(`Estudo registrado! 1ª Revisão: ${format(nextReviewDate, "dd/MM/yyyy")}`);
    }
    
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate('/home');
  };

  return {
    form,
    editId,
    onSubmit,
    showSuccess,
    successMessage,
    handleCloseSuccess,
    isEditing: !!editId
  };
}