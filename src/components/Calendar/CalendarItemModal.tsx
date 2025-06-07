
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, FileText, AlertTriangle } from "lucide-react";
import { CalendarItem } from "@/types/calendar";
import { UserProfile } from "@/types/user";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: CalendarItem;
  userProfile: UserProfile;
}

const CalendarItemModal = ({ open, onOpenChange, item, userProfile }: CalendarItemModalProps) => {
  const getTypeColor = (type: CalendarItem['type']) => {
    switch (type) {
      case "evento": return "bg-blue-100 text-blue-800";
      case "reserva": return "bg-green-100 text-green-800";
      case "ocorrencia": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: CalendarItem['type']) => {
    switch (type) {
      case "evento": return <Calendar className="h-5 w-5" />;
      case "reserva": return <MapPin className="h-5 w-5" />;
      case "ocorrencia": return <AlertTriangle className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: CalendarItem['type']) => {
    switch (type) {
      case "evento": return "Evento";
      case "reserva": return "Reserva";
      case "ocorrencia": return "Ocorrência";
      default: return "Item";
    }
  };

  const getGravityColor = (gravity?: string) => {
    switch (gravity) {
      case "grave": return "bg-red-100 text-red-800";
      case "moderada": return "bg-yellow-100 text-yellow-800";
      case "leve": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderOccurrenceDetails = () => {
    if (item.type !== "ocorrencia") return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Detalhes da Ocorrência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {item.metadata?.studentName && (
            <div className="flex justify-between">
              <span className="font-medium">Aluno:</span>
              <span className="text-gray-600">{item.metadata.studentName}</span>
            </div>
          )}
          {item.metadata?.class && (
            <div className="flex justify-between">
              <span className="font-medium">Turma:</span>
              <span className="text-gray-600">{item.metadata.class}</span>
            </div>
          )}
          {item.category && (
            <div className="flex justify-between">
              <span className="font-medium">Tipo:</span>
              <Badge variant="outline" className="capitalize">{item.category}</Badge>
            </div>
          )}
          {item.metadata?.gravity && (
            <div className="flex justify-between">
              <span className="font-medium">Gravidade:</span>
              <Badge className={getGravityColor(item.metadata.gravity)}>
                {item.metadata.gravity}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderEventDetails = () => {
    if (item.type !== "evento") return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detalhes do Evento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {item.category && (
            <div className="flex justify-between">
              <span className="font-medium">Categoria:</span>
              <Badge variant="outline" className="capitalize">{item.category}</Badge>
            </div>
          )}
          {item.participants && (
            <div className="flex justify-between">
              <span className="font-medium">Participantes:</span>
              <span className="text-gray-600 flex items-center gap-1">
                <Users className="h-4 w-4" />
                {item.participants} pessoas
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderReservationDetails = () => {
    if (item.type !== "reserva") return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Detalhes da Reserva
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {item.metadata?.resourceName && (
            <div className="flex justify-between">
              <span className="font-medium">Recurso:</span>
              <span className="text-gray-600">{item.metadata.resourceName}</span>
            </div>
          )}
          {item.metadata?.purpose && (
            <div className="flex justify-between">
              <span className="font-medium">Finalidade:</span>
              <Badge variant="outline" className="capitalize">{item.metadata.purpose}</Badge>
            </div>
          )}
          {item.participants && (
            <div className="flex justify-between">
              <span className="font-medium">Participantes:</span>
              <span className="text-gray-600 flex items-center gap-1">
                <Users className="h-4 w-4" />
                {item.participants} pessoas
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getTypeIcon(item.type)}
            {item.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              {item.description && (
                <p className="text-gray-600 mt-2">{item.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Badge className={getTypeColor(item.type)}>
                {getTypeLabel(item.type)}
              </Badge>
              {item.status && (
                <Badge variant="outline" className="capitalize">
                  {item.status.replace('_', ' ')}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Informações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Data:</span>
                  <span className="text-gray-600">
                    {format(new Date(item.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
                {item.startTime && (
                  <div className="flex justify-between">
                    <span className="font-medium">Horário:</span>
                    <span className="text-gray-600">
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>
                )}
                {item.location && (
                  <div className="flex justify-between">
                    <span className="font-medium">Local:</span>
                    <span className="text-gray-600">{item.location}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium">Tipo:</span>
                  <Badge className={getTypeColor(item.type)}>
                    {getTypeLabel(item.type)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {renderOccurrenceDetails()}
            {renderEventDetails()}
            {renderReservationDetails()}
          </div>

          <div className="flex justify-between">
            <div className="text-sm text-gray-500">
              <p>Escola: {userProfile.school.name}</p>
              <p>Ano Letivo: {userProfile.schoolYear}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Ver Detalhes
              </Button>
              {item.type !== "ocorrencia" && (
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarItemModal;
