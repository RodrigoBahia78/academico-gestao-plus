
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { ResourceReservation } from "@/types/resources";

interface ReservationCalendarProps {
  reservations: ResourceReservation[];
}

const ReservationCalendar = ({ reservations }: ReservationCalendarProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "solicitada": return "bg-yellow-100 text-yellow-800";
      case "aprovada": return "bg-green-100 text-green-800";
      case "rejeitada": return "bg-red-100 text-red-800";
      case "cancelada": return "bg-gray-100 text-gray-800";
      case "em_uso": return "bg-blue-100 text-blue-800";
      case "finalizada": return "bg-emerald-100 text-emerald-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const groupReservationsByDate = (reservations: ResourceReservation[]) => {
    const grouped: Record<string, ResourceReservation[]> = {};
    
    reservations.forEach(reservation => {
      const date = reservation.startDate;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(reservation);
    });

    // Ordenar por data
    const sortedDates = Object.keys(grouped).sort();
    return sortedDates.map(date => ({
      date,
      reservations: grouped[date].sort((a, b) => a.startTime.localeCompare(b.startTime))
    }));
  };

  const groupedReservations = groupReservationsByDate(reservations);

  return (
    <div className="space-y-4">
      {groupedReservations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma reserva agendada</h3>
            <p className="text-gray-600">As reservas aparecerão aqui quando forem criadas.</p>
          </CardContent>
        </Card>
      ) : (
        groupedReservations.map(({ date, reservations }) => (
          <Card key={date}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{reservation.title}</h4>
                        <p className="text-sm text-gray-600">{reservation.description}</p>
                      </div>
                      <Badge className={getStatusColor(reservation.status)}>
                        {reservation.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
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
                      {reservation.participants && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {reservation.participants} pessoas
                        </div>
                      )}
                    </div>

                    {reservation.purpose && (
                      <div className="mt-2">
                        <span className="text-xs font-medium text-gray-700">Finalidade: </span>
                        <span className="text-xs text-gray-600 capitalize">{reservation.purpose}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ReservationCalendar;
