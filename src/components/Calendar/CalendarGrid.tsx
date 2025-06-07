
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarItem, CalendarView } from "@/types/calendar";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addDays,
  startOfDay,
  endOfDay
} from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarGridProps {
  view: CalendarView;
  items: CalendarItem[];
  onItemClick: (item: CalendarItem) => void;
  getTypeColor: (type: CalendarItem['type']) => string;
  getGravityColor: (gravity?: string) => string;
}

const CalendarGrid = ({ view, items, onItemClick, getTypeColor, getGravityColor }: CalendarGridProps) => {
  const renderMonthView = () => {
    const monthStart = startOfMonth(view.date);
    const monthEnd = endOfMonth(view.date);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    
    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    
    return (
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1">
            {/* Cabeçalho dos dias da semana */}
            {weekDays.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
                {day}
              </div>
            ))}
            
            {/* Dias do mês */}
            {days.map((day) => {
              const dayItems = items.filter(item => isSameDay(new Date(item.date), day));
              const isCurrentMonth = isSameMonth(day, view.date);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[120px] p-1 border border-gray-200 ${
                    !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
                  } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className={`text-xs p-1 rounded cursor-pointer hover:shadow-sm transition-shadow ${
                          item.type === 'ocorrencia' && item.metadata?.gravity 
                            ? getGravityColor(item.metadata.gravity)
                            : getTypeColor(item.type)
                        }`}
                        onClick={() => onItemClick(item)}
                        title={item.title}
                      >
                        <div className="truncate font-medium">{item.title}</div>
                        {item.startTime && (
                          <div className="text-xs opacity-75">{item.startTime}</div>
                        )}
                      </div>
                    ))}
                    {dayItems.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayItems.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(view.date);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    
    return (
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day) => {
              const dayItems = items.filter(item => isSameDay(new Date(item.date), day));
              const isToday = isSameDay(day, new Date());
              
              return (
                <div key={day.toISOString()} className="space-y-2">
                  <div className={`text-center p-2 rounded ${isToday ? 'bg-blue-100 text-blue-800' : 'bg-gray-50'}`}>
                    <div className="text-sm font-medium">
                      {format(day, 'EEE', { locale: ptBR })}
                    </div>
                    <div className="text-lg font-bold">
                      {format(day, 'd')}
                    </div>
                  </div>
                  
                  <div className="space-y-2 min-h-[300px]">
                    {dayItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-2 rounded cursor-pointer hover:shadow-md transition-shadow ${
                          item.type === 'ocorrencia' && item.metadata?.gravity 
                            ? getGravityColor(item.metadata.gravity)
                            : getTypeColor(item.type)
                        }`}
                        onClick={() => onItemClick(item)}
                      >
                        <div className="font-medium text-sm truncate">{item.title}</div>
                        {item.startTime && (
                          <div className="text-xs opacity-75">{item.startTime} - {item.endTime}</div>
                        )}
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderDayView = () => {
    const dayItems = items.filter(item => isSameDay(new Date(item.date), view.date));
    const isToday = isSameDay(view.date, new Date());
    
    return (
      <Card>
        <CardContent className="p-6">
          <div className={`text-center p-4 rounded-lg mb-6 ${isToday ? 'bg-blue-100' : 'bg-gray-50'}`}>
            <h3 className="text-xl font-bold">
              {format(view.date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h3>
          </div>
          
          <div className="space-y-4">
            {dayItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-lg">Nenhuma atividade agendada</div>
                <div className="text-sm">Este dia está livre de compromissos</div>
              </div>
            ) : (
              dayItems
                .sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'))
                .map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow border-l-4 ${
                      item.type === 'ocorrencia' && item.metadata?.gravity 
                        ? getGravityColor(item.metadata.gravity)
                        : getTypeColor(item.type)
                    }`}
                    onClick={() => onItemClick(item)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg">{item.title}</h4>
                      <Badge variant="outline">
                        {item.type}
                      </Badge>
                    </div>
                    
                    {item.description && (
                      <p className="text-gray-600 mb-2">{item.description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      {item.startTime && (
                        <div>
                          <span className="font-medium">Horário:</span> {item.startTime} - {item.endTime}
                        </div>
                      )}
                      {item.location && (
                        <div>
                          <span className="font-medium">Local:</span> {item.location}
                        </div>
                      )}
                      {item.participants && (
                        <div>
                          <span className="font-medium">Participantes:</span> {item.participants}
                        </div>
                      )}
                      {item.status && (
                        <div>
                          <span className="font-medium">Status:</span> {item.status}
                        </div>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  switch (view.type) {
    case "week":
      return renderWeekView();
    case "day":
      return renderDayView();
    default:
      return renderMonthView();
  }
};

export default CalendarGrid;
