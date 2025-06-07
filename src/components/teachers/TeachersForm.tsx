import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Teacher } from '@/types'; // Supondo que Teacher está em src/types

interface TeacherFormProps {
  onSubmit: (teacher: Omit<Teacher, 'id'>) => void;
  initialData?: Teacher;
  onCancel?: () => void;
}

export function TeacherForm({ onSubmit, initialData, onCancel }: TeacherFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  // Adicione mais estados para outros campos, como subjectsTaught

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validação básica
    if (!name || !email) {
      alert('Nome e Email são obrigatórios.');
      return;
    }
    onSubmit({ name, email, phone });
    // Limpar formulário após submissão, se não for edição
    if (!initialData) {
      setName('');
      setEmail('');
      setPhone('');
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{initialData ? 'Editar Professor' : 'Cadastrar Novo Professor'}</CardTitle>
        <CardDescription>
          {initialData ? 'Atualize os dados do professor.' : 'Preencha os dados para registrar um novo professor.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do Professor"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone (Opcional)</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(XX) XXXXX-XXXX"
            />
          </div>
          {/* Adicionar campos para 'subjectsTaught' se necessário,
              talvez usando um componente de multi-seleção ou tags */}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit">{initialData ? 'Salvar Alterações' : 'Cadastrar Professor'}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}