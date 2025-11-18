import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, X, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDateRangeFilter } from '@/hooks/useDateRangeFilter';
import type { DateRange } from 'react-day-picker';

export const DateRangeFilter: React.FC = () => {
  const { t } = useTranslation();
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

  const formatDateRangeText = () => {
    if (!dateRange.startDate) {
      return t('dashboard.selectPeriod');
    }
    
    const startDate = new Date(dateRange.startDate);
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : startDate;
    
    if (dateRange.startDate === dateRange.endDate) {
      return format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    }
    
    return `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`;
  };

  const handleQuickPeriod = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    const range = { from: startDate, to: endDate };
    setTempDateRange(range);
    setStartDate(format(startDate, 'yyyy-MM-dd'));
    setEndDate(format(endDate, 'yyyy-MM-dd'));
    
    // Aplicar filtro automaticamente
    setTimeout(() => {
      applyDateFilter();
    }, 100);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
      <div className="space-y-2 w-full sm:w-auto">
        {/* Botões de período padrão - mais compactos */}
        <div className="flex gap-1.5 mb-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickPeriod(7)}
            className="text-xs px-2.5 py-1 h-7 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:from-primary/15 hover:to-primary/20 transition-all duration-300"
          >
            7d
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickPeriod(15)}
            className="text-xs px-2.5 py-1 h-7 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:from-primary/15 hover:to-primary/20 transition-all duration-300"
          >
            15d
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickPeriod(30)}
            className="text-xs px-2.5 py-1 h-7 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:from-primary/15 hover:to-primary/20 transition-all duration-300"
          >
            30d
          </Button>
        </div>
        
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "w-full sm:w-[280px] justify-start text-left font-normal h-9 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:from-primary/10 hover:to-primary/15 transition-all duration-300",
                  !hasDateFilter && "text-muted-foreground"
                )}
              >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="text-xs">{formatDateRangeText()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0 bg-gradient-to-br from-background to-background/80 border border-primary/20 shadow-card backdrop-blur-sm" 
            align="start"
            side="bottom"
          >
            <div className="p-3 space-y-3">
              <div className="text-xs font-medium text-foreground flex items-center gap-2">
                <CalendarIcon className="h-3 w-3 text-primary" />
                📅 Período
              </div>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={tempDateRange?.from}
                selected={tempDateRange}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                className={cn("pointer-events-auto p-0")}
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-input hover:bg-accent hover:text-accent-foreground"
                  ),
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.7rem]",
                  row: "flex w-full mt-1",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                  day: cn(
                    "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md text-xs"
                  ),
                  day_range_start: "day-range-start",
                  day_range_end: "day-range-end",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
              />
              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  onClick={handleApplyFilter}
                  disabled={!tempDateRange?.from}
                  size="sm"
                  className="flex-1 h-8 text-xs"
                >
                  {t('dashboard.applyFilters')}
                </Button>
                {hasDateFilter && (
                  <Button 
                    variant="outline" 
                    onClick={handleClearFilter}
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {hasDateFilter && (
        <Button 
          variant="ghost" 
          onClick={handleClearFilter}
          size="sm"
          className="text-muted-foreground hover:text-foreground h-8 px-2"
        >
          <X className="h-3 w-3 mr-1" />
          <span className="text-xs">{t('dashboard.clearFilters')}</span>
        </Button>
      )}
      
      {isViewingHistory && (
        <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md font-medium">
          <BarChart3 className="h-4 w-4 inline mr-1.5" />
          {t('dashboard.viewingHistoricalData')}
        </div>
      )}
    </div>
  );
};