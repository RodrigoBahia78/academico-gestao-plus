
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, Clock, AlertTriangle, MessageSquare, Plus } from "lucide-react";
import { Occurrence, OccurrenceStatus } from "@/types/occurrences";
import { UserProfile } from "@/types/user";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface OccurrenceDetailDialogProps {
  occurrence: Occurrence | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userProfile: UserProfile;
  onOccurrenceUpdated: () => void;
}

const OccurrenceDetailDialog = ({ 
  occurrence, 
  open, 
  onOpenChange, 
  userProfile,
  onOccurrenceUpdated 
}: OccurrenceDetailDialogProps) => {
  const [newAction, setNewAction] = useState("");
  const [newStatus, setNewStatus] = useState<OccurrenceStatus | "">("");
  const { toast } = useToast();

  if (!occurrence) return null;

  const canEdit = occurrence.status === "aberta" && 
    (occurrence.reportedBy.id === userProfile.id || 
     userProfile.permissions.includes("manage_occurrences"));

  const canChangeStatus = userProfile.role === "coordenador" || userProfile.role === "diretor";

  const getStatusColor = (status: OccurrenceStatus) => {
    switch (status) {
      case "aberta": return "bg-red-100 text-red-800";
      case "em_andamento": return "bg-yellow-100 text-yellow-800";
      case "resolvida": return "bg-green-100 text-green-800";
      case "arquivada": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
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

  const handleAddAction = () => {
    if (!newAction.trim()) return;

    console.log("Nova ação:", {
      occurrenceId: occurrence.id,
      description: newAction,
      actionType: "observacao",
      createdBy: userProfile.name
    });

    toast({
      title: "Sucesso",
      description: "Ação adicionada com sucesso",
    });

    setNewAction("");
    onOccurrenceUpdated();
  };

  const handleStatusChange = () => {
    if (!newStatus) return;

    console.log("Status alterado:", {
      occurrenceId: occurrence.id,
      oldStatus: occurrence.status,
      newStatus: newStatus,
      changedBy: userProfile.name
    });

    toast({
      title: "Sucesso",
      description: "Status atualizado com sucesso",
    });

    setNewStatus("");
    onOccurrenceUpdated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Detalhes da Ocorrência
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cabeçalho da Ocorrência */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold">{occurrence.title}</h3>
              <div className="flex gap-2">
                <Badge className={getStatusColor(occurrence.status)}>
                  {occurrence.status.replace('_', ' ')}
                </Badge>
                <Badge className={getSeverityColor(occurrence.severity)}>
                  {occurrence.severity}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span><strong>Aluno:</strong> {occurrence.student.name} - {occurrence.student.class}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span><strong>Data:</strong> {new Date(occurrence.dateCreated).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span><strong>Reportado por:</strong> {occurrence.reportedBy.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span><strong>Tipo:</strong> {occurrence.type}</span>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <h4 className="font-medium mb-2">Descrição</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">{occurrence.description}</p>
          </div>

          {/* Informações do Responsável */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Informações do Responsável</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span><strong>Nome:</strong> {occurrence.student.guardianName}</span>
              <span><strong>Telefone:</strong> {occurrence.student.guardianPhone}</span>
              {occurrence.student.guardianEmail && (
                <span><strong>Email:</strong> {occurrence.student.guardianEmail}</span>
              )}
            </div>
          </div>

          {/* Ações e Acompanhamento */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Ações e Acompanhamento
            </h4>
            
            {occurrence.actions.length > 0 ? (
              <div className="space-y-3 mb-4">
                {occurrence.actions.map((action) => (
                  <div key={action.id} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-700">{action.description}</p>
                      <Badge variant="outline">{action.actionType}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {action.createdBy.name} - {new Date(action.dateCreated).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-4">Nenhuma ação registrada ainda.</p>
            )}

            {canEdit && (
              <div className="space-y-3 border-t pt-4">
                <Textarea
                  placeholder="Adicionar nova ação ou observação..."
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button onClick={handleAddAction} disabled={!newAction.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Ação
                </Button>
              </div>
            )}
          </div>

          {/* Alterar Status */}
          {canChangeStatus && occurrence.status !== "arquivada" && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Alterar Status</h4>
              <div className="flex gap-3">
                <Select value={newStatus} onValueChange={(value: OccurrenceStatus) => setNewStatus(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Novo status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aberta">Aberta</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="resolvida">Resolvida</SelectItem>
                    <SelectItem value="arquivada">Arquivada</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleStatusChange} disabled={!newStatus}>
                  Atualizar Status
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OccurrenceDetailDialog;
