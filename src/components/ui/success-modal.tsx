import { Check } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function SuccessModal({ 
  open, 
  onClose, 
  title = "Registro salvo!",
  message = "O Registro foi salvo com sucesso e as revisões já foram agendadas."
}: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] text-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center">
            <Check className="w-8 h-8 text-primary" strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="text-muted-foreground text-sm">{message}</p>
          <Button 
            onClick={onClose}
            className="w-full mt-2"
          >
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
