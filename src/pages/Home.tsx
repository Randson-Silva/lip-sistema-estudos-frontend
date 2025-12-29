import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { MainLayout } from '@/components/layout/MainLayout';
import { CalendarGrid } from '@/components/CalendarGrid';
import { useStudy } from '@/contexts/StudyContext'; 
import { StudyRecord } from '@/types/study';

export default function Home() {
  const navigate = useNavigate();
  
  const { studyRecords } = useStudy(); 
  
  const [currentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEditStudy = (study: StudyRecord) => {
    navigate(`/registrar-estudo?edit=${study.id}`);
  };

  const handleAddStudy = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    navigate(`/registrar-estudo?date=${dateStr}`);
  };

  return (
    <MainLayout title="Tela Inicial">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Cronograma Semanal</h2>
          <span className="text-sm text-muted-foreground">
            {format(currentDate, "MMMM 'de' yyyy")}
          </span>
        </div>
        
        <div className="border rounded-xl bg-card p-4 shadow-sm overflow-x-auto">
          <CalendarGrid
            studies={studyRecords}
            currentDate={currentDate}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onEditStudy={handleEditStudy}
            onAddStudy={handleAddStudy}
          />
        </div>
      </section>
    </MainLayout>
  );
}