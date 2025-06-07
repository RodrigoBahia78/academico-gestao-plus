
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Resource, ResourceReservation } from "@/types/resources";
import { UserProfile } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

interface CreateReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateReservation: (reservation: Omit<ResourceReservation, 'id' | 'createdAt'>) => void;
  resources: Resource[];
  userProfile: UserProfile;
}

const CreateReservationDialog = ({ 
  open, 
  onOpenChange, 
  onCreateReservation, 
  resources, 
  userProfile 
}: CreateReservationDialogProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    resourceId: "",
    title: "",
    description: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    startTime: "",
    endTime: "",
    purpose: "",
    participants: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.resourceId || !formData.title || !formData.startDate || !formData.startTime || !formData.endTime) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const selectedResource = resources.find(r => r.id === formData.resourceId);
    if (!selectedResource) {
      toast({
        title: "Erro",
        description: "Recurso não encontrado.",
        variant: "destructive"
      });
      return;
    }

    // Verificar conflito de horário (simplificado)
    const startDateTime = new Date(`${format(formData.startDate, "yyyy-MM-dd")}T${formData.startTime}`);
    const endDateTime = new Date(`${format(formData.endDate || formData.startDate, "yyyy-MM-dd")}T${formData.endTime}`);
    
    if (startDateTime >= endDateTime) {
      toast({
        title: "Erro",
        description: "O horário de fim deve ser posterior ao horário de início.",
        variant: "destructive"
      });
      return;
    }

    const reservation: Omit<ResourceReservation, 'id' | 'createdAt'> = {
      resource: selectedResource,
      title: formData.title,
      description: formData.description,
      startDate: format(formData.startDate, "yyyy-MM-dd"),
      endDate: format(formData.endDate || formData.startDate, "yyyy-MM-dd"),
      startTime: formData.startTime,
      endTime: formData.endTime,
      requestedBy: {
        id: userProfile.id,
        name: userProfile.name,
        role: userProfile.role
      },
      status: "solicitada",
      purpose: formData.purpose,
      participants: formData.participants ? parseInt(formData.participants) : undefined,
      schoolId: userProfile.school.id,
      schoolYear: userProfile.schoolYear
    };

    onCreateReservation(reservation);
    
    // Reset form
    setFormData({
      resourceId: "",
      title: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      startTime: "",
      endTime: "",
      purpose: "",
      participants: ""
    });
    
    toast({
      title: "Sucesso",
      description: "Reserva solicitada com sucesso!"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Reserva</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="resource">Recurso *</Label>
            <Select value={formData.resourceId} onValueChange={(value) => setFormData({ ...formData, resourceId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um recurso" />
              </SelectTrigger>
              <SelectContent>
                {resources.map((resource) => (
                  <SelectItem key={resource.id} value={resource.id}>
                    {resource.name} - {resource.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nome da reserva"
              />
            </div>
            <div>
              <Label htmlFor="purpose">Finalidade</Label>
              <Select value={formData.purpose} onValueChange={(value) => setFormData({ ...formData, purpose: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aula">Aula</SelectItem>
                  <SelectItem value="reuniao">Reunião</SelectItem>
                  <SelectItem value="evento">Evento</SelectItem>
                  <SelectItem value="prova">Prova</SelectItem>
                  <SelectItem value="formacao">Formação</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
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
              placeholder="Descreva a atividade"
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
                    disabled={(date) => date < new Date()}
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
                    {formData.endDate ? format(formData.endDate, "dd/MM/yyyy", { locale: ptBR }) : "Mesmo dia"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData({ ...formData, endDate: date })}
                    disabled={(date) => date < (formData.startDate || new Date())}
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
              <Label htmlFor="participants">Participantes</Label>
              <Input
                id="participants"
                type="number"
                min="1"
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                placeholder="Número de pessoas"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Criar Reserva
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReservationDialog;
