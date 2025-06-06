
export type UserRole = "coordenador" | "secretario" | "inspetor" | "diretor";

export interface School {
  id: string;
  name: string;
  code: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  school: School;
  schoolYear: string;
  permissions: string[];
}

export interface UserPermissions {
  view_dashboard: boolean;
  manage_occurrences: boolean;
  manage_events: boolean;
  manage_resources: boolean;
  view_reports: boolean;
  manage_users: boolean;
}
