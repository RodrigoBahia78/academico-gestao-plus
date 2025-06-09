
export type EventType = "reuniao" | "conselho" | "feira" | "prova_especial" | "formatura" | "palestra" | "capacitacao";
export type EventStatus = "planejado" | "confirmado" | "em_andamento" | "realizado" | "cancelado" | "adiado";
export type EventRecurrence = "unico" | "semanal" | "mensal" | "bimestral" | "trimestral" | "semestral" | "anual";

export interface EventResource {
  id: string;
  name: string;
  type: "sala" | "equipamento" | "material";
  quantity?: number;
}

export interface EventParticipant {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "convidado" | "confirmado" | "ausente" | "presente";
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  date: string; // Data do evento
  time: string; // Horário do evento
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  organizer: {
    id: string;
    name: string;
  };
  responsible: {
    id: string;
    name: string;
  };
  participants: EventParticipant[];
  resources: EventResource[];
  recurrence: EventRecurrence;
  notes?: string;
  schoolId: string;
  schoolYear: string;
  createdAt: string;
  updatedAt?: string;
}
