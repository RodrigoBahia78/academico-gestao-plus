
export type OccurrenceType = "disciplinar" | "pedagogica" | "administrativa";
export type OccurrenceStatus = "aberta" | "em_andamento" | "resolvida" | "arquivada";
export type OccurrenceSeverity = "baixa" | "media" | "alta" | "critica";

export interface Student {
  id: string;
  name: string;
  class: string;
  enrollment: string;
  birthDate: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
}

export interface Occurrence {
  id: string;
  student: Student;
  type: OccurrenceType;
  severity: OccurrenceSeverity;
  title: string;
  description: string;
  status: OccurrenceStatus;
  dateCreated: string;
  dateUpdated?: string;
  reportedBy: {
    id: string;
    name: string;
    role: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    role: string;
  };
  actions: OccurrenceAction[];
  attachments: OccurrenceAttachment[];
  schoolId: string;
  schoolYear: string;
}

export interface OccurrenceAction {
  id: string;
  description: string;
  actionType: "observacao" | "orientacao" | "suspen" | "transferencia" | "encaminhamento";
  dateCreated: string;
  createdBy: {
    id: string;
    name: string;
  };
}

export interface OccurrenceAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
}
