
import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TableHead } from '@/components/ui/table'
import { GripVertical, Edit } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DraggableTableHeaderProps {
  id: string
  children: React.ReactNode
  editable?: boolean
  className?: string
}

const DraggableTableHeader: React.FC<DraggableTableHeaderProps> = ({
  id,
  children,
  editable = false,
  className
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className={cn(
        "whitespace-nowrap relative group",
        isDragging && "opacity-50 z-50",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          {children}
          {editable && <Edit className="h-3 w-3 text-purple-500" />}
        </div>
      </div>
    </TableHead>
  )
}

export default DraggableTableHeader
