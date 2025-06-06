
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Event, EventType, EventRecurrence, EventParticipant, EventResource } from "@/types/events";
import { UserProfile } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  userProfile: UserProfile;
}

const CreateEventDialog = ({ open, onOpenChange, onCreateEvent, userProfile }: CreateEventDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "" as EventType,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    startTime: "",
    endTime: "",
    location: "",
    recurrence: "unico" as EventRecurrence,
    notes: ""
  });

  const [participants, setParticipants] = useState<Omit<EventParticipant, 'id'>[]>([]);
  const [resources, setResources] = useState<Omit<EventResource, 'id'>[]>([]);
  const [newParticipant, setNewParticipant] = useState({ name: "", email: "", role: "" });
  const [newResource, setNewResource] = useState({ name: "", type: "sala" as const, quantity: 1 });

  const eventTypes: { value: EventType; label: string }[] = [
    { value: "reuniao", label: "Reunião" },
    { value: "conselho", label: "Conselho" },
    { value: "feira", label: "Feira" },
    { value: "prova_especial", label: "Prova Especial" },
    { value: "formatura", label: "Formatura" },
    { value: "palestra", label: "Palestra" },
    { value: "capacitacao", label: "Capacitação" }
  ];

  const recurrenceTypes: { value: EventRecurrence; label: string }[] = [
    { value: "unico", label: "Evento Único" },
    { value: "semanal", label: "Semanal" },
    { value: "mensal", label: "Mensal" },
    { value: "bimestral", label: "Bimestral" },
    { value: "trimestral", label: "Trimestral" },
    { value: "semestral", label: "Semestral" },
    { value: "anual", label: "Anual" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.type || !formData.startDate || !formData.startTime || !formData.location) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newEvent: Omit<Event, 'id' | 'createdAt'> = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      status: "planejado",
      startDate: format(formData.startDate, "yyyy-MM-dd"),
      endDate: format(formData.endDate || formData.startDate, "yyyy-MM-dd"),
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
      organizer: {
        id: userProfile.id,
        name: userProfile.name
      },
      participants: participants.map((p, index) => ({
        id: `temp_${index}`,
        ...p,
        status: "convidado"
      })),
      resources: resources.map((r, index) => ({
        id: `temp_${index}`,
        ...r
      })),
      recurrence: formData.recurrence,
      notes: formData.notes,
      schoolId: userProfile.school.id,
      schoolYear: userProfile.schoolYear
    };

    onCreateEvent(newEvent);
    resetForm();
    toast({
      title: "Evento criado",
      description: "O evento foi criado com sucesso."
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "" as EventType,
      startDate: undefined,
      endDate: undefined,
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
    if (newParticipant.name && newParticipant.email && newParticipant.role) {
      setParticipants([...participants, newParticipant]);
      setNewParticipant({ name: "", email: "", role: "" });
    }
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const addResource = () => {
    if (newResource.name) {
      setResources([...resources, newResource]);
      setNewResource({ name: "", type: "sala", quantity: 1 });
    }
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Evento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Evento *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Conselho de Classe - 9º Ano"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Evento *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as EventType })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
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
              placeholder="Descreva os objetivos e detalhes do evento..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Início *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData({ ...formData, startDate: date, endDate: date || formData.endDate })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data de Término</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP", { locale: ptBR }) : "Mesmo dia"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData({ ...formData, endDate: date })}
                    initialFocus
                    className="pointer-events-auto"
                    disabled={(date) => formData.startDate ? date < formData.startDate : false}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Horário de Início *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Horário de Término</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Local *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Sala de Reuniões"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recurrence">Recorrência</Label>
            <Select value={formData.recurrence} onValueChange={(value) => setFormData({ ...formData, recurrence: value as EventRecurrence })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {recurrenceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                type="email"
                value={newParticipant.email}
                onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
              />
              <Input
                placeholder="Função"
                value={newParticipant.role}
                onChange={(e) => setNewParticipant({ ...newParticipant, role: e.target.value })}
              />
              <Button type="button" onClick={addParticipant}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {participants.length > 0 && (
              <div className="space-y-2">
                {participants.map((participant, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{participant.name} - {participant.role}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeParticipant(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
              <Select value={newResource.type} onValueChange={(value) => setNewResource({ ...newResource, type: value as "sala" | "equipamento" | "material" })}>
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
                placeholder="Quantidade"
                type="number"
                min="1"
                value={newResource.quantity}
                onChange={(e) => setNewResource({ ...newResource, quantity: parseInt(e.target.value) || 1 })}
              />
              <Button type="button" onClick={addResource}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {resources.length > 0 && (
              <div className="space-y-2">
                {resources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{resource.name} ({resource.type}) - Qtd: {resource.quantity || 1}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeResource(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Informações adicionais sobre o evento..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
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
