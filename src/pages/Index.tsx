
import { useState } from "react";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import Dashboard from "@/components/Dashboard/Dashboard";
import OccurrencesModule from "@/components/Occurrences/OccurrencesModule";
import EventsModule from "@/components/Events/EventsModule";
import ResourcesModule from "@/components/Resources/ResourcesModule";
import StudentsModule from "@/components/Students/StudentsModule";
import ReportsModule from "@/components/Reports/ReportsModule";
import { UserProfile } from "@/types/user";

const Index = () => {
  const [activeModule, setActiveModule] = useState("dashboard");

  // Simulação de dados do usuário logado
  const userProfile: UserProfile = {
    id: "1",
    name: "Maria Silva Coordenadora",
    email: "maria.coordenadora@escola.edu.br",
    role: "coordenador",
    school: {
      id: "school_001",
      name: "Escola Estadual Dom Pedro II",
      code: "31001234"
    },
    schoolYear: "2024",
    permissions: [
      "view_dashboard",
      "manage_occurrences", 
      "manage_events",
      "manage_resources",
      "view_reports",
      "manage_users"
    ]
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard userProfile={userProfile} />;
      case "occurrences":
        return <OccurrencesModule userProfile={userProfile} />;
      case "events":
        return <EventsModule userProfile={userProfile} />;
      case "resources":
        return <ResourcesModule userProfile={userProfile} />;
      case "students":
        return <StudentsModule userProfile={userProfile} />;
      case "reports":
        return <ReportsModule userProfile={userProfile} />;
      default:
        return <Dashboard userProfile={userProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeModule={activeModule} 
        onModuleChange={setActiveModule}
        userProfile={userProfile}
      />
      <div className="flex-1 flex flex-col">
        <Header userProfile={userProfile} />
        <main className="flex-1 p-6 overflow-auto">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
};

export default Index;
