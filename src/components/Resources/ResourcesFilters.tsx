
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { ResourceType, ResourceStatus } from "@/types/resources";

interface ResourcesFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  typeFilter: ResourceType | "todos";
  setTypeFilter: (value: ResourceType | "todos") => void;
  statusFilter: ResourceStatus | "todos";
  setStatusFilter: (value: ResourceStatus | "todos") => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  onClearFilters: () => void;
}

const ResourcesFilters = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  locationFilter,
  setLocationFilter,
  onClearFilters
}: ResourcesFiltersProps) => {
  return (
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
          <Button variant="outline" onClick={onClearFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourcesFilters;
