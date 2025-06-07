import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Event, EventType, EventRecurrence } from "@/types/events";
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
    recurrence: "unico" as EventRecurrence
  });

  const [participants, setParticipants] = useState<Array<{ name: string; email: string; role: string; status: "convidado" | "confirmado" | "rejeitado" }>>([]);
  const [resources, setResources] = useState<Array<{ name: string; type: "sala" | "equipamento" | "material"; quantity?: number }>>([]);
  const [newParticipant, setNewParticipant] = useState({ name: "", email: "", role: "" });
  const [newResource, setNewResource] = useState({ name: "", type: "sala" as "sala" | "equipamento" | "material", quantity: 1 });

  const handleAddParticipant = () => {
    if (newParticipant.name && newParticipant.email && newParticipant.role) {
      setParticipants([...participants, { ...newParticipant, status: "convidado" as const }]);
      setNewParticipant({ name: "", email: "", role: "" });
    }
  };

  const handleAddResource = () => {
    if (newResource.name) {
      setResources([...resources, { ...newResource }]);
      setNewResource({ name: "", type: "sala", quantity: 1 });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.startDate || !formData.startTime || !formData.endTime) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const event: Omit<Event, 'id' | 'createdAt'> = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      status: "planejado",
      startDate: format(formData.startDate, "yyyy-MM-dd"),
      endDate: formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : format(formData.startDate, "yyyy-MM-dd"),
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
      organizer: { id: userProfile.id, name: userProfile.name },
      participants: participants.map((p, index) => ({
        id: `temp_${index}`,
        name: p.name,
        email: p.email,
        role: p.role,
        status: p.status
      })),
      resources: resources.map((r, index) => ({
        id: `temp_${index}`,
        name: r.name,
        type: r.type,
        quantity: r.quantity
      })),
      recurrence: formData.recurrence,
      schoolId: userProfile.school.id,
      schoolYear: userProfile.schoolYear
    };

    onCreateEvent(event);
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      type: "" as EventType,
      startDate: undefined,
      endDate: undefined,
      startTime: "",
      endTime: "",
      location: "",
      recurrence: "unico"
    });
    setParticipants([]);
    setResources([]);
    
    toast({
      title: "Sucesso",
      description: "Evento criado com sucesso!"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Evento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nome do evento"
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as EventType })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
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

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o evento"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Data de Início *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData({ ...formData, startDate: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Data de Fim</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData({ ...formData, endDate: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startTime">Horário de Início *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endTime">Horário de Fim *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="location">Local</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Local do evento"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="recurrence">Recorrência</Label>
            <Select value={formData.recurrence} onValueChange={(value) => setFormData({ ...formData, recurrence: value as EventRecurrence })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unico">Evento único</SelectItem>
                <SelectItem value="diario">Diário</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Participantes */}
          <div>
            <Label>Participantes</Label>
            <div className="space-y-3">
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
                <Button type="button" onClick={handleAddParticipant} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {participants.map((participant, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {participant.name}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setParticipants(participants.filter((_, i) => i !== index))}
                      className="h-auto p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Recursos */}
          <div>
            <Label>Recursos</Label>
            <div className="space-y-3">
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
                  type="number"
                  placeholder="Qtd"
                  min="1"
                  value={newResource.quantity}
                  onChange={(e) => setNewResource({ ...newResource, quantity: parseInt(e.target.value) || 1 })}
                />
                <Button type="button" onClick={handleAddResource} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {resources.map((resource, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {resource.name} {resource.quantity && resource.quantity > 1 && `(${resource.quantity})`}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setResources(resources.filter((_, i) => i !== index))}
                      className="h-auto p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
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
