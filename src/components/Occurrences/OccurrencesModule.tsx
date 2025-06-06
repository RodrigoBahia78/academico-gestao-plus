
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Edit, AlertTriangle, Calendar, User, Filter } from "lucide-react";
import { UserProfile } from "@/types/user";
import { Occurrence, OccurrenceType, OccurrenceStatus, OccurrenceSeverity } from "@/types/occurrences";
import CreateOccurrenceDialog from "./CreateOccurrenceDialog";
import OccurrenceDetailDialog from "./OccurrenceDetailDialog";

interface OccurrencesModuleProps {
  userProfile: UserProfile;
}

// Mock data expandido
const mockOccurrences: Occurrence[] = [
  {
    id: "1",
    student: {
      id: "s1",
      name: "João Silva",
      class: "9º A",
      enrollment: "2024001",
      birthDate: "2010-05-15",
      guardianName: "Maria Silva",
      guardianPhone: "(11) 99999-1111",
      guardianEmail: "maria.silva@email.com"
    },
    type: "disciplinar",
    severity: "media",
    title: "Comportamento inadequado em sala",
    description: "Aluno foi desrespeitoso com a professora durante a aula de matemática, interrompendo constantemente e fazendo comentários inadequados.",
    status: "aberta",
    dateCreated: "2024-06-05T10:30:00Z",
    reportedBy: { id: "p1", name: "Prof. Maria Santos", role: "professor" },
    actions: [
      {
        id: "a1",
        description: "Conversa inicial com o aluno sobre comportamento",
        actionType: "orientacao",
        dateCreated: "2024-06-05T11:00:00Z",
        createdBy: { id: "p1", name: "Prof. Maria Santos" }
      }
    ],
    attachments: [],
    schoolId: "school_001",
    schoolYear: "2024"
  },
  {
    id: "2",
    student: {
      id: "s2",
      name: "Ana Costa",
      class: "8º B",
      enrollment: "2024002",
      birthDate: "2011-03-22",
      guardianName: "Pedro Costa",
      guardianPhone: "(11) 99999-2222"
    },
    type: "pedagogica",
    severity: "alta",
    title: "Dificuldades de aprendizagem",
    description: "Aluna apresenta dificuldades significativas em matemática e português, necessitando acompanhamento especializado.",
    status: "em_andamento",
    dateCreated: "2024-06-04T14:15:00Z",
    reportedBy: { id: "p2", name: "Prof. Carlos Lima", role: "professor" },
    assignedTo: { id: "c1", name: "Coord. Ana Paula", role: "coordenador" },
    actions: [
      {
        id: "a2",
        description: "Encaminhamento para reforço escolar",
        actionType: "encaminhamento",
        dateCreated: "2024-06-04T15:00:00Z",
        createdBy: { id: "c1", name: "Coord. Ana Paula" }
      }
    ],
    attachments: [],
    schoolId: "school_001",
    schoolYear: "2024"
  },
  {
    id: "3",
    student: {
      id: "s3",
      name: "Pedro Oliveira",
      class: "7º C",
      enrollment: "2024003",
      birthDate: "2012-07-10",
      guardianName: "Sandra Oliveira",
      guardianPhone: "(11) 99999-3333"
    },
    type: "administrativa",
    severity: "baixa",
    title: "Documentação pendente",
    description: "Falta de documentos necessários para matrícula: certidão de nascimento atualizada e comprovante de residência.",
    status: "resolvida",
    dateCreated: "2024-06-03T09:00:00Z",
    reportedBy: { id: "s1", name: "Secretaria Escolar", role: "secretario" },
    actions: [
      {
        id: "a3",
        description: "Documentos entregues pelos responsáveis",
        actionType: "observacao",
        dateCreated: "2024-06-05T16:30:00Z",
        createdBy: { id: "s1", name: "Secretaria Escolar" }
      }
    ],
    attachments: [],
    schoolId: "school_001",
    schoolYear: "2024"
  }
];

const OccurrencesModule = ({ userProfile }: OccurrencesModuleProps) => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>(mockOccurrences);
  const [selectedOccurrence, setSelectedOccurrence] = useState<Occurrence | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const getStatusColor = (status: OccurrenceStatus) => {
    switch (status) {
      case "aberta": return "bg-red-100 text-red-800";
      case "em_andamento": return "bg-yellow-100 text-yellow-800";
      case "resolvida": return "bg-green-100 text-green-800";
      case "arquivada": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: OccurrenceType) => {
    switch (type) {
      case "disciplinar": return "bg-red-100 text-red-800";
      case "pedagogica": return "bg-blue-100 text-blue-800";
      case "administrativa": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: OccurrenceSeverity) => {
    switch (severity) {
      case "baixa": return "bg-blue-100 text-blue-800";
      case "media": return "bg-yellow-100 text-yellow-800";
      case "alta": return "bg-orange-100 text-orange-800";
      case "critica": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOccurrences = occurrences.filter(occurrence => {
    const matchesSearch = occurrence.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         occurrence.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         occurrence.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || occurrence.status === statusFilter;
    const matchesType = typeFilter === "all" || occurrence.type === typeFilter;
    const matchesSeverity = severityFilter === "all" || occurrence.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesSeverity;
  });

  const handleViewOccurrence = (occurrence: Occurrence) => {
    setSelectedOccurrence(occurrence);
    setDetailDialogOpen(true);
  };

  const handleOccurrenceCreated = () => {
    // Recarregar lista de ocorrências
    console.log("Ocorrência criada, recarregando lista...");
  };

  const handleOccurrenceUpdated = () => {
    // Recarregar lista de ocorrências
    console.log("Ocorrência atualizada, recarregando lista...");
    setDetailDialogOpen(false);
  };

  // Estatísticas rápidas
  const stats = {
    total: occurrences.length,
    abertas: occurrences.filter(o => o.status === "aberta").length,
    emAndamento: occurrences.filter(o => o.status === "em_andamento").length,
    criticas: occurrences.filter(o => o.severity === "critica").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Controle de Ocorrências</h2>
          <p className="text-gray-600">Gestão de ocorrências disciplinares, pedagógicas e administrativas</p>
        </div>
        <CreateOccurrenceDialog onOccurrenceCreated={handleOccurrenceCreated} />
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Abertas</p>
                <p className="text-2xl font-bold text-red-600">{stats.abertas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.emAndamento}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Críticas</p>
                <p className="text-2xl font-bold text-red-600">{stats.criticas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por aluno, título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="aberta">Aberta</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="resolvida">Resolvida</SelectItem>
                <SelectItem value="arquivada">Arquivada</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="disciplinar">Disciplinar</SelectItem>
                <SelectItem value="pedagogica">Pedagógica</SelectItem>
                <SelectItem value="administrativa">Administrativa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Gravidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Gravidades</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="critica">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Ocorrências */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Ocorrências</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Gravidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Reportado por</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOccurrences.map((occurrence) => (
                <TableRow key={occurrence.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{occurrence.student.name}</div>
                      <div className="text-sm text-gray-500">{occurrence.student.class}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-medium truncate">{occurrence.title}</div>
                      <div className="text-sm text-gray-500 truncate">{occurrence.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(occurrence.type)}>
                      {occurrence.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(occurrence.severity)}>
                      {occurrence.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(occurrence.status)}>
                      {occurrence.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {new Date(occurrence.dateCreated).toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <User className="h-3 w-3" />
                      {occurrence.reportedBy.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewOccurrence(occurrence)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      {(occurrence.reportedBy.id === userProfile.id || 
                        userProfile.permissions.includes("manage_occurrences")) && (
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredOccurrences.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma ocorrência encontrada com os filtros aplicados.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <OccurrenceDetailDialog
        occurrence={selectedOccurrence}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        userProfile={userProfile}
        onOccurrenceUpdated={handleOccurrenceUpdated}
      />
    </div>
  );
};

export default OccurrencesModule;
