
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Plus, X } from "lucide-react";
import { Event, EventType, EventRecurrence, EventParticipant, EventResource } from "@/types/events";
import { UserProfile } from "@/types/user";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  userProfile: UserProfile;
}

const CreateEventDialog = ({ open, onOpenChange, onCreateEvent, userProfile }: CreateEventDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "reuniao" as EventType,
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    recurrence: "unico" as EventRecurrence,
    notes: ""
  });

  const [participants, setParticipants] = useState<EventParticipant[]>([
    {
      id: "1",
      name: "João Professor",
      email: "joao@escola.edu.br",
      role: "Professor",
      status: "convidado"
    },
    {
      id: "2", 
      name: "Ana Orientadora",
      email: "ana@escola.edu.br",
      role: "Orientadora",
      status: "convidado"
    }
  ]);

  const [resources, setResources] = useState<EventResource[]>([]);
  const [newParticipant, setNewParticipant] = useState({ name: "", email: "", role: "" });
  const [newResource, setNewResource] = useState({ name: "", type: "sala" as EventResource['type'], quantity: 1 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const event: Omit<Event, 'id' | 'createdAt'> = {
      ...formData,
      date: formData.startDate, // Adicionar a propriedade date
      time: formData.startTime, // Adicionar a propriedade time
      status: "planejado",
      organizer: {
        id: userProfile.id,
        name: userProfile.name
      },
      responsible: { // Adicionar a propriedade responsible
        id: userProfile.id,
        name: userProfile.name
      },
      participants,
      resources,
      schoolId: userProfile.school.id,
      schoolYear: userProfile.schoolYear
    };

    onCreateEvent(event);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "reuniao",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      location: "",
      recurrence: "unico",
      notes: ""
    });
    setParticipants([]);
    setResources([]);
    setNewParticipant({ name: "", email: "", role: "" });
    setNewResource({ name: "", type: "sala", quantity: 1 });
  };

  const addParticipant = () => {
    if (newParticipant.name && newParticipant.email) {
      const participant: EventParticipant = {
        id: Date.now().toString(),
        ...newParticipant,
        status: "convidado"
      };
      setParticipants([...participants, participant]);
      setNewParticipant({ name: "", email: "", role: "" });
    }
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const addResource = () => {
    if (newResource.name) {
      const resource: EventResource = {
        id: Date.now().toString(),
        ...newResource
      };
      setResources([...resources, resource]);
      setNewResource({ name: "", type: "sala", quantity: 1 });
    }
  };

  const removeResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Criar Novo Evento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as EventType })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reuniao">Reunião</SelectItem>
                  <SelectItem value="conselho">Conselho</SelectItem>
                  <SelectItem value="feira">Feira</SelectItem>
                  <SelectItem value="prova_especial">Prova Especial</SelectItem>
                  <SelectItem value="formatura">Formatura</SelectItem>
                  <SelectItem value="palestra">Palestra</SelectItem>
                  <SelectItem value="capacitacao">Capacitação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Data e Horário */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data Início *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data Fim *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Hora Início *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Hora Fim *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Local *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurrence">Recorrência</Label>
              <Select value={formData.recurrence} onValueChange={(value) => setFormData({ ...formData, recurrence: value as EventRecurrence })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unico">Único</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="bimestral">Bimestral</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                  <SelectItem value="semestral">Semestral</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Participantes */}
          <div className="space-y-4">
            <Label>Participantes</Label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Input
                placeholder="Nome"
                value={newParticipant.name}
                onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                value={newParticipant.email}
                onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
              />
              <Input
                placeholder="Cargo"
                value={newParticipant.role}
                onChange={(e) => setNewParticipant({ ...newParticipant, role: e.target.value })}
              />
              <Button type="button" onClick={addParticipant}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {participants.map((participant) => (
                <Badge key={participant.id} variant="outline" className="flex items-center gap-1">
                  {participant.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeParticipant(participant.id)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Recursos */}
          <div className="space-y-4">
            <Label>Recursos Necessários</Label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Input
                placeholder="Nome do recurso"
                value={newResource.name}
                onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
              />
              <Select value={newResource.type} onValueChange={(value) => setNewResource({ ...newResource, type: value as EventResource['type'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sala">Sala</SelectItem>
                  <SelectItem value="equipamento">Equipamento</SelectItem>
                  <SelectItem value="material">Material</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Quantidade"
                value={newResource.quantity}
                onChange={(e) => setNewResource({ ...newResource, quantity: parseInt(e.target.value) || 1 })}
              />
              <Button type="button" onClick={addResource}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {resources.map((resource) => (
                <Badge key={resource.id} variant="outline" className="flex items-center gap-1">
                  {resource.name} ({resource.quantity || 1})
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeResource(resource.id)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Criar Evento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
