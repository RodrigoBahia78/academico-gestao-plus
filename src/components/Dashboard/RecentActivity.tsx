
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, MapPin, User, Clock } from "lucide-react";

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "occurrence",
      title: "Nova ocorrência registrada",
      description: "João Silva - 9º A - Comportamento inadequado",
      time: "há 2 horas",
      user: "Prof. Maria Santos",
      severity: "media",
      icon: AlertTriangle
    },
    {
      id: 2,
      type: "event",
      title: "Evento confirmado",
      description: "Conselho de Classe 9º Ano - 15/06 14:00",
      time: "há 4 horas", 
      user: "Maria Coordenadora",
      severity: "info",
      icon: Calendar
    },
    {
      id: 3,
      type: "resource",
      title: "Reserva aprovada",
      description: "Auditório - Feira de Ciências",
      time: "há 1 dia",
      user: "Carlos Diretor",
      severity: "success",
      icon: MapPin
    },
    {
      id: 4,
      type: "occurrence",
      title: "Ocorrência resolvida",
      description: "Ana Costa - 8º B - Dificuldades matemática",
      time: "há 2 dias",
      user: "Ana Orientadora",
      severity: "success",
      icon: User
    },
    {
      id: 5,
      type: "event",
      title: "Reunião adiada",
      description: "Reunião Pedagógica - Reagendada para 20/06",
      time: "há 3 dias",
      user: "Maria Coordenadora", 
      severity: "warning",
      icon: Clock
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "alta": return "bg-red-100 text-red-800";
      case "media": return "bg-yellow-100 text-yellow-800";
      case "baixa": return "bg-blue-100 text-blue-800";
      case "success": return "bg-green-100 text-green-800";
      case "warning": return "bg-orange-100 text-orange-800";
      case "info": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Icon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                    <Badge className={getSeverityColor(activity.severity)}>
                      {activity.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
