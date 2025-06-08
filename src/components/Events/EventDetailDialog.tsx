
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

// Definir o tipo Event localmente se não estiver exportado
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "pedagogico" | "institucional" | "avaliativo";
  status: "planejado" | "confirmado" | "realizado" | "cancelado";
  responsible: string;
  participants?: string[];
  createdAt: string;
}

interface EventDetailDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userProfile: UserProfile | null;
}

const EventDetailDialog = ({ event, open, onOpenChange, userProfile }: EventDetailDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState({ ...event });

  const handleSave = () => {
    // Lógica para salvar as alterações do evento (simulação)
    console.log("Evento salvo:", editedEvent);
    setIsEditing(false);
    onOpenChange(false);
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
            <Badge variant={event.type === "pedagogico" ? "default" : event.type === "institucional" ? "secondary" : "outline"}>
              {event.type === "pedagogico" && "Pedagógico"}
              {event.type === "institucional" && "Institucional"}
              {event.type === "avaliativo" && "Avaliativo"}
            </Badge>
            <Badge variant={event.status === "realizado" ? "default" : event.status === "confirmado" ? "secondary" : "outline"}>
              {event.status === "planejado" && "Planejado"}
              {event.status === "confirmado" && "Confirmado"}
              {event.status === "realizado" && "Realizado"}
              {event.status === "cancelado" && "Cancelado"}
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
                  value={editedEvent.date}
                  onChange={(e) => setEditedEvent(prev => ({ ...prev, date: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="time">Horário</Label>
                <Input
                  id="time"
                  type="time"
                  value={editedEvent.time}
                  onChange={(e) => setEditedEvent(prev => ({ ...prev, time: e.target.value }))}
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

            {(userProfile?.role === "coordenador_pedagogico" || userProfile?.role === "diretor") && isEditing && (
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={editedEvent.status}
                  onChange={(e) => setEditedEvent(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="planejado">Planejado</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="realizado">Realizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            )}
          </div>

          {/* Event metadata */}
          <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
            <p><strong>Responsável:</strong> {event.responsible}</p>
            <p><strong>Criado em:</strong> {new Date(event.createdAt).toLocaleDateString('pt-BR')}</p>
            {event.participants && event.participants.length > 0 && (
              <p><strong>Participantes:</strong> {event.participants.join(', ')}</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
              {(userProfile?.role === "coordenador_pedagogico" || userProfile?.role === "diretor") && (
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
