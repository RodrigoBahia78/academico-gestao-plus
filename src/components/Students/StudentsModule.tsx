
import { UserProfile } from "@/types/user";

interface StudentsModuleProps {
  userProfile: UserProfile;
}

const StudentsModule = ({ userProfile }: StudentsModuleProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestão de Alunos</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Cadastro e acompanhamento de alunos por ano letivo e turma.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Funcionalidades: Histórico escolar, responsáveis, ocorrências vinculadas, relatórios.
        </p>
      </div>
    </div>
  );
};

export default StudentsModule;
