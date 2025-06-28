import React, { useState, useMemo } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Activity, ActivityStatus } from '../types/activity';
import { useActivityStore } from '../store/useActivityStore';
import { KanbanColumn } from './KanbanColumn';
import { ActivityCard } from './ActivityCard';
import { ActivityModal } from './ActivityModal';
import { FilterPanel } from './FilterPanel';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
const columns = [{
  id: 'todo' as ActivityStatus,
  title: 'A fazer',
  color: 'bg-gradient-to-br from-gray-500 to-gray-600'
}, {
  id: 'inProgress' as ActivityStatus,
  title: 'Em andamento',
  color: 'bg-gradient-to-br from-blue-500 to-blue-600'
}, {
  id: 'completed' as ActivityStatus,
  title: 'Concluído',
  color: 'bg-gradient-to-br from-green-500 to-green-600'
}, {
  id: 'cancelled' as ActivityStatus,
  title: 'Cancelado',
  color: 'bg-gradient-to-br from-red-500 to-red-600'
}];
export const KanbanBoard: React.FC = () => {
  const {
    activities,
    filteredActivities,
    filters,
    addActivity,
    updateActivity,
    deleteActivity,
    moveActivity,
    reorderActivities,
    setFilters
  } = useActivityStore();
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view';
    activity?: Activity | null;
  }>({
    isOpen: false,
    mode: 'create',
    activity: null
  });
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8
    }
  }));
  const activitiesByStatus = useMemo(() => {
    const grouped = columns.reduce((acc, column) => {
      acc[column.id] = filteredActivities.filter(activity => activity.status === column.id);
      return acc;
    }, {} as Record<ActivityStatus, Activity[]>);
    return grouped;
  }, [filteredActivities]);
  const handleDragStart = (event: DragStartEvent) => {
    const {
      active
    } = event;
    const activity = activities.find(a => a.id === active.id);
    setActiveActivity(activity || null);
  };
  const handleDragOver = (event: DragOverEvent) => {
    const {
      active,
      over
    } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    const activeActivity = activities.find(a => a.id === activeId);
    if (!activeActivity) return;
    const isOverColumn = columns.some(col => col.id === overId);
    if (isOverColumn && activeActivity.status !== overId) {
      moveActivity(activeId, overId as ActivityStatus);
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const {
      active,
      over
    } = event;
    setActiveActivity(null);
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    const activeActivity = activities.find(a => a.id === activeId);
    if (!activeActivity) return;

    // Handle dropping on another activity (reordering)
    const overActivity = activities.find(a => a.id === overId);
    if (overActivity && activeActivity.status === overActivity.status) {
      const statusActivities = activitiesByStatus[activeActivity.status];
      const oldIndex = statusActivities.findIndex(a => a.id === activeId);
      const newIndex = statusActivities.findIndex(a => a.id === overId);
      if (oldIndex !== newIndex) {
        reorderActivities(activeActivity.status, oldIndex, newIndex);
      }
    }
  };
  const handleCreateActivity = () => {
    setModalState({
      isOpen: true,
      mode: 'create',
      activity: null
    });
  };
  const handleEditActivity = (activity: Activity) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      activity
    });
  };
  const handleViewActivity = (activity: Activity) => {
    setModalState({
      isOpen: true,
      mode: 'view',
      activity
    });
  };
  const handleDeleteActivity = (id: string) => {
    deleteActivity(id);
    toast({
      title: 'Atividade excluída',
      description: 'A atividade foi removida com sucesso.'
    });
  };
  const handleSaveActivity = (activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (modalState.mode === 'create') {
      addActivity(activityData);
      toast({
        title: 'Atividade criada',
        description: 'Nova atividade foi adicionada ao quadro.'
      });
    } else if (modalState.mode === 'edit' && modalState.activity) {
      updateActivity(modalState.activity.id, activityData);
      toast({
        title: 'Atividade atualizada',
        description: 'As alterações foram salvas com sucesso.'
      });
    }
  };
  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      search: ''
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Activity Board
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie suas atividades com arrastar e soltar
            </p>
          </div>
          
          <Button onClick={handleCreateActivity} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
            <Plus className="h-5 w-5 mr-2" />
            Nova Atividade
          </Button>
        </div>

        {/* Filters */}
        <FilterPanel filters={filters} onFiltersChange={setFilters} onClearFilters={handleClearFilters} />

        {/* Kanban Board */}
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columns.map(column => <KanbanColumn key={column.id} id={column.id} title={column.title} color={column.color} activities={activitiesByStatus[column.id] || []} onEditActivity={handleEditActivity} onDeleteActivity={handleDeleteActivity} onViewActivity={handleViewActivity} />)}
          </div>

          <DragOverlay>
            {activeActivity ? <div className="rotate-5 scale-105">
                <ActivityCard activity={activeActivity} onEdit={() => {}} onDelete={() => {}} onClick={() => {}} />
              </div> : null}
          </DragOverlay>
        </DndContext>

        {/* Activity Modal */}
        <ActivityModal isOpen={modalState.isOpen} onClose={() => setModalState({
        isOpen: false,
        mode: 'create',
        activity: null
      })} onSave={handleSaveActivity} activity={modalState.activity} mode={modalState.mode} />
      </div>
    </div>;
};