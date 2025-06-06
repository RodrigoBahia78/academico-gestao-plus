
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Eye } from "lucide-react";

interface Occurrence {
  id: string;
  studentName: string;
  class: string;
  type: "disciplinar" | "pedagogica" | "administrativa";
  description: string;
  status: "aberta" | "em_andamento" | "resolvida";
  date: string;
  reporter: string;
}

const mockOccurrences: Occurrence[] = [
  {
    id: "1",
    studentName: "João Silva",
    class: "9º A",
    type: "disciplinar",
    description: "Comportamento inadequado em sala de aula",
    status: "aberta",
    date: "2024-06-05",
    reporter: "Prof. Maria Santos"
  },
  {
    id: "2",
    studentName: "Ana Costa",
    class: "8º B",
    type: "pedagogica",
    description: "Dificuldades de aprendizagem em matemática",
    status: "em_andamento",
    date: "2024-06-04",
    reporter: "Prof. Carlos Lima"
  },
  {
    id: "3",
    studentName: "Pedro Oliveira",
    class: "7º C",
    type: "administrativa",
    description: "Documentação pendente",
    status: "resolvida",
    date: "2024-06-03",
    reporter: "Secretaria"
  }
];

const OccurrencesList = () => {
  const [occurrences] = useState<Occurrence[]>(mockOccurrences);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aberta": return "bg-red-100 text-red-800";
      case "em_andamento": return "bg-yellow-100 text-yellow-800";
      case "resolvida": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "disciplinar": return "bg-red-100 text-red-800";
      case "pedagogica": return "bg-blue-100 text-blue-800";
      case "administrativa": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOccurrences = occurrences.filter(occurrence => {
    const matchesSearch = occurrence.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         occurrence.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || occurrence.status === statusFilter;
    const matchesType = typeFilter === "all" || occurrence.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Controle de Ocorrências</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Ocorrência
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por aluno ou descrição..."
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
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredOccurrences.map((occurrence) => (
          <Card key={occurrence.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{occurrence.studentName}</h3>
                    <Badge variant="secondary">{occurrence.class}</Badge>
                    <Badge className={getTypeColor(occurrence.type)}>
                      {occurrence.type}
                    </Badge>
                    <Badge className={getStatusColor(occurrence.status)}>
                      {occurrence.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{occurrence.description}</p>
                  <div className="text-sm text-gray-500">
                    <span>Registrado por: {occurrence.reporter}</span>
                    <span className="ml-4">Data: {occurrence.date}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OccurrencesList;
