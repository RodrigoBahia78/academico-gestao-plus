
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { EventType, EventStatus } from "@/types/events";

interface EventsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: EventStatus | "todos";
  setStatusFilter: (status: EventStatus | "todos") => void;
  typeFilter: EventType | "todos";
  setTypeFilter: (type: EventType | "todos") => void;
  onClearFilters: () => void;
}

const EventsFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  onClearFilters
}: EventsFiltersProps) => {
  return (
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
          <Button variant="outline" onClick={onClearFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsFilters;
