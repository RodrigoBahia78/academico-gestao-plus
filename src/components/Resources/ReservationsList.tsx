
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { ResourceReservation, ResourceStatus } from "@/types/resources";

interface ReservationsListProps {
  reservations: ResourceReservation[];
}

const ReservationsList = ({ reservations }: ReservationsListProps) => {
  const getStatusColor = (status: ResourceStatus) => {
    switch (status) {
      case "disponivel": return "bg-green-100 text-green-800";
      case "ocupado": return "bg-red-100 text-red-800";
      case "manutencao": return "bg-yellow-100 text-yellow-800";
      case "indisponivel": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
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
  );
};

export default ReservationsList;
