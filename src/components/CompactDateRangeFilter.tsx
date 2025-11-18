import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDateRangeFilter } from '@/hooks/useDateRangeFilter';
import { useIsMobile } from '@/hooks/use-mobile';
import type { DateRange } from 'react-day-picker';

export const CompactDateRangeFilter: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const {
    dateRange,
    setStartDate,
    setEndDate,
    applyDateFilter,
    clearDateFilter,
    isViewingHistory,
    hasDateFilter
  } = useDateRangeFilter();

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(() => {
    if (dateRange.startDate && dateRange.endDate) {
      return {
        from: new Date(dateRange.startDate),
        to: new Date(dateRange.endDate)
      };
    }
    return undefined;
  });

  const handleDateSelect = (range: DateRange | undefined) => {
    setTempDateRange(range);
    
    if (range?.from) {
      setStartDate(format(range.from, 'yyyy-MM-dd'));
    } else {
      setStartDate(null);
    }
    
    if (range?.to) {
      setEndDate(format(range.to, 'yyyy-MM-dd'));
    } else {
      setEndDate(null);
    }
  };

  const handleApplyFilter = () => {
    applyDateFilter();
    setCalendarOpen(false);
  };

  const handleClearFilter = () => {
    clearDateFilter();
    setTempDateRange(undefined);
    setCalendarOpen(false);
  };

  const handleQuickPeriod = (days: number, label: string) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    const range = { from: startDate, to: endDate };
    setTempDateRange(range);
    setStartDate(format(startDate, 'yyyy-MM-dd'));
    setEndDate(format(endDate, 'yyyy-MM-dd'));
    
    // Aplicar filtro automaticamente e fechar
    setTimeout(() => {
      applyDateFilter();
      setCalendarOpen(false);
    }, 100);
  };

  const formatDateRangeText = () => {
    if (!dateRange.startDate) {
      return isMobile ? 'Período' : 'Selecionar período';
    }
    
    const startDate = new Date(dateRange.startDate);
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : startDate;
    
    if (dateRange.startDate === dateRange.endDate) {
      return format(startDate, isMobile ? "dd/MM" : "dd/MM/yyyy");
    }
    
    return isMobile 
      ? `${format(startDate, "dd/MM")} - ${format(endDate, "dd/MM")}` 
      : `${format(startDate, "dd/MM")} - ${format(endDate, "dd/MM")}`;
  };

  const quickPeriods = [
    { days: 7, label: '7 dias' },
    { days: 15, label: '15 dias' },
    { days: 30, label: '30 dias' },
    { days: 90, label: '3 meses' }
  ];

  return (
    <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'}`}>
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size={isMobile ? "sm" : "sm"}
            className={cn(
              `${isMobile ? 'h-8 px-2 text-xs' : 'h-9 px-3 text-sm'} font-medium bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 hover:border-border transition-all duration-300`,
              hasDateFilter && "border-primary/50 bg-primary/5 text-primary"
            )}
          >
            <CalendarIcon className={`${isMobile ? 'mr-1 h-3 w-3' : 'mr-2 h-4 w-4'}`} />
            {formatDateRangeText()}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className={`${isMobile ? 'w-[320px]' : 'w-auto'} p-0 bg-card/95 backdrop-blur-md border-border/50 shadow-premium`}
          align={isMobile ? "center" : "start"}
          side="bottom"
        >
          <div className={`${isMobile ? 'p-3' : 'p-4'} space-y-4`}>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <CalendarIcon className="h-3 w-3 text-primary" />
                </div>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-foreground`}>
                  Período
                </span>
              </div>
              {hasDateFilter && (
                <Button 
                  variant="ghost" 
                  onClick={handleClearFilter}
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Períodos rápidos */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Períodos rápidos
                </span>
              </div>
              
              <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2'} gap-2`}>
                {quickPeriods.map((period) => (
                  <Button
                    key={period.days}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickPeriod(period.days, period.label)}
                    className={`${isMobile ? 'h-7 text-xs' : 'h-8 text-xs'} bg-background/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200`}
                  >
                    {period.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Separador */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">ou selecione</span>
              </div>
            </div>

            {/* Calendário */}
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={tempDateRange?.from}
              selected={tempDateRange}
              onSelect={handleDateSelect}
              numberOfMonths={1}
              className={cn("pointer-events-auto p-0")}
              classNames={{
                months: "flex flex-col space-y-4",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: `${isMobile ? 'text-xs' : 'text-sm'} font-medium`,
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                  `${isMobile ? 'h-6 w-6' : 'h-7 w-7'} bg-transparent p-0 opacity-50 hover:opacity-100 border border-input hover:bg-accent hover:text-accent-foreground rounded-md`
                ),
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: `text-muted-foreground rounded-md ${isMobile ? 'w-7' : 'w-8'} font-normal text-[0.7rem]`,
                row: "flex w-full mt-1",
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                day: cn(
                  `${isMobile ? 'h-7 w-7' : 'h-8 w-8'} p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md text-xs`
                ),
                day_range_start: "day-range-start",
                day_range_end: "day-range-end",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground font-semibold",
                day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />

            {/* Botões de ação */}
            {tempDateRange?.from && (
              <div className="flex gap-2 pt-3 border-t border-border/50">
                <Button 
                  onClick={handleApplyFilter}
                  size="sm"
                  className={`flex-1 ${isMobile ? 'h-7 text-xs' : 'h-8 text-xs'}`}
                >
                  Aplicar filtro
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Status indicators */}
      {hasDateFilter && (
        <Badge variant="outline" className={`${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs'} bg-primary/10 text-primary border-primary/30`}>
          Filtrado
        </Badge>
      )}
      
      {isViewingHistory && (
        <Badge variant="outline" className={`${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs'} bg-info/10 text-info border-info/30`}>
          Histórico
        </Badge>
      )}
    </div>
  );
};