
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Monitor, Users, Clock, Plus, Search, Filter, Calendar } from "lucide-react";
import { UserProfile } from "@/types/user";
import { Resource, ResourceReservation, ResourceType, ResourceStatus } from "@/types/resources";
import CreateResourceDialog from "./CreateResourceDialog";
import CreateReservationDialog from "./CreateReservationDialog";
import ResourceDetailDialog from "./ResourceDetailDialog";
import ReservationCalendar from "./ReservationCalendar";

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

  const getStatusColor = (status: ResourceStatus) => {
    switch (status) {
      case "disponivel": return "bg-green-100 text-green-800";
      case "ocupado": return "bg-red-100 text-red-800";
      case "manutencao": return "bg-yellow-100 text-yellow-800";
      case "indisponivel": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case "sala": return "🏫";
      case "equipamento": return "💻";
      case "material": return "📦";
      default: return "🏢";
    }
  };

  const getTypeLabel = (type: ResourceType) => {
    const labels = {
      "sala": "Sala",
      "equipamento": "Equipamento", 
      "material": "Material"
    };
    return labels[type] || type;
  };

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

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{resourceStats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{resourceStats.salas}</div>
            <div className="text-sm text-gray-600">Salas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{resourceStats.equipamentos}</div>
            <div className="text-sm text-gray-600">Equipamentos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{resourceStats.disponivel}</div>
            <div className="text-sm text-gray-600">Disponível</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{resourceStats.ocupado}</div>
            <div className="text-sm text-gray-600">Ocupado</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{resourceStats.manutencao}</div>
            <div className="text-sm text-gray-600">Manutenção</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recursos" className="w-full">
        <TabsList>
          <TabsTrigger value="recursos">Recursos</TabsTrigger>
          <TabsTrigger value="reservas">Reservas</TabsTrigger>
          <TabsTrigger value="calendario">Calendário</TabsTrigger>
        </TabsList>

        <TabsContent value="recursos" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar recursos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ResourceType | "todos")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                    <SelectItem value="sala">Sala</SelectItem>
                    <SelectItem value="equipamento">Equipamento</SelectItem>
                    <SelectItem value="material">Material</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ResourceStatus | "todos")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="ocupado">Ocupado</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                    <SelectItem value="indisponivel">Indisponível</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Localização..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("todos");
                  setStatusFilter("todos");
                  setLocationFilter("");
                }}>
                  <Filter className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Recursos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewResource(resource)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                      <div>
                        <h3 className="font-semibold">{resource.name}</h3>
                        <p className="text-sm text-gray-500">{resource.code}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(resource.status)}>
                      {resource.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {resource.location}
                    </div>
                    {resource.capacity && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Capacidade: {resource.capacity} pessoas
                      </div>
                    )}
                    <Badge variant="outline">
                      {getTypeLabel(resource.type)}
                    </Badge>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={resource.status !== "disponivel"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCreateReservationDialogOpen(true);
                      }}
                    >
                      Reservar
                    </Button>
                    <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                      Agenda
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredResources.length === 0 && (
              <div className="col-span-full">
                <Card>
                  <CardContent className="p-8 text-center">
                    <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum recurso encontrado</h3>
                    <p className="text-gray-600">
                      {searchTerm || typeFilter !== "todos" || statusFilter !== "todos" || locationFilter
                        ? "Tente ajustar os filtros para encontrar recursos."
                        : "Comece cadastrando suas salas e equipamentos."
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reservas" className="space-y-4">
          <div className="space-y-3">
            {reservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{reservation.title}</h3>
                      <p className="text-gray-600 text-sm">{reservation.description}</p>
                    </div>
                    <Badge className={getStatusColor(reservation.status as ResourceStatus)}>
                      {reservation.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {reservation.startDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {reservation.startTime} - {reservation.endTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {reservation.resource.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {reservation.requestedBy.name}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {reservations.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma reserva encontrada</h3>
                  <p className="text-gray-600">Crie sua primeira reserva de recurso.</p>
                </CardContent>
              </Card>
            )}
          </div>
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
