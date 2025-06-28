
export type ActivityStatus = 'todo' | 'inProgress' | 'completed' | 'cancelled';
export type ActivityPriority = 'low' | 'medium' | 'high';

export interface Activity {
  id: string;
  title: string;
  description: string;
  status: ActivityStatus;
  priority: ActivityPriority;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: ActivityStatus;
  title: string;
  color: string;
  activities: Activity[];
}
