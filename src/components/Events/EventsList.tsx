
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Event, EventType, EventStatus } from "@/types/events";

interface EventsListProps {
  events: Event[];
  onViewEvent: (event: Event) => void;
}

const EventsList = ({ events, onViewEvent }: EventsListProps) => {
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

  const getTypeLabel = (type: EventType) => {
    const labels = {
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

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
          <p className="text-gray-600">
            Tente ajustar os filtros para encontrar eventos ou comece criando seu primeiro evento acadêmico.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewEvent(event)}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-gray-600 text-sm">{event.description}</p>
              </div>
              <div className="flex gap-2">
                <Badge className={getStatusColor(event.status)}>
                  {event.status.replace('_', ' ')}
                </Badge>
                <Badge variant="outline">
                  {getTypeLabel(event.type)}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {event.startDate}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {event.startTime} - {event.endTime}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {event.participants.length} participantes
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventsList;
