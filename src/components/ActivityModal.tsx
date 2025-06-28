
import React, { useState, useEffect } from 'react';
import { Activity, ActivityPriority, ActivityStatus } from '../types/activity';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  activity?: Activity | null;
  mode: 'create' | 'edit' | 'view';
}

const statusLabels = {
  todo: 'A fazer',
  inProgress: 'Em andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  activity,
  mode,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as ActivityStatus,
    priority: 'medium' as ActivityPriority,
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title,
        description: activity.description,
        status: activity.status,
        priority: activity.priority,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
      });
    }
  }, [activity, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const isReadOnly = mode === 'view';
  const title = mode === 'create' ? 'Nova Atividade' : 
                mode === 'edit' ? 'Editar Atividade' : 'Detalhes da Atividade';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Título *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Digite o título da atividade"
              required
              disabled={isReadOnly}
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva a atividade..."
              rows={3}
              disabled={isReadOnly}
              className="focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: ActivityStatus) => 
                  setFormData({ ...formData, status: value })
                }
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Prioridade
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: ActivityPriority) => 
                  setFormData({ ...formData, priority: value })
                }
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {activity && (
            <div className="pt-2 text-xs text-gray-500 space-y-1">
              <p>Criado em: {activity.createdAt.toLocaleString('pt-BR')}</p>
              <p>Atualizado em: {activity.updatedAt.toLocaleString('pt-BR')}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {!isReadOnly && (
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
              >
                {mode === 'create' ? 'Criar' : 'Salvar'}
              </Button>
            )}
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              {isReadOnly ? 'Fechar' : 'Cancelar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
