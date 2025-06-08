
export type UserRole = "diretor" | "coordenador_pedagogico" | "professor" | "inspetor" | "tecnico_administrativo" | "leitor";

export interface School {
  id: string;
  name: string;
  code: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: UserRole;
  school: School;
  school_id: string;
  schoolYear: string;
  active: boolean;
  permissions: string[];
  created_at?: string;
  updated_at?: string;
}

export interface UserPermissions {
  view_dashboard: boolean;
  manage_occurrences: boolean;
  manage_events: boolean;
  manage_resources: boolean;
  view_reports: boolean;
  manage_users: boolean;
  view_calendar: boolean;
  view_students: boolean;
}
