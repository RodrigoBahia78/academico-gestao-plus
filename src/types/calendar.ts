
export interface CalendarItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: "ocorrencia" | "evento" | "reserva";
  category?: string;
  status?: string;
  location?: string;
  participants?: number;
  schoolId: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface CalendarFilter {
  types: ("ocorrencia" | "evento" | "reserva")[];
  schoolId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
}

export interface CalendarView {
  type: "month" | "week" | "day";
  date: Date;
}
