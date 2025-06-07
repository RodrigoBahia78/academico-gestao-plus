
import { Card, CardContent } from "@/components/ui/card";
import { Monitor } from "lucide-react";
import { Resource } from "@/types/resources";
import ResourceCard from "./ResourceCard";

interface ResourcesListProps {
  resources: Resource[];
  searchTerm: string;
  typeFilter: string;
  statusFilter: string;
  locationFilter: string;
  onViewResource: (resource: Resource) => void;
  onReserveResource: () => void;
}

const ResourcesList = ({ 
  resources, 
  searchTerm, 
  typeFilter, 
  statusFilter, 
  locationFilter,
  onViewResource,
  onReserveResource 
}: ResourcesListProps) => {
  const hasFilters = searchTerm || typeFilter !== "todos" || statusFilter !== "todos" || locationFilter;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map((resource) => (
        <ResourceCard 
          key={resource.id} 
          resource={resource}
          onViewResource={onViewResource}
          onReserveResource={onReserveResource}
        />
      ))}

      {resources.length === 0 && (
        <div className="col-span-full">
          <Card>
            <CardContent className="p-8 text-center">
              <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum recurso encontrado</h3>
              <p className="text-gray-600">
                {hasFilters
                  ? "Tente ajustar os filtros para encontrar recursos."
                  : "Comece cadastrando suas salas e equipamentos."
                }
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResourcesList;
