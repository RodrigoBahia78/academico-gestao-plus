
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Plus } from "lucide-react";

interface Event {
  id: string;
  title: string;
  type: "reuniao" | "conselho" | "feira" | "prova";
  date: string;
  time: string;
  location: string;
  participants: number;
  description: string;
  status: "agendado" | "em_andamento" | "concluido";
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Conselho de Classe - 9º Ano",
    type: "conselho",
    date: "2024-06-08",
    time: "14:00",
    location: "Sala de Reuniões",
    participants: 12,
    description: "Avaliação trimestral dos alunos do 9º ano",
    status: "agendado"
  },
  {
    id: "2",
    title: "Feira de Ciências",
    type: "feira",
    date: "2024-06-15",
    time: "08:00",
    location: "Pátio Principal",
    participants: 200,
    description: "Apresentação dos projetos científicos dos alunos",
    status: "agendado"
  },
  {
    id: "3",
    title: "Reunião de Coordenação",
    type: "reuniao",
    date: "2024-06-06",
    time: "16:00",
    location: "Coordenação",
    participants: 8,
    description: "Planejamento das atividades da próxima semana",
    status: "em_andamento"
  }
];

const EventsCalendar = () => {
  const [events] = useState<Event[]>(mockEvents);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "reuniao": return "bg-blue-100 text-blue-800";
      case "conselho": return "bg-purple-100 text-purple-800";
      case "feira": return "bg-green-100 text-green-800";
      case "prova": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendado": return "bg-yellow-100 text-yellow-800";
      case "em_andamento": return "bg-blue-100 text-blue-800";
      case "concluido": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Eventos Acadêmicos</h2>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximos Eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-gray-600 text-sm">{event.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.participants} participantes
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Mês</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">8</div>
                <div className="text-sm text-gray-600">Eventos Agendados</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">5</div>
                <div className="text-sm text-gray-600">Eventos Concluídos</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">320</div>
                <div className="text-sm text-gray-600">Total de Participantes</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;
