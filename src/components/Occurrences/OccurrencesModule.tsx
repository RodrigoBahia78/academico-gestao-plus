
import { UserProfile } from "@/types/user";

interface OccurrencesModuleProps {
  userProfile: UserProfile;
}

const OccurrencesModule = ({ userProfile }: OccurrencesModuleProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Controle de Ocorrências</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Módulo de gestão de ocorrências disciplinares, pedagógicas e administrativas.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Funcionalidades: CRUD completo, filtros por tipo/status, histórico por aluno, ações corretivas.
        </p>
      </div>
    </div>
  );
};

export default OccurrencesModule;
