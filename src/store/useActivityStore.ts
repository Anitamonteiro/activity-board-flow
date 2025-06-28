
import { create } from 'zustand';
import { Activity, ActivityStatus, ActivityPriority } from '../types/activity';

interface ActivityStore {
  activities: Activity[];
  filteredActivities: Activity[];
  filters: {
    status: ActivityStatus | 'all';
    priority: ActivityPriority | 'all';
    search: string;
  };
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  moveActivity: (id: string, newStatus: ActivityStatus) => void;
  reorderActivities: (status: ActivityStatus, startIndex: number, endIndex: number) => void;
  setFilters: (filters: Partial<ActivityStore['filters']>) => void;
  applyFilters: () => void;
}

export const useActivityStore = create<ActivityStore>((set, get) => ({
  activities: [
    {
      id: '1',
      title: 'Implementar autenticação',
      description: 'Criar sistema de login e registro com validação',
      status: 'todo',
      priority: 'high',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      title: 'Design do dashboard',
      description: 'Criar protótipo e implementar interface do dashboard principal',
      status: 'inProgress',
      priority: 'medium',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
    },
    {
      id: '3',
      title: 'Testes unitários',
      description: 'Implementar testes para componentes críticos',
      status: 'completed',
      priority: 'medium',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-14'),
    },
    {
      id: '4',
      title: 'Configurar CI/CD',
      description: 'Configurar pipeline de integração e deploy automático',
      status: 'cancelled',
      priority: 'low',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-13'),
    },
  ],
  filteredActivities: [],
  filters: {
    status: 'all',
    priority: 'all',
    search: '',
  },

  addActivity: (activityData) => {
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      activities: [...state.activities, newActivity],
    }));
    
    get().applyFilters();
  },

  updateActivity: (id, updates) => {
    set((state) => ({
      activities: state.activities.map((activity) =>
        activity.id === id 
          ? { ...activity, ...updates, updatedAt: new Date() }
          : activity
      ),
    }));
    
    get().applyFilters();
  },

  deleteActivity: (id) => {
    set((state) => ({
      activities: state.activities.filter((activity) => activity.id !== id),
    }));
    
    get().applyFilters();
  },

  moveActivity: (id, newStatus) => {
    get().updateActivity(id, { status: newStatus });
  },

  reorderActivities: (status, startIndex, endIndex) => {
    set((state) => {
      const statusActivities = state.activities.filter(a => a.status === status);
      const otherActivities = state.activities.filter(a => a.status !== status);
      
      const [movedActivity] = statusActivities.splice(startIndex, 1);
      statusActivities.splice(endIndex, 0, movedActivity);
      
      return {
        activities: [...otherActivities, ...statusActivities].sort((a, b) => 
          a.createdAt.getTime() - b.createdAt.getTime()
        ),
      };
    });
    
    get().applyFilters();
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    
    get().applyFilters();
  },

  applyFilters: () => {
    const { activities, filters } = get();
    
    let filtered = activities;
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(activity => activity.status === filters.status);
    }
    
    if (filters.priority !== 'all') {
      filtered = filtered.filter(activity => activity.priority === filters.priority);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower)
      );
    }
    
    set({ filteredActivities: filtered });
  },
}));

// Initialize filtered activities
setTimeout(() => {
  useActivityStore.getState().applyFilters();
}, 0);
