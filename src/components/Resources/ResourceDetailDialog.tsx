
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Settings, Calendar, Clock } from "lucide-react";
import { Resource, ResourceStatus } from "@/types/resources";
import { UserProfile } from "@/types/user";

interface ResourceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: Resource;
  userProfile: UserProfile;
}

const ResourceDetailDialog = ({ open, onOpenChange, resource, userProfile }: ResourceDetailDialogProps) => {
  const getStatusColor = (status: ResourceStatus) => {
    switch (status) {
      case "disponivel": return "bg-green-100 text-green-800";
      case "ocupado": return "bg-red-100 text-red-800";
      case "manutencao": return "bg-yellow-100 text-yellow-800";
      case "indisponivel": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sala": return "🏫";
      case "equipamento": return "💻";
      case "material": return "📦";
      default: return "🏢";
    }
  };

  const renderSpecifications = () => {
    if (!resource.specifications || Object.keys(resource.specifications).length === 0) {
      return <p className="text-gray-500">Nenhuma especificação cadastrada</p>;
    }

    return (
      <div className="space-y-2">
        {Object.entries(resource.specifications).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <span className="text-sm font-medium capitalize">
              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
            </span>
            <span className="text-sm text-gray-600">
              {typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{getTypeIcon(resource.type)}</span>
            {resource.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600">{resource.description}</p>
              <p className="text-sm text-gray-500 mt-1">Código: {resource.code}</p>
            </div>
            <Badge className={getStatusColor(resource.status)}>
              {resource.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Localização:</span>
                  <span className="text-gray-600">{resource.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tipo:</span>
                  <span className="text-gray-600 capitalize">{resource.type}</span>
                </div>
                {resource.capacity && (
                  <div className="flex justify-between">
                    <span className="font-medium">Capacidade:</span>
                    <span className="text-gray-600 flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {resource.capacity} pessoas
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge className={getStatusColor(resource.status)}>
                    {resource.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Especificações
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderSpecifications()}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximas Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Nenhuma reserva encontrada</p>
              {/* Aqui seria implementada a lista de reservas do recurso */}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Criado em: {new Date(resource.createdAt).toLocaleDateString('pt-BR')}
              </p>
              {resource.updatedAt && (
                <p className="text-sm text-gray-500">
                  Atualizado em: {new Date(resource.updatedAt).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Ver Agenda
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={resource.status !== "disponivel"}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Reservar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceDetailDialog;
