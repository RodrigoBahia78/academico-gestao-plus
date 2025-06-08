
import { useState } from "react";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import Dashboard from "@/components/Dashboard/Dashboard";
import OccurrencesModule from "@/components/Occurrences/OccurrencesModule";
import EventsModule from "@/components/Events/EventsModule";
import ResourcesModule from "@/components/Resources/ResourcesModule";
import StudentsModule from "@/components/Students/StudentsModule";
import ReportsModule from "@/components/Reports/ReportsModule";
import CalendarModule from "@/components/Calendar/CalendarModule";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";

const Index = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const { user, userProfile, loading } = useAuth();
  const { hasPermission } = usePermissions(userProfile);

  // Mostrar loading enquanto carrega os dados do usuário
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não há usuário ou perfil, mostrar dados mock para desenvolvimento
  const mockUserProfile = {
    id: "1",
    user_id: "mock-user",
    name: "Maria Silva Coordenadora",
    email: "maria.coordenadora@escola.edu.br",
    role: "coordenador_pedagogico" as const,
    school: {
      id: "school_001",
      name: "Escola Estadual Dom Pedro II",
      code: "31001234"
    },
    school_id: "school_001",
    schoolYear: "2024",
    active: true,
    permissions: [
      "view_dashboard",
      "manage_occurrences", 
      "manage_events",
      "manage_resources",
      "view_reports",
      "view_calendar",
      "view_students",
      "manage_users"
    ]
  };

  const currentUserProfile = userProfile || mockUserProfile;

  const renderActiveModule = () => {
    switch (activeModule) {
      case "dashboard":
        return hasPermission("view_dashboard") ? 
          <Dashboard userProfile={currentUserProfile} /> : 
          <div className="p-6">Sem permissão para acessar o dashboard</div>;
      case "occurrences":
        return hasPermission("manage_occurrences") ? 
          <OccurrencesModule userProfile={currentUserProfile} /> : 
          <div className="p-6">Sem permissão para gerenciar ocorrências</div>;
      case "events":
        return hasPermission("manage_events") ? 
          <EventsModule userProfile={currentUserProfile} /> : 
          <div className="p-6">Sem permissão para gerenciar eventos</div>;
      case "resources":
        return hasPermission("manage_resources") ? 
          <ResourcesModule userProfile={currentUserProfile} /> : 
          <div className="p-6">Sem permissão para gerenciar recursos</div>;
      case "students":
        return hasPermission("view_students") ? 
          <StudentsModule userProfile={currentUserProfile} /> : 
          <div className="p-6">Sem permissão para visualizar alunos</div>;
      case "reports":
        return hasPermission("view_reports") ? 
          <ReportsModule userProfile={currentUserProfile} /> : 
          <div className="p-6">Sem permissão para visualizar relatórios</div>;
      case "calendar":
        return hasPermission("view_calendar") ? 
          <CalendarModule userProfile={currentUserProfile} /> : 
          <div className="p-6">Sem permissão para acessar o calendário</div>;
      default:
        return <Dashboard userProfile={currentUserProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeModule={activeModule} 
        onModuleChange={setActiveModule}
        userProfile={currentUserProfile}
      />
      <div className="flex-1 flex flex-col">
        <Header userProfile={currentUserProfile} />
        <main className="flex-1 p-6 overflow-auto">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
};

export default Index;
