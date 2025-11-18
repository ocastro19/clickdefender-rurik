import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ZoomControl() {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se há preferência de zoom salva
    const savedZoom = localStorage.getItem('app-zoom-level');
    if (savedZoom) {
      const zoom = parseInt(savedZoom);
      setZoomLevel(zoom);
      applyZoom(zoom);
    }

    // Mostra o controle de zoom após 2 segundos
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const applyZoom = (level: number) => {
    const scale = level / 100;
    document.documentElement.style.transform = `scale(${scale})`;
    document.documentElement.style.transformOrigin = 'top center';
    document.documentElement.style.width = '100%';
    document.documentElement.style.height = '100%';
    document.body.style.overflowX = 'hidden';
  };

  const handleZoom = (newLevel: number) => {
    setZoomLevel(newLevel);
    applyZoom(newLevel);
    localStorage.setItem('app-zoom-level', newLevel.toString());
  };

  const handleZoomIn = () => {
    const newLevel = Math.min(zoomLevel + 10, 150);
    handleZoom(newLevel);
  };

  const handleZoomOut = () => {
    const newLevel = Math.max(zoomLevel - 10, 70);
    handleZoom(newLevel);
  };

  const handleReset = () => {
    handleZoom(100);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-8 px-2 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <span className="text-xs font-medium">{zoomLevel}%</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5 text-sm font-medium">Controle de Zoom</div>
          <DropdownMenuItem onClick={handleZoomOut}>
            <ZoomOut className="mr-2 h-4 w-4" />
            <span>Diminuir Zoom</span>
            <span className="ml-auto text-xs text-muted-foreground">-10%</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleZoomIn}>
            <ZoomIn className="mr-2 h-4 w-4" />
            <span>Aumentar Zoom</span>
            <span className="ml-auto text-xs text-muted-foreground">+10%</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            <span>Restaurar</span>
            <span className="ml-auto text-xs text-muted-foreground">100%</span>
          </DropdownMenuItem>
          <div className="px-2 py-1.5 text-xs text-muted-foreground border-t">
            Atalhos: Ctrl + Scroll ou Ctrl + +/-
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}