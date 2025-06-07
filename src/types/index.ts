// src/types/index.ts
export interface UserProfile {
  name: string;
  role: string;
  schoolName: string;
  schoolYear: string;
  permissions: string[];
}

export interface Teacher {
  id: string; // Ou number, dependendo do seu backend
  name: string;
  email: string;
  phone?: string;
  subjectsTaught?: string[]; // Ex: ['Matemática', 'Física']
  // Outros campos relevantes: data de nascimento, endereço, qualificações, etc.
}

// Adicione outras interfaces conforme necessário
