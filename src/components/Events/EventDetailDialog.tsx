
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from '@/types/user';
import { Event, EventStatus } from '@/types/events';

interface EventDetailDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateEvent: (event: Event) => void;
  userProfile: UserProfile;
}

const EventDetailDialog = ({ event, open, onOpenChange, onUpdateEvent, userProfile }: EventDetailDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState({ ...event });

  const handleSave = () => {
    onUpdateEvent(editedEvent);
    setIsEditing(false);
    onOpenChange(false);
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      "reuniao": "Reunião",
      "conselho": "Conselho",
      "feira": "Feira",
      "prova_especial": "Prova Especial",
      "formatura": "Formatura",
      "palestra": "Palestra",
      "capacitacao": "Capacitação"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      "planejado": "Planejado",
      "confirmado": "Confirmado",
      "em_andamento": "Em Andamento",
      "realizado": "Realizado",
      "cancelado": "Cancelado",
      "adiado": "Adiado"
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {isEditing ? "Editar Evento" : "Detalhes do Evento"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Event type indicator */}
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {getTypeLabel(event.type)}
            </Badge>
            <Badge variant={event.status === "realizado" ? "default" : event.status === "confirmado" ? "secondary" : "outline"}>
              {getStatusLabel(event.status)}
            </Badge>
          </div>

          {/* Event details form/display */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={editedEvent.title}
                onChange={(e) => setEditedEvent(prev => ({ ...prev, title: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={editedEvent.description}
                onChange={(e) => setEditedEvent(prev => ({ ...prev, description: e.target.value }))}
                disabled={!isEditing}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={editedEvent.startDate}
                  onChange={(e) => setEditedEvent(prev => ({ ...prev, startDate: e.target.value, date: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="time">Horário</Label>
                <Input
                  id="time"
                  type="time"
                  value={editedEvent.startTime}
                  onChange={(e) => setEditedEvent(prev => ({ ...prev, startTime: e.target.value, time: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Local</Label>
              <Input
                id="location"
                value={editedEvent.location}
                onChange={(e) => setEditedEvent(prev => ({ ...prev, location: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            {(userProfile?.role === "coordenador" || userProfile?.role === "diretor") && isEditing && (
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={editedEvent.status}
                  onChange={(e) => setEditedEvent(prev => ({ ...prev, status: e.target.value as EventStatus }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="planejado">Planejado</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="realizado">Realizado</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="adiado">Adiado</option>
                </select>
              </div>
            )}
          </div>

          {/* Event metadata */}
          <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
            <p><strong>Organizador:</strong> {event.organizer.name}</p>
            <p><strong>Responsável:</strong> {event.responsible.name}</p>
            <p><strong>Criado em:</strong> {new Date(event.createdAt).toLocaleDateString('pt-BR')}</p>
            {event.participants && event.participants.length > 0 && (
              <p><strong>Participantes:</strong> {event.participants.map(p => p.name).join(', ')}</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
              {(userProfile?.role === "coordenador" || userProfile?.role === "diretor") && (
                <Button onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                Salvar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailDialog;
