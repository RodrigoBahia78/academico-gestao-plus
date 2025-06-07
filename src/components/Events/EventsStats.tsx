
import { Card, CardContent } from "@/components/ui/card";

interface EventsStatsProps {
  total: number;
  planejados: number;
  confirmados: number;
  realizados: number;
}

const EventsStats = ({ total, planejados, confirmados, realizados }: EventsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{total}</div>
          <div className="text-sm text-gray-600">Total de Eventos</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{planejados}</div>
          <div className="text-sm text-gray-600">Planejados</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{confirmados}</div>
          <div className="text-sm text-gray-600">Confirmados</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{realizados}</div>
          <div className="text-sm text-gray-600">Realizados</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsStats;
