
import { UserProfile } from "@/types/user";

interface ReportsModuleProps {
  userProfile: UserProfile;
}

const ReportsModule = ({ userProfile }: ReportsModuleProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Relatórios e Análises</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Relatórios executivos e análises para tomada de decisão da coordenação.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Funcionalidades: Dashboards analíticos, exportação CSV/PDF, indicadores de desempenho.
        </p>
      </div>
    </div>
  );
};

export default ReportsModule;
