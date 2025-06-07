import React, { useState, useEffect } from 'react';
import { TeacherForm } from './TeachersForm';
import { Teacher } from '@/types'; // Supondo que Teacher está em src/types
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

// Mock da API - substitua por chamadas reais à sua API
const fetchTeachers = async (): Promise<Teacher[]> => {
  console.log('Buscando professores...');
  // Simula uma chamada de API
  return Promise.resolve([
    { id: '1', name: 'Ana Silva', email: 'ana.silva@escola.com', phone: '11999990001', subjectsTaught: ['Matemática'] },
    { id: '2', name: 'Carlos Prado', email: 'carlos.prado@escola.com', phone: '11999990002', subjectsTaught: ['História', 'Geografia'] },
  ]);
};

const saveTeacher = async (teacherData: Omit<Teacher, 'id'>): Promise<Teacher> => {
  console.log('Salvando professor:', teacherData);
  // Simula uma chamada de API
  return Promise.resolve({ id: String(Date.now()), ...teacherData });
};

export function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTeachers().then(setTeachers);
  }, []);

  const handleFormSubmit = async (teacherData: Omit<Teacher, 'id'>) => {
    const newTeacher = await saveTeacher(teacherData);
    setTeachers((prevTeachers) => [...prevTeachers, newTeacher]);
    setShowForm(false); // Esconde o formulário após o cadastro
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Gestão de Professores</h1>
        {!showForm && <Button onClick={() => setShowForm(true)}><PlusCircle className="mr-2 h-4 w-4" /> Adicionar Professor</Button>}
      </div>

      {showForm && <TeacherForm onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />}

      {/* Aqui você pode adicionar uma tabela ou lista para exibir os professores */}
      {/* Exemplo: <TeachersTable teachers={teachers} onEdit={...} onDelete={...} /> */}
      {!showForm && teachers.length > 0 && <div className="mt-4">Listagem de professores apareceria aqui.</div>}
      {!showForm && teachers.length === 0 && <div className="mt-4 text-gray-500">Nenhum professor cadastrado.</div>}
    </div>
  );
}