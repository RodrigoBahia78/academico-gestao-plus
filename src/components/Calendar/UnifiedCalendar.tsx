
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react";
import { CalendarItem, CalendarFilter, CalendarView } from "@/types/calendar";
import { UserProfile } from "@/types/user";
import CalendarGrid from "./CalendarGrid";
import CalendarItemModal from "./CalendarItemModal";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, addWeeks, subWeeks, startOfWeek, endOfWeek, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UnifiedCalendarProps {
  userProfile: UserProfile;
}

// Mock data - em produção viriam das APIs dos respectivos módulos
const mockCalendarItems: CalendarItem[] = [
  {
    id: "occ_1",
    title: "Ocorrência Disciplinar - João Silva",
    description: "Uso indevido de celular em sala de aula",
    date: "2024-06-08",
    type: "ocorrencia",
    category: "disciplinar",
    status: "em_analise",
    schoolId: "school_001",
    userId: "user_1",
    metadata: { gravity: "leve", studentName: "João Silva", class: "9º A" }
  },
  {
    id: "event_1",
    title: "Conselho de Classe - 9º Ano",
    description: "Avaliação trimestral dos alunos do 9º ano",
    date: "2024-06-08",
    startTime: "14:00",
    endTime: "16:00",
    type: "evento",
    category: "conselho",
    status: "confirmado",
    location: "Sala de Reuniões",
    participants: 12,
    schoolId: "school_001",
    userId: "user_1"
  },
  {
    id: "res_1",
    title: "Reserva Laboratório de Informática",
    description: "Aula prática de programação",
    date: "2024-06-08",
    startTime: "14:00",
    endTime: "16:00",
    type: "reserva",
    status: "aprovada",
    location: "Laboratório de Informática",
    participants: 25,
    schoolId: "school_001",
    userId: "user_2",
    metadata: { resourceName: "Laboratório de Informática", purpose: "aula" }
  },
  {
    id: "event_2",
    title: "Feira de Ciências",
    description: "Apresentação dos projetos científicos",
    date: "2024-06-15",
    startTime: "08:00",
    endTime: "17:00",
    type: "evento",
    category: "feira",
    status: "planejado",
    location: "Pátio Principal",
    participants: 200,
    schoolId: "school_001",
    userId: "user_1"
  }
];

const UnifiedCalendar = ({ userProfile }: UnifiedCalendarProps) => {
  const [view, setView] = useState<CalendarView>({ type: "month", date: new Date() });
  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<CalendarFilter>({
    types: ["ocorrencia", "evento", "reserva"],
    schoolId: userProfile.school.id
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    return mockCalendarItems.filter(item => {
      if (!filter.types.includes(item.type)) return false;
      if (filter.schoolId && item.schoolId !== filter.schoolId) return false;
      if (filter.userId && item.userId !== filter.userId) return false;
      return true;
    });
  }, [filter]);

  const getTypeColor = (type: CalendarItem['type']) => {
    switch (type) {
      case "evento": return "bg-blue-100 text-blue-800 border-blue-200";
      case "reserva": return "bg-green-100 text-green-800 border-green-200";
      case "ocorrencia": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getGravityColor = (gravity?: string) => {
    switch (gravity) {
      case "grave": return "bg-red-100 text-red-800 border-red-200";
      case "moderada": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "leve": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const navigateView = (direction: "prev" | "next") => {
    const { type, date } = view;
    let newDate: Date;

    switch (type) {
      case "month":
        newDate = direction === "next" ? addMonths(date, 1) : subMonths(date, 1);
        break;
      case "week":
        newDate = direction === "next" ? addWeeks(date, 1) : subWeeks(date, 1);
        break;
      case "day":
        newDate = direction === "next" ? addDays(date, 1) : subDays(date, 1);
        break;
      default:
        newDate = date;
    }

    setView({ ...view, date: newDate });
  };

  const handleItemClick = (item: CalendarItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleTypeFilterChange = (type: CalendarItem['type'], checked: boolean) => {
    const newTypes = checked 
      ? [...filter.types, type]
      : filter.types.filter(t => t !== type);
    
    setFilter({ ...filter, types: newTypes });
  };

  const formatViewTitle = () => {
    const { type, date } = view;
    switch (type) {
      case "month":
        return format(date, "MMMM yyyy", { locale: ptBR });
      case "week":
        const weekStart = startOfWeek(date);
        const weekEnd = endOfWeek(date);
        return `${format(weekStart, "dd MMM", { locale: ptBR })} - ${format(weekEnd, "dd MMM yyyy", { locale: ptBR })}`;
      case "day":
        return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendário Unificado</h2>
          <p className="text-gray-600 mt-1">
            Visão consolidada de ocorrências, eventos e reservas - {userProfile.school.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Item
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Tipos de Atividade</label>
                <div className="space-y-2">
                  {[
                    { type: "evento" as const, label: "Eventos", color: "text-blue-600" },
                    { type: "reserva" as const, label: "Reservas", color: "text-green-600" },
                    { type: "ocorrencia" as const, label: "Ocorrências", color: "text-red-600" }
                  ].map(({ type, label, color }) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={filter.types.includes(type)}
                        onCheckedChange={(checked) => handleTypeFilterChange(type, checked as boolean)}
                      />
                      <label htmlFor={type} className={`text-sm cursor-pointer ${color}`}>
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controles de Navegação */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateView("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-semibold min-w-[200px] text-center">
                  {formatViewTitle()}
                </h3>
                <Button variant="outline" size="sm" onClick={() => navigateView("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => setView({ type: "month", date: new Date() })}>
                Hoje
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Select value={view.type} onValueChange={(value) => setView({ ...view, type: value as CalendarView['type'] })}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Dia</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="month">Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legenda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium">Legenda:</span>
            <Badge className="bg-blue-100 text-blue-800">Eventos</Badge>
            <Badge className="bg-green-100 text-green-800">Reservas</Badge>
            <Badge className="bg-red-100 text-red-800">Ocorrências</Badge>
            <div className="flex gap-2 ml-4">
              <span className="text-sm text-gray-600">Gravidade:</span>
              <Badge className="bg-orange-100 text-orange-800">Leve</Badge>
              <Badge className="bg-yellow-100 text-yellow-800">Moderada</Badge>
              <Badge className="bg-red-100 text-red-800">Grave</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid do Calendário */}
      <CalendarGrid
        view={view}
        items={filteredItems}
        onItemClick={handleItemClick}
        getTypeColor={getTypeColor}
        getGravityColor={getGravityColor}
      />

      {/* Modal de Detalhes */}
      {selectedItem && (
        <CalendarItemModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          item={selectedItem}
          userProfile={userProfile}
        />
      )}
    </div>
  );
};

export default UnifiedCalendar;
