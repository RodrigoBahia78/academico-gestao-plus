
export type ResourceType = "sala" | "equipamento" | "material";
export type ResourceStatus = "disponivel" | "ocupado" | "manutencao" | "indisponivel";

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  code: string;
  description?: string;
  capacity?: number;
  location: string;
  status: ResourceStatus;
  specifications: Record<string, any>;
  schoolId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ResourceReservation {
  id: string;
  resource: Resource;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  requestedBy: {
    id: string;
    name: string;
    role: string;
  };
  approvedBy?: {
    id: string;
    name: string;
    role: string;
  };
  status: "solicitada" | "aprovada" | "rejeitada" | "cancelada" | "em_uso" | "finalizada";
  purpose: string;
  participants?: number;
  notes?: string;
  schoolId: string;
  schoolYear: string;
  createdAt: string;
  updatedAt?: string;
}
