
import { UserProfile } from "@/types/user";

interface EventsModuleProps {
  userProfile: UserProfile;
}

const EventsModule = ({ userProfile }: EventsModuleProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestão de Eventos</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Planejamento e controle de eventos acadêmicos (reuniões, conselhos, feiras, provas especiais).
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Funcionalidades: Agenda, participantes, recursos necessários, recorrência, notificações.
        </p>
      </div>
    </div>
  );
};

export default EventsModule;
