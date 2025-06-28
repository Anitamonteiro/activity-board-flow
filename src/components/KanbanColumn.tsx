
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Activity, ActivityStatus } from '../types/activity';
import { ActivityCard } from './ActivityCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: ActivityStatus;
  title: string;
  color: string;
  activities: Activity[];
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
  onViewActivity: (activity: Activity) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  color,
  activities,
  onEditActivity,
  onDeleteActivity,
  onViewActivity,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex-1 min-w-80">
      <div className={cn("rounded-lg p-4 h-full", color)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white text-lg">{title}</h2>
          <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium">
            {activities.length}
          </span>
        </div>
        
        <div
          ref={setNodeRef}
          className={cn(
            "space-y-3 min-h-96 p-2 rounded-lg transition-colors duration-200",
            isOver && "bg-white/10 backdrop-blur-sm"
          )}
        >
          <SortableContext items={activities.map(a => a.id)} strategy={verticalListSortingStrategy}>
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onEdit={onEditActivity}
                onDelete={onDeleteActivity}
                onClick={onViewActivity}
              />
            ))}
          </SortableContext>
          
          {activities.length === 0 && (
            <div className="flex items-center justify-center h-32 text-white/60 text-sm">
              Arraste atividades para cá
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
