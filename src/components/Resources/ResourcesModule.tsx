
import { UserProfile } from "@/types/user";

interface ResourcesModuleProps {
  userProfile: UserProfile;
}

const ResourcesModule = ({ userProfile }: ResourcesModuleProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Salas e Recursos</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Gestão de salas, equipamentos e recursos patrimoniais da escola.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Funcionalidades: Reservas, calendário de uso, status de manutenção, relatórios de ocupação.
        </p>
      </div>
    </div>
  );
};

export default ResourcesModule;
