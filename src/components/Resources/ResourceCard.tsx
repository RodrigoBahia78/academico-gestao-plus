
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users } from "lucide-react";
import { Resource, ResourceType, ResourceStatus } from "@/types/resources";

interface ResourceCardProps {
  resource: Resource;
  onViewResource: (resource: Resource) => void;
  onReserveResource: () => void;
}

const ResourceCard = ({ resource, onViewResource, onReserveResource }: ResourceCardProps) => {
  const getStatusColor = (status: ResourceStatus) => {
    switch (status) {
      case "disponivel": return "bg-green-100 text-green-800";
      case "ocupado": return "bg-red-100 text-red-800";
      case "manutencao": return "bg-yellow-100 text-yellow-800";
      case "indisponivel": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case "sala": return "🏫";
      case "equipamento": return "💻";
      case "material": return "📦";
      default: return "🏢";
    }
  };

  const getTypeLabel = (type: ResourceType) => {
    const labels = {
      "sala": "Sala",
      "equipamento": "Equipamento", 
      "material": "Material"
    };
    return labels[type] || type;
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewResource(resource)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getTypeIcon(resource.type)}</span>
            <div>
              <h3 className="font-semibold">{resource.name}</h3>
              <p className="text-sm text-gray-500">{resource.code}</p>
            </div>
          </div>
          <Badge className={getStatusColor(resource.status)}>
            {resource.status}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {resource.location}
          </div>
          {resource.capacity && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Capacidade: {resource.capacity} pessoas
            </div>
          )}
          <Badge variant="outline">
            {getTypeLabel(resource.type)}
          </Badge>
        </div>

        <div className="mt-3 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={resource.status !== "disponivel"}
            onClick={(e) => {
              e.stopPropagation();
              onReserveResource();
            }}
          >
            Reservar
          </Button>
          <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
            Agenda
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
