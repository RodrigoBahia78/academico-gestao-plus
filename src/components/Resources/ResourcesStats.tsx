
import { Card, CardContent } from "@/components/ui/card";

interface ResourcesStatsProps {
  total: number;
  salas: number;
  equipamentos: number;
  disponivel: number;
  ocupado: number;
  manutencao: number;
}

const ResourcesStats = ({ 
  total, 
  salas, 
  equipamentos, 
  disponivel, 
  ocupado, 
  manutencao 
}: ResourcesStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{salas}</div>
          <div className="text-sm text-gray-600">Salas</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{equipamentos}</div>
          <div className="text-sm text-gray-600">Equipamentos</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{disponivel}</div>
          <div className="text-sm text-gray-600">Disponível</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{ocupado}</div>
          <div className="text-sm text-gray-600">Ocupado</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{manutencao}</div>
          <div className="text-sm text-gray-600">Manutenção</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcesStats;
