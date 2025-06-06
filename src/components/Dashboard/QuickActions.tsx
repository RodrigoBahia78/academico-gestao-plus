
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar, MapPin, Download, Upload } from "lucide-react";
import { UserProfile } from "@/types/user";

interface QuickActionsProps {
  userProfile: UserProfile;
}

const QuickActions = ({ userProfile }: QuickActionsProps) => {
  const actions = [
    {
      title: "Nova Ocorrência",
      description: "Registrar nova ocorrência disciplinar ou pedagógica",
      icon: Plus,
      color: "bg-red-600 hover:bg-red-700",
      permission: "manage_occurrences"
    },
    {
      title: "Agendar Evento",
      description: "Criar novo evento no calendário acadêmico", 
      icon: Calendar,
      color: "bg-blue-600 hover:bg-blue-700",
      permission: "manage_events"
    },
    {
      title: "Reservar Recurso",
      description: "Solicitar reserva de sala ou equipamento",
      icon: MapPin,
      color: "bg-green-600 hover:bg-green-700", 
      permission: "manage_resources"
    },
    {
      title: "Gerar Relatório",
      description: "Exportar dados para análise externa",
      icon: Download,
      color: "bg-purple-600 hover:bg-purple-700",
      permission: "view_reports"
    },
    {
      title: "Importar Dados",
      description: "Importar lista de alunos ou dados do sistema oficial",
      icon: Upload,
      color: "bg-orange-600 hover:bg-orange-700",
      permission: "manage_users"
    },
    {
      title: "Relatório Mensal",
      description: "Visualizar resumo executivo do mês",
      icon: FileText,
      color: "bg-gray-600 hover:bg-gray-700",
      permission: "view_reports"
    },
  ];

  const hasPermission = (permission: string) => {
    return userProfile.permissions.includes(permission);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {actions.filter(action => hasPermission(action.permission)).map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className={`${action.color} text-white border-0 h-auto p-4 flex flex-col items-start gap-2 hover:shadow-md transition-all`}
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{action.title}</span>
                </div>
                <p className="text-xs text-white/80 text-left">
                  {action.description}
                </p>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
