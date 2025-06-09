
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, User, Clock } from "lucide-react";
import { UserProfile } from "@/types/user";
import { Occurrence } from "@/types/occurrences";

interface OccurrenceDetailDialogProps {
  occurrence: Occurrence | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userProfile: UserProfile;
  onOccurrenceUpdated: () => void;
}

const OccurrenceDetailDialog = ({ occurrence, open, onOpenChange, userProfile, onOccurrenceUpdated }: OccurrenceDetailDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedOccurrence, setEditedOccurrence] = useState(occurrence);

  if (!occurrence) return null;

  const canEdit = userProfile?.role === "coordenador_pedagogico" || 
                  userProfile?.role === "diretor" || 
                  (occurrence.reportedBy.id === userProfile?.id && occurrence.status === "aberta");

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar as alterações
    console.log("Salvando ocorrência:", editedOccurrence);
    setIsEditing(false);
    onOccurrenceUpdated();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "baixa": return "bg-blue-100 text-blue-800";
      case "media": return "bg-yellow-100 text-yellow-800";
      case "alta": return "bg-orange-100 text-orange-800";
      case "critica": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aberta": return <Badge variant="destructive">Aberta</Badge>;
      case "em_andamento": return <Badge variant="secondary">Em andamento</Badge>;
      case "resolvida": return <Badge variant="default">Resolvida</Badge>;
      case "arquivada": return <Badge variant="outline" className="bg-gray-200 text-gray-700">Arquivada</Badge>;
      default: return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {isEditing ? "Editar Ocorrência" : "Detalhes da Ocorrência"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Indicadores de tipo e gravidade */}
          <div className="flex items-center gap-2">
            <Badge variant={occurrence.type === "disciplinar" ? "destructive" : occurrence.type === "pedagogica" ? "default" : "outline"}>
              {occurrence.type === "disciplinar" && "Disciplinar"}
              {occurrence.type === "pedagogica" && "Pedagógica"}
              {occurrence.type === "administrativa" && "Administrativa"}
            </Badge>
            <Badge className={getSeverityColor(occurrence.severity)}>
              {occurrence.severity}
            </Badge>
            {getStatusBadge(occurrence.status)}
          </div>

          {/* Detalhes da ocorrência */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={isEditing ? editedOccurrence?.title || "" : occurrence.title}
                onChange={(e) => setEditedOccurrence(prev => prev ? { ...prev, title: e.target.value } : null)}
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={isEditing ? editedOccurrence?.description || "" : occurrence.description}
                onChange={(e) => setEditedOccurrence(prev => prev ? { ...prev, description: e.target.value } : null)}
                disabled={!isEditing}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student">Aluno</Label>
                <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-gray-50">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{occurrence.student.name}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="class">Turma</Label>
                <div className="border rounded-md px-3 py-2 bg-gray-50">
                  {occurrence.student.class}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Data</Label>
                <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-gray-50">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{new Date(occurrence.dateCreated).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="time">Horário</Label>
                <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-gray-50">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{new Date(occurrence.dateCreated).toLocaleTimeString('pt-BR')}</span>
                </div>
              </div>
            </div>

            {isEditing && canEdit && (
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={editedOccurrence?.status || occurrence.status}
                  onChange={(e) => setEditedOccurrence(prev => prev ? { ...prev, status: e.target.value as any } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="aberta">Aberta</option>
                  <option value="em_andamento">Em andamento</option>
                  <option value="resolvida">Resolvida</option>
                  <option value="arquivada">Arquivada</option>
                </select>
              </div>
            )}
          </div>

          {/* Metadados da ocorrência */}
          <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
            <p><strong>Registrado por:</strong> {occurrence.reportedBy.name}</p>
            <p><strong>Criado em:</strong> {new Date(occurrence.dateCreated).toLocaleDateString('pt-BR')}</p>
            {occurrence.assignedTo && (
              <p><strong>Atribuído a:</strong> {occurrence.assignedTo.name}</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
              {canEdit && (
                <Button onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                Salvar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OccurrenceDetailDialog;
