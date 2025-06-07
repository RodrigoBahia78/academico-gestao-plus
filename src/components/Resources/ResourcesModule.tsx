
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar } from "lucide-react";
import { UserProfile } from "@/types/user";
import { Resource, ResourceReservation, ResourceType, ResourceStatus } from "@/types/resources";
import CreateResourceDialog from "./CreateResourceDialog";
import CreateReservationDialog from "./CreateReservationDialog";
import ResourceDetailDialog from "./ResourceDetailDialog";
import ReservationCalendar from "./ReservationCalendar";
import ResourcesStats from "./ResourcesStats";
import ResourcesFilters from "./ResourcesFilters";
import ResourcesList from "./ResourcesList";
import ReservationsList from "./ReservationsList";

interface ResourcesModuleProps {
  userProfile: UserProfile;
}

const mockRooms: Resource[] = [
  {
    id: "1",
    name: "Auditório Principal",
    type: "sala",
    code: "AUD001",
    description: "Auditório com capacidade para 200 pessoas",
    capacity: 200,
    location: "Bloco A - Térreo",
    status: "disponivel",
    specifications: {
      ar_condicionado: true,
      projetor: true,
      som: true,
      microfones: 4
    },
    schoolId: "school_001",
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    name: "Laboratório de Informática",
    type: "sala",
    code: "LAB001",
    description: "Laboratório com 30 computadores",
    capacity: 30,
    location: "Bloco B - 2º Andar",
    status: "ocupado",
    specifications: {
      computadores: 30,
      ar_condicionado: true,
      projetor: true
    },
    schoolId: "school_001",
    createdAt: "2024-01-15T10:00:00Z"
  }
];

const mockEquipments: Resource[] = [
  {
    id: "3",
    name: "Projetor Portátil Epson",
    type: "equipamento",
    code: "PROJ001",
    description: "Projetor para apresentações",
    location: "Almoxarifado",
    status: "disponivel",
    specifications: {
      resolucao: "1080p",
      lumens: 3000,
      conectividade: ["HDMI", "VGA", "USB"]
    },
    schoolId: "school_001",
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "4",
    name: "Notebook Dell Inspiron",
    type: "equipamento",
    code: "NOTE001",
    description: "Notebook para uso administrativo",
    location: "Coordenação",
    status: "manutencao",
    specifications: {
      processador: "Intel i5",
      memoria: "8GB",
      armazenamento: "256GB SSD"
    },
    schoolId: "school_001",
    createdAt: "2024-01-15T10:00:00Z"
  }
];

const mockReservations: ResourceReservation[] = [
  {
    id: "1",
    resource: mockRooms[1],
    title: "Aula de Programação",
    description: "Aula prática de desenvolvimento web",
    startDate: "2024-06-08",
    endDate: "2024-06-08",
    startTime: "14:00",
    endTime: "16:00",
    requestedBy: {
      id: "2",
      name: "Prof. João Silva",
      role: "Professor"
    },
    status: "aprovada",
    purpose: "Aula",
    participants: 25,
    schoolId: "school_001",
    schoolYear: "2024",
    createdAt: "2024-06-01T10:00:00Z"
  }
];

const ResourcesModule = ({ userProfile }: ResourcesModuleProps) => {
  const [resources, setResources] = useState<Resource[]>([...mockRooms, ...mockEquipments]);
  const [reservations, setReservations] = useState<ResourceReservation[]>(mockReservations);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isCreateResourceDialogOpen, setIsCreateResourceDialogOpen] = useState(false);
  const [isCreateReservationDialogOpen, setIsCreateReservationDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<ResourceType | "todos">("todos");
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | "todos">("todos");
  const [locationFilter, setLocationFilter] = useState("");

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "todos" || resource.type === typeFilter;
    const matchesStatus = statusFilter === "todos" || resource.status === statusFilter;
    const matchesLocation = !locationFilter || resource.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesType && matchesStatus && matchesLocation;
  });

  const handleCreateResource = (newResource: Omit<Resource, 'id' | 'createdAt'>) => {
    const resource: Resource = {
      ...newResource,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setResources([resource, ...resources]);
    setIsCreateResourceDialogOpen(false);
  };

  const handleCreateReservation = (newReservation: Omit<ResourceReservation, 'id' | 'createdAt'>) => {
    const reservation: ResourceReservation = {
      ...newReservation,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setReservations([reservation, ...reservations]);
    setIsCreateReservationDialogOpen(false);
  };

  const handleViewResource = (resource: Resource) => {
    setSelectedResource(resource);
    setIsDetailDialogOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("todos");
    setStatusFilter("todos");
    setLocationFilter("");
  };

  const resourceStats = {
    total: resources.length,
    salas: resources.filter(r => r.type === "sala").length,
    equipamentos: resources.filter(r => r.type === "equipamento").length,
    disponivel: resources.filter(r => r.status === "disponivel").length,
    ocupado: resources.filter(r => r.status === "ocupado").length,
    manutencao: resources.filter(r => r.status === "manutencao").length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Salas e Recursos</h2>
          <p className="text-gray-600 mt-1">
            Gestão de recursos físicos e reservas - {userProfile.school.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsCreateReservationDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Nova Reserva
          </Button>
          <Button 
            onClick={() => setIsCreateResourceDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Recurso
          </Button>
        </div>
      </div>

      <ResourcesStats {...resourceStats} />

      <Tabs defaultValue="recursos" className="w-full">
        <TabsList>
          <TabsTrigger value="recursos">Recursos</TabsTrigger>
          <TabsTrigger value="reservas">Reservas</TabsTrigger>
          <TabsTrigger value="calendario">Calendário</TabsTrigger>
        </TabsList>

        <TabsContent value="recursos" className="space-y-4">
          <ResourcesFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            onClearFilters={handleClearFilters}
          />

          <ResourcesList
            resources={filteredResources}
            searchTerm={searchTerm}
            typeFilter={typeFilter}
            statusFilter={statusFilter}
            locationFilter={locationFilter}
            onViewResource={handleViewResource}
            onReserveResource={() => setIsCreateReservationDialogOpen(true)}
          />
        </TabsContent>

        <TabsContent value="reservas" className="space-y-4">
          <ReservationsList reservations={reservations} />
        </TabsContent>

        <TabsContent value="calendario">
          <ReservationCalendar reservations={reservations} />
        </TabsContent>
      </Tabs>

      <CreateResourceDialog
        open={isCreateResourceDialogOpen}
        onOpenChange={setIsCreateResourceDialogOpen}
        onCreateResource={handleCreateResource}
        userProfile={userProfile}
      />

      <CreateReservationDialog
        open={isCreateReservationDialogOpen}
        onOpenChange={setIsCreateReservationDialogOpen}
        onCreateReservation={handleCreateReservation}
        resources={resources.filter(r => r.status === "disponivel")}
        userProfile={userProfile}
      />

      {selectedResource && (
        <ResourceDetailDialog
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          resource={selectedResource}
          userProfile={userProfile}
        />
      )}
    </div>
  );
};

export default ResourcesModule;
