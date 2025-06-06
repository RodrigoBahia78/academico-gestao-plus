
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  User, 
  FileText, 
  Edit,
  Check,
  X,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Event, EventStatus } from "@/types/events";
import { UserProfile } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

interface EventDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  onUpdateEvent: (event: Event) => void;
  userProfile: UserProfile;
}

const EventDetailDialog = ({ open, onOpenChange, event, onUpdateEvent, userProfile }: EventDetailDialogProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState<EventStatus>(event.status);
  const [eventNotes, setEventNotes] = useState(event.notes || "");

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case "planejado": return "bg-gray-100 text-gray-800";
      case "confirmado": return "bg-blue-100 text-blue-800";
      case "em_andamento": return "bg-green-100 text-green-800";
      case "realizado": return "bg-emerald-100 text-emerald-800";
      case "cancelado": return "bg-red-100 text-red-800";
      case "adiado": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "reuniao": "Reunião",
      "conselho": "Conselho",
      "feira": "Feira",
      "prova_especial": "Prova Especial",
      "formatura": "Formatura",
      "palestra": "Palestra",
      "capacitacao": "Capacitação"
    };
    return labels[type] || type;
  };

  const getRecurrenceLabel = (recurrence: string) => {
    const labels: Record<string, string> = {
      "unico": "Evento Único",
      "semanal": "Semanal",
      "mensal": "Mensal", 
      "bimestral": "Bimestral",
      "trimestral": "Trimestral",
      "semestral": "Semestral",
      "anual": "Anual"
    };
    return labels[recurrence] || recurrence;
  };

  const getParticipantStatusColor = (status: string) => {
    switch (status) {
      case "convidado": return "bg-yellow-100 text-yellow-800";
      case "confirmado": return "bg-green-100 text-green-800";
      case "ausente": return "bg-red-100 text-red-800";
      case "presente": return "bg-emerald-100 text-emerald-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const canEditEvent = () => {
    return userProfile.permissions.includes("manage_events") && 
           (event.organizer.id === userProfile.id || userProfile.role === "coordenador");
  };

  const handleStatusUpdate = () => {
    if (newStatus !== event.status) {
      const updatedEvent = {
        ...event,
        status: newStatus,
        notes: eventNotes
      };
      onUpdateEvent(updatedEvent);
      setIsEditing(false);
      toast({
        title: "Status atualizado",
        description: `O evento foi marcado como ${newStatus.replace('_', ' ')}.`
      });
    }
  };

  const handleNotesUpdate = () => {
    const updatedEvent = {
      ...event,
      notes: eventNotes
    };
    onUpdateEvent(updatedEvent);
    setIsEditing(false);
    toast({
      title: "Observações atualizadas",
      description: "As observações do evento foram salvas com sucesso."
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{event.title}</DialogTitle>
              <div className="flex gap-2 mt-2">
                <Badge className={getStatusColor(event.status)}>
                  {event.status.replace('_', ' ')}
                </Badge>
                <Badge variant="outline">
                  {getTypeLabel(event.type)}
                </Badge>
                {event.recurrence !== "unico" && (
                  <Badge variant="secondary">
                    {getRecurrenceLabel(event.recurrence)}
                  </Badge>
                )}
              </div>
            </div>
            {canEditEvent() && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Cancelar" : "Editar"}
              </Button>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="detalhes" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            <TabsTrigger value="participantes">Participantes</TabsTrigger>
            <TabsTrigger value="recursos">Recursos</TabsTrigger>
            <TabsTrigger value="observacoes">Observações</TabsTrigger>
          </TabsList>

          <TabsContent value="detalhes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Descrição</Label>
                  <p className="mt-1">{event.description || "Não informada"}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Data de Início</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{format(new Date(event.startDate), "PPP", { locale: ptBR })}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Data de Término</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{format(new Date(event.endDate), "PPP", { locale: ptBR })}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Horário</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Local</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Organizador</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{event.organizer.name}</span>
                  </div>
                </div>

                {isEditing && canEditEvent() && (
                  <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <div>
                      <Label className="text-sm font-medium">Atualizar Status</Label>
                      <Select value={newStatus} onValueChange={(value) => setNewStatus(value as EventStatus)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planejado">Planejado</SelectItem>
                          <SelectItem value="confirmado">Confirmado</SelectItem>
                          <SelectItem value="em_andamento">Em Andamento</SelectItem>
                          <SelectItem value="realizado">Realizado</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                          <SelectItem value="adiado">Adiado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleStatusUpdate} size="sm">
                      <Check className="h-4 w-4 mr-2" />
                      Salvar Status
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participantes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participantes ({event.participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {event.participants.length > 0 ? (
                  <div className="space-y-3">
                    {event.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{participant.name}</div>
                          <div className="text-sm text-gray-600">{participant.email}</div>
                          <div className="text-sm text-gray-500">{participant.role}</div>
                        </div>
                        <Badge className={getParticipantStatusColor(participant.status)}>
                          {participant.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum participante cadastrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recursos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Recursos Necessários ({event.resources.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {event.resources.length > 0 ? (
                  <div className="space-y-3">
                    {event.resources.map((resource) => (
                      <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{resource.name}</div>
                          <div className="text-sm text-gray-600 capitalize">{resource.type}</div>
                        </div>
                        {resource.quantity && (
                          <Badge variant="secondary">
                            Qtd: {resource.quantity}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum recurso cadastrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="observacoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing && canEditEvent() ? (
                  <div className="space-y-4">
                    <Textarea
                      value={eventNotes}
                      onChange={(e) => setEventNotes(e.target.value)}
                      placeholder="Adicione observações sobre o evento..."
                      rows={6}
                    />
                    <Button onClick={handleNotesUpdate} size="sm">
                      <Check className="h-4 w-4 mr-2" />
                      Salvar Observações
                    </Button>
                  </div>
                ) : (
                  <div>
                    {event.notes ? (
                      <p className="whitespace-pre-wrap">{event.notes}</p>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhuma observação cadastrada</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Histórico de alterações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Histórico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <span className="font-medium">Evento criado</span>
                      <div className="text-gray-500">
                        {format(new Date(event.createdAt), "PPp", { locale: ptBR })} por {event.organizer.name}
                      </div>
                    </div>
                  </div>
                  {event.updatedAt && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <span className="font-medium">Última atualização</span>
                        <div className="text-gray-500">
                          {format(new Date(event.updatedAt), "PPp", { locale: ptBR })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`text-sm font-medium text-gray-700 ${className}`}>{children}</div>
);

export default EventDetailDialog;
