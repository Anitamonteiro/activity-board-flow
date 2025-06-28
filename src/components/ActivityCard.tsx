
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Activity } from '../types/activity';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onClick: (activity: Activity) => void;
  columnColor?: string;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onEdit,
  onDelete,
  onClick,
  columnColor = 'bg-blue-500',
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-lg border-0 overflow-hidden",
        isDragging && "opacity-50 rotate-5 scale-105",
        columnColor
      )}
      onClick={() => onClick(activity)}
    >
      <CardHeader className="pb-3 text-white">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {activity.title}
          </h3>
          <div className="flex gap-1 flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-white/20 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(activity);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-white/20 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(activity.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 text-white">
        <p className="text-xs text-white/80 mb-3 line-clamp-2">
          {activity.description}
        </p>
        
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={cn("text-xs font-medium bg-white/20 text-white border-white/30")}
          >
            {priorityLabels[activity.priority]}
          </Badge>
          
          <span className="text-xs text-white/60">
            {activity.updatedAt.toLocaleDateString('pt-BR')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
