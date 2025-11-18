import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { GripVertical, Settings, Filter, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDashboardLayout, DashboardChart } from '@/hooks/useDashboardLayout';
interface DraggableDashboardProps {
  charts: DashboardChart[];
  campaigns: any[];
}
const DraggableDashboard: React.FC<DraggableDashboardProps> = ({
  charts,
  campaigns
}) => {
  const {
    t
  } = useTranslation();
  const {
    updateChartOrder,
    getOrderedCharts,
    visibleCharts,
    toggleChartVisibility,
    getVisibleChartsCount,
    getTotalChartsCount
  } = useDashboardLayout(charts);
  const orderedCharts = getOrderedCharts();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(orderedCharts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateChartOrder(items);
  };
  return (
    <div className="space-y-4">
      {/* Chart Visibility Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {getVisibleChartsCount()}/{getTotalChartsCount()}
          </Badge>
        </div>
        
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              {t('dashboard.charts.configure')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">{t('dashboard.charts.visibility')}</h4>
              <div className="space-y-2">
                {charts.map(chart => (
                  <div key={chart.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={chart.id}
                      checked={visibleCharts.has(chart.id)}
                      onCheckedChange={() => toggleChartVisibility(chart.id)}
                    />
                    <label
                      htmlFor={chart.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                    >
                      {visibleCharts.has(chart.id) ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                      {chart.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Draggable Charts */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard-charts">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {orderedCharts.map((chart, index) => (
                <Draggable key={chart.id} draggableId={chart.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`transition-shadow ${
                        snapshot.isDragging ? 'shadow-lg' : ''
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{chart.title}</CardTitle>
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <chart.component campaigns={campaigns} {...(chart.props || {})} />
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
export default DraggableDashboard;