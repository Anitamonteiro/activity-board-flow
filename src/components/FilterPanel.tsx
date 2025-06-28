
import React from 'react';
import { ActivityStatus, ActivityPriority } from '../types/activity';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FilterPanelProps {
  filters: {
    status: ActivityStatus | 'all';
    priority: ActivityPriority | 'all';
    search: string;
  };
  onFiltersChange: (filters: Partial<FilterPanelProps['filters']>) => void;
  onClearFilters: () => void;
}

const statusOptions = [
  { value: 'all', label: 'Todos os status' },
  { value: 'todo', label: 'A fazer' },
  { value: 'inProgress', label: 'Em andamento' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
];

const priorityOptions = [
  { value: 'all', label: 'Todas as prioridades' },
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Média' },
  { value: 'low', label: 'Baixa' },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const hasActiveFilters = filters.status !== 'all' || filters.priority !== 'all' || filters.search !== '';

  return (
    <Card className="mb-6 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Filtros</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="ml-auto text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
              Limpar filtros
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Buscar
            </label>
            <Input
              placeholder="Digite para buscar..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Status
            </label>
            <Select
              value={filters.status}
              onValueChange={(value: ActivityStatus | 'all') => 
                onFiltersChange({ status: value })
              }
            >
              <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Prioridade
            </label>
            <Select
              value={filters.priority}
              onValueChange={(value: ActivityPriority | 'all') => 
                onFiltersChange({ priority: value })
              }
            >
              <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
