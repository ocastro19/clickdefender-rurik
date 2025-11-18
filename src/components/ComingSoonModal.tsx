import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Rocket } from 'lucide-react';

interface ComingSoonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function ComingSoonModal({
  open,
  onOpenChange,
  title = 'Funcionalidade em Desenvolvimento',
  description = 'Esta funcionalidade estará disponível em breve. Fique ligado nas novidades!'
}: ComingSoonModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Rocket className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Em breve</span>
        </div>
        <div className="mt-6 flex justify-center">
          <Button onClick={() => onOpenChange(false)} className="min-w-[100px]">
            Entendi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}