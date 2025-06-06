
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { OccurrenceType, OccurrenceSeverity, Student } from "@/types/occurrences";
import { useToast } from "@/hooks/use-toast";

interface CreateOccurrenceDialogProps {
  onOccurrenceCreated: () => void;
}

const mockStudents: Student[] = [
  { id: "1", name: "João Silva", class: "9º A", enrollment: "2024001", birthDate: "2010-05-15", guardianName: "Maria Silva", guardianPhone: "(11) 99999-1111" },
  { id: "2", name: "Ana Costa", class: "8º B", enrollment: "2024002", birthDate: "2011-03-22", guardianName: "Pedro Costa", guardianPhone: "(11) 99999-2222" },
  { id: "3", name: "Pedro Oliveira", class: "7º C", enrollment: "2024003", birthDate: "2012-07-10", guardianName: "Sandra Oliveira", guardianPhone: "(11) 99999-3333" },
];

const CreateOccurrenceDialog = ({ onOccurrenceCreated }: CreateOccurrenceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    type: "" as OccurrenceType,
    severity: "" as OccurrenceSeverity,
    title: "",
    description: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.type || !formData.severity || !formData.title || !formData.description) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Simular criação da ocorrência
    console.log("Nova ocorrência:", formData);
    
    toast({
      title: "Sucesso",
      description: "Ocorrência registrada com sucesso",
    });

    setFormData({
      studentId: "",
      type: "" as OccurrenceType,
      severity: "" as OccurrenceSeverity,
      title: "",
      description: "",
    });
    setOpen(false);
    onOccurrenceCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Ocorrência
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Registrar Nova Ocorrência</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="student">Aluno *</Label>
              <Select value={formData.studentId} onValueChange={(value) => setFormData({ ...formData, studentId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o aluno" />
                </SelectTrigger>
                <SelectContent>
                  {mockStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.class}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Tipo *</Label>
              <Select value={formData.type} onValueChange={(value: OccurrenceType) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo da ocorrência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disciplinar">Disciplinar</SelectItem>
                  <SelectItem value="pedagogica">Pedagógica</SelectItem>
                  <SelectItem value="administrativa">Administrativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="severity">Gravidade *</Label>
            <Select value={formData.severity} onValueChange={(value: OccurrenceSeverity) => setFormData({ ...formData, severity: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Gravidade da ocorrência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="critica">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Resumo da ocorrência"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição detalhada da ocorrência"
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Registrar Ocorrência
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOccurrenceDialog;
