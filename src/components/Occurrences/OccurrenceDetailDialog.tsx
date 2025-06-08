import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, User, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface OccurrenceDetailDialogProps {
  occurrence: {
    id: string;
    title: string;
    description: string;
    type: "disciplinar" | "pedagogica" | "informativa";
    severity: "leve" | "moderada" | "grave";
    status: "em_analise" | "em_andamento" | "resolvida" | "arquivada";
    student: string;
    class: string;
    date: string;
    time: string;
    responsible: string;
    createdAt: string;
    actions?: string[];
    resolution?: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OccurrenceDetailDialog = ({ occurrence, open, onOpenChange }: OccurrenceDetailDialogProps) => {
  const { userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedOccurrence, setEditedOccurrence] = useState(occurrence);

  const canEdit = userProfile?.role === "coordenador_pedagogico" || 
                  userProfile?.role === "diretor" || 
                  (occurrence.responsible === userProfile?.name && occurrence.status === "em_analise");

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar as alterações
    console.log("Salvando ocorrência:", editedOccurrence);
    setIsEditing(false);
    // Após salvar no backend, você atualizaria a ocorrência no estado pai
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "leve": return "bg-yellow-500";
      case "moderada": return "bg-orange-500";
      case "grave": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "em_analise": return <Badge variant="outline">Em análise</Badge>;
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
          {/* Occurrence type and severity indicators */}
          <div className="flex items-center gap-2">
            <Badge variant={occurrence.type === "disciplinar" ? "destructive" : occurrence.type === "pedagogica" ? "default" : "outline"}>
              {occurrence.type === "disciplinar" && "Disciplinar"}
              {occurrence.type === "pedagogica" && "Pedagógica"}
              {occurrence.type === "informativa" && "Informativa"}
            </Badge>
            <div className={`px-2 py-0.5 rounded-full text-xs text-white ${getSeverityColor(occurrence.severity)}`}>
              {occurrence.severity === "leve" && "Leve"}
              {occurrence.severity === "moderada" && "Moderada"}
              {occurrence.severity === "grave" && "Grave"}
            </div>
            {getStatusBadge(occurrence.status)}
          </div>

          {/* Occurrence details form/display */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={editedOccurrence.title}
                onChange={(e) => setEditedOccurrence(prev => ({ ...prev, title: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={editedOccurrence.description}
                onChange={(e) => setEditedOccurrence(prev => ({ ...prev, description: e.target.value }))}
                disabled={!isEditing}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student">Aluno</Label>
                <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-gray-50">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{occurrence.student}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="class">Turma</Label>
                <div className="border rounded-md px-3 py-2 bg-gray-50">
                  {occurrence.class}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={editedOccurrence.date}
                  onChange={(e) => setEditedOccurrence(prev => ({ ...prev, date: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="time">Horário</Label>
                <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-gray-50">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{occurrence.time}</span>
                </div>
              </div>
            </div>

            {isEditing && canEdit && (
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={editedOccurrence.status}
                  onChange={(e) => setEditedOccurrence(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="em_analise">Em análise</option>
                  <option value="em_andamento">Em andamento</option>
                  <option value="resolvida">Resolvida</option>
                  <option value="arquivada">Arquivada</option>
                </select>
              </div>
            )}

            {(occurrence.status === "em_andamento" || occurrence.status === "resolvida") && (
              <div>
                <Label htmlFor="actions">Ações tomadas</Label>
                <Textarea
                  id="actions"
                  value={editedOccurrence.actions?.join("\n") || ""}
                  onChange={(e) => setEditedOccurrence(prev => ({ ...prev, actions: e.target.value.split("\n") }))}
                  disabled={!isEditing}
                  rows={2}
                  placeholder="Lista de ações tomadas, uma por linha"
                />
              </div>
            )}

            {occurrence.status === "resolvida" && (
              <div>
                <Label htmlFor="resolution">Resolução</Label>
                <Textarea
                  id="resolution"
                  value={editedOccurrence.resolution || ""}
                  onChange={(e) => setEditedOccurrence(prev => ({ ...prev, resolution: e.target.value }))}
                  disabled={!isEditing}
                  rows={2}
                />
              </div>
            )}
          </div>

          {/* Occurrence metadata */}
          <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
            <p><strong>Registrado por:</strong> {occurrence.responsible}</p>
            <p><strong>Criado em:</strong> {new Date(occurrence.createdAt).toLocaleDateString('pt-BR')}</p>
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
