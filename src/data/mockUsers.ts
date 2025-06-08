
import { UserProfile } from '@/types/user';

export const mockUsers: UserProfile[] = [
  {
    id: "1",
    user_id: "mock-diretor-001",
    name: "João Silva Santos",
    email: "joao.diretor@escola.edu.br",
    role: "diretor",
    school: {
      id: "school_001",
      name: "Escola Estadual Dom Pedro II",
      code: "31001234"
    },
    school_id: "school_001",
    schoolYear: "2024",
    active: true,
    permissions: [
      "view_dashboard",
      "manage_occurrences", 
      "manage_events",
      "manage_resources",
      "view_reports",
      "view_calendar",
      "view_students",
      "manage_users",
      "manage_user_accounts",
      "access_all_school_data",
      "approve_resource_reservations",
      "generate_management_reports",
      "resolve_internal_conflicts"
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    user_id: "mock-coordenador-001",
    name: "Maria Silva Coordenadora",
    email: "maria.coordenadora@escola.edu.br",
    role: "coordenador_pedagogico",
    school: {
      id: "school_001",
      name: "Escola Estadual Dom Pedro II",
      code: "31001234"
    },
    school_id: "school_001",
    schoolYear: "2024",
    active: true,
    permissions: [
      "view_dashboard",
      "manage_occurrences", 
      "manage_events",
      "manage_resources",
      "view_reports",
      "view_calendar",
      "view_students",
      "manage_pedagogical_calendar",
      "approve_pedagogical_events",
      "assign_educational_staff",
      "validate_occurrences",
      "communicate_between_departments"
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    user_id: "mock-professor-001",
    name: "Carlos Professor Lima",
    email: "carlos.professor@escola.edu.br",
    role: "professor",
    school: {
      id: "school_001",
      name: "Escola Estadual Dom Pedro II",
      code: "31001234"
    },
    school_id: "school_001",
    schoolYear: "2024",
    active: true,
    permissions: [
      "view_dashboard",
      "manage_occurrences",
      "view_calendar",
      "view_students",
      "register_simple_occurrences",
      "view_class_schedule",
      "request_classroom_resources",
      "view_own_events_and_records"
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    user_id: "mock-inspetor-001",
    name: "Ana Inspetora Santos",
    email: "ana.inspetora@escola.edu.br",
    role: "inspetor",
    school: {
      id: "school_001",
      name: "Escola Estadual Dom Pedro II",
      code: "31001234"
    },
    school_id: "school_001",
    schoolYear: "2024",
    active: true,
    permissions: [
      "view_dashboard",
      "manage_occurrences",
      "view_calendar",
      "view_students",
      "log_disciplinary_occurrences",
      "view_supervision_agenda",
      "request_supervision_spaces",
      "assist_in_conflict_resolution"
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "5",
    user_id: "mock-tecnico-001",
    name: "Pedro Técnico Silva",
    email: "pedro.tecnico@escola.edu.br",
    role: "tecnico_administrativo",
    school: {
      id: "school_001",
      name: "Escola Estadual Dom Pedro II",
      code: "31001234"
    },
    school_id: "school_001",
    schoolYear: "2024",
    active: true,
    permissions: [
      "view_dashboard",
      "view_reports",
      "view_calendar",
      "manage_administrative_calendar",
      "generate_legal_reports",
      "archive_official_documents",
      "support_school_directors"
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Função para selecionar um usuário específico para desenvolvimento
export const getCurrentMockUser = (userType: 'diretor' | 'coordenador' | 'professor' | 'inspetor' | 'tecnico' = 'coordenador'): UserProfile => {
  const userMap = {
    diretor: mockUsers[0],
    coordenador: mockUsers[1], 
    professor: mockUsers[2],
    inspetor: mockUsers[3],
    tecnico: mockUsers[4]
  };
  
  return userMap[userType];
};
