
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, Plus, Search, Filter } from "lucide-react";
import { Event, EventType, EventStatus } from "@/types/events";
import { UserProfile } from "@/types/user";
import CreateEventDialog from "./CreateEventDialog";
import EventDetailDialog from "./EventDetailDialog";
import EventsCalendar from "./EventsCalendar";

interface EventsModuleProps {
  userProfile: UserProfile;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Conselho de Classe - 9º Ano",
    description: "Avaliação trimestral dos alunos do 9º ano com participação de todos os professores",
    type: "conselho",
    status: "confirmado",
    startDate: "2024-06-08",
    endDate: "2024-06-08",
    startTime: "14:00",
    endTime: "16:00",
    location: "Sala de Reuniões",
    organizer: { id: "1", name: "Maria Silva Coordenadora" },
    participants: [
      { id: "1", name: "João Professor", email: "joao@escola.edu.br", role: "Professor", status: "confirmado" },
      { id: "2", name: "Ana Orientadora", email: "ana@escola.edu.br", role: "Orientadora", status: "confirmado" }
    ],
    resources: [
      { id: "1", name: "Sala de Reuniões", type: "sala" },
      { id: "2", name: "Projetor", type: "equipamento" }
    ],
    recurrence: "unico",
    schoolId: "school_001",
    schoolYear: "2024",
    createdAt: "2024-06-01T10:00:00Z"
  },
  {
    id: "2",
    title: "Feira de Ciências",
    description: "Apresentação dos projetos científicos desenvolvidos pelos alunos durante o ano letivo",
    type: "feira",
    status: "planejado",
    startDate: "2024-06-15",
    endDate: "2024-06-15",
    startTime: "08:00",
    endTime: "17:00",
    location: "Pátio Principal",
    organizer: { id: "1", name: "Maria Silva Coordenadora" },
    participants: [
      { id: "3", name: "Carlos Professor", email: "carlos@escola.edu.br", role: "Professor", status: "convidado" }
    ],
    resources: [
      { id: "3", name: "Pátio Principal", type: "sala" },
      { id: "4", name: "Mesas", type: "material", quantity: 20 }
    ],
    recurrence: "anual",
    schoolId: "school_001",
    schoolYear: "2024",
    createdAt: "2024-06-01T11:00:00Z"
  }
];

const EventsModule = ({ userProfile }: EventsModuleProps) => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "todos">("todos");
  const [typeFilter, setTypeFilter] = useState<EventType | "todos">("todos");

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || event.status === statusFilter;
    const matchesType = typeFilter === "todos" || event.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

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

  const handleCreateEvent = (newEvent: Omit<Event, 'id' | 'createdAt'>) => {
    const event: Event = {
      ...newEvent,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setEvents([event, ...events]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? { ...updatedEvent, updatedAt: new Date().toISOString() } : event
    ));
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailDialogOpen(true);
  };

  const eventStats = {
    total: events.length,
    planejados: events.filter(e => e.status === "planejado").length,
    confirmados: events.filter(e => e.status === "confirmado").length,
    realizados: events.filter(e => e.status === "realizado").length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Eventos Acadêmicos</h2>
          <p className="text-gray-600 mt-1">
            Planejamento e controle de eventos acadêmicos - {userProfile.school.name}
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{eventStats.total}</div>
            <div className="text-sm text-gray-600">Total de Eventos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{eventStats.planejados}</div>
            <div className="text-sm text-gray-600">Planejados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{eventStats.confirmados}</div>
            <div className="text-sm text-gray-600">Confirmados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{eventStats.realizados}</div>
            <div className="text-sm text-gray-600">Realizados</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lista" className="w-full">
        <TabsList>
          <TabsTrigger value="lista">Lista de Eventos</TabsTrigger>
          <TabsTrigger value="calendario">Calendário</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar eventos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as EventStatus | "todos")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value="planejado">Planejado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="realizado">Realizado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                    <SelectItem value="adiado">Adiado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as EventType | "todos")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                    <SelectItem value="reuniao">Reunião</SelectItem>
                    <SelectItem value="conselho">Conselho</SelectItem>
                    <SelectItem value="feira">Feira</SelectItem>
                    <SelectItem value="prova_especial">Prova Especial</SelectItem>
                    <SelectItem value="formatura">Formatura</SelectItem>
                    <SelectItem value="palestra">Palestra</SelectItem>
                    <SelectItem value="capacitacao">Capacitação</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("todos");
                  setTypeFilter("todos");
                }}>
                  <Filter className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Eventos */}
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewEvent(event)}>
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

            {filteredEvents.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter !== "todos" || typeFilter !== "todos" 
                      ? "Tente ajustar os filtros para encontrar eventos."
                      : "Comece criando seu primeiro evento acadêmico."
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="calendario">
          <EventsCalendar />
        </TabsContent>
      </Tabs>

      <CreateEventDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateEvent={handleCreateEvent}
        userProfile={userProfile}
      />

      {selectedEvent && (
        <EventDetailDialog
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          event={selectedEvent}
          onUpdateEvent={handleUpdateEvent}
          userProfile={userProfile}
        />
      )}
    </div>
  );
};

export default EventsModule;
