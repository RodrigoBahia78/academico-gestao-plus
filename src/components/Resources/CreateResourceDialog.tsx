
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Resource, ResourceType, ResourceStatus } from "@/types/resources";
import { UserProfile } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

interface CreateResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateResource: (resource: Omit<Resource, 'id' | 'createdAt'>) => void;
  userProfile: UserProfile;
}

const CreateResourceDialog = ({ open, onOpenChange, onCreateResource, userProfile }: CreateResourceDialogProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    type: "" as ResourceType,
    code: "",
    description: "",
    capacity: "",
    location: "",
    status: "disponivel" as ResourceStatus
  });

  const [specifications, setSpecifications] = useState<Record<string, any>>({});

  const handleSpecificationChange = (key: string, value: any) => {
    setSpecifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.code || !formData.location) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const resource: Omit<Resource, 'id' | 'createdAt'> = {
      name: formData.name,
      type: formData.type,
      code: formData.code,
      description: formData.description,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      location: formData.location,
      status: formData.status,
      specifications,
      schoolId: userProfile.school.id
    };

    onCreateResource(resource);
    
    // Reset form
    setFormData({
      name: "",
      type: "" as ResourceType,
      code: "",
      description: "",
      capacity: "",
      location: "",
      status: "disponivel"
    });
    setSpecifications({});
    
    toast({
      title: "Sucesso",
      description: "Recurso criado com sucesso!"
    });
  };

  const renderSpecificationsFields = () => {
    if (formData.type === "sala") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="ar_condicionado"
                checked={specifications.ar_condicionado || false}
                onCheckedChange={(checked) => handleSpecificationChange("ar_condicionado", checked)}
              />
              <Label htmlFor="ar_condicionado">Ar Condicionado</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="projetor"
                checked={specifications.projetor || false}
                onCheckedChange={(checked) => handleSpecificationChange("projetor", checked)}
              />
              <Label htmlFor="projetor">Projetor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="som"
                checked={specifications.som || false}
                onCheckedChange={(checked) => handleSpecificationChange("som", checked)}
              />
              <Label htmlFor="som">Sistema de Som</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="quadro_digital"
                checked={specifications.quadro_digital || false}
                onCheckedChange={(checked) => handleSpecificationChange("quadro_digital", checked)}
              />
              <Label htmlFor="quadro_digital">Quadro Digital</Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="computadores">Número de Computadores</Label>
              <Input
                id="computadores"
                type="number"
                min="0"
                value={specifications.computadores || ""}
                onChange={(e) => handleSpecificationChange("computadores", parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="microfones">Número de Microfones</Label>
              <Input
                id="microfones"
                type="number"
                min="0"
                value={specifications.microfones || ""}
                onChange={(e) => handleSpecificationChange("microfones", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      );
    }

    if (formData.type === "equipamento") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                value={specifications.marca || ""}
                onChange={(e) => handleSpecificationChange("marca", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                value={specifications.modelo || ""}
                onChange={(e) => handleSpecificationChange("modelo", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="numero_serie">Número de Série</Label>
            <Input
              id="numero_serie"
              value={specifications.numero_serie || ""}
              onChange={(e) => handleSpecificationChange("numero_serie", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="especificacoes_tecnicas">Especificações Técnicas</Label>
            <Textarea
              id="especificacoes_tecnicas"
              value={specifications.especificacoes_tecnicas || ""}
              onChange={(e) => handleSpecificationChange("especificacoes_tecnicas", e.target.value)}
              placeholder="Ex: Intel i5, 8GB RAM, 256GB SSD"
            />
          </div>
        </div>
      );
    }

    if (formData.type === "material") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantidade_total">Quantidade Total</Label>
              <Input
                id="quantidade_total"
                type="number"
                min="1"
                value={specifications.quantidade_total || ""}
                onChange={(e) => handleSpecificationChange("quantidade_total", parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <Label htmlFor="unidade">Unidade</Label>
              <Select 
                value={specifications.unidade || ""} 
                onValueChange={(value) => handleSpecificationChange("unidade", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unidade">Unidade</SelectItem>
                  <SelectItem value="par">Par</SelectItem>
                  <SelectItem value="conjunto">Conjunto</SelectItem>
                  <SelectItem value="metro">Metro</SelectItem>
                  <SelectItem value="litro">Litro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={specifications.observacoes || ""}
              onChange={(e) => handleSpecificationChange("observacoes", e.target.value)}
              placeholder="Informações adicionais sobre o material"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Recurso</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do recurso"
              />
            </div>
            <div>
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: SALA001, PROJ001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as ResourceType })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sala">Sala</SelectItem>
                  <SelectItem value="equipamento">Equipamento</SelectItem>
                  <SelectItem value="material">Material</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as ResourceStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="ocupado">Ocupado</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="indisponivel">Indisponível</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Localização *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ex: Bloco A - Sala 101"
            />
          </div>

          {formData.type === "sala" && (
            <div>
              <Label htmlFor="capacity">Capacidade</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="Número de pessoas"
              />
            </div>
          )}

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição detalhada do recurso"
              rows={3}
            />
          </div>

          {formData.type && (
            <div>
              <Label>Especificações</Label>
              {renderSpecificationsFields()}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Criar Recurso
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateResourceDialog;
