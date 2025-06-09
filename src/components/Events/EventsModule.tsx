
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { Event, EventType, EventStatus } from "@/types/events";
import { UserProfile } from "@/types/user";
import CreateEventDialog from "./CreateEventDialog";
import EventDetailDialog from "./EventDetailDialog";
import EventsCalendar from "./EventsCalendar";
import EventsStats from "./EventsStats";
import EventsFilters from "./EventsFilters";
import EventsList from "./EventsList";

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
    date: "2024-06-08", // Propriedade adicionada
    time: "14:00", // Propriedade adicionada
    startDate: "2024-06-08",
    endDate: "2024-06-08",
    startTime: "14:00",
    endTime: "16:00",
    location: "Sala de Reuniões",
    organizer: { id: "1", name: "Maria Silva Coordenadora" },
    responsible: { id: "1", name: "Maria Silva Coordenadora" }, // Propriedade adicionada
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
    date: "2024-06-15", // Propriedade adicionada
    time: "08:00", // Propriedade adicionada
    startDate: "2024-06-15",
    endDate: "2024-06-15",
    startTime: "08:00",
    endTime: "17:00",
    location: "Pátio Principal",
    organizer: { id: "1", name: "Maria Silva Coordenadora" },
    responsible: { id: "3", name: "Carlos Professor" }, // Propriedade adicionada
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

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("todos");
    setTypeFilter("todos");
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

      <EventsStats {...eventStats} />

      <Tabs defaultValue="lista" className="w-full">
        <TabsList>
          <TabsTrigger value="lista">Lista de Eventos</TabsTrigger>
          <TabsTrigger value="calendario">Calendário</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <EventsFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onClearFilters={handleClearFilters}
          />

          <EventsList
            events={filteredEvents}
            onViewEvent={handleViewEvent}
          />
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
