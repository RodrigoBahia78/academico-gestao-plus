
import { useState } from "react";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import DashboardCards from "@/components/Dashboard/DashboardCards";
import OccurrencesList from "@/components/Occurrences/OccurrencesList";
import EventsCalendar from "@/components/Events/EventsCalendar";
import RoomsManagement from "@/components/Rooms/RoomsManagement";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const userProfile = {
    name: "Maria Coordenadora",
    role: "Coordenadora Acadêmica",
    school: "Escola Estadual Dom Pedro II"
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
            <DashboardCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Ocorrências Recentes</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-red-500 pl-4">
                    <p className="font-medium">João Silva - 9º A</p>
                    <p className="text-sm text-gray-600">Comportamento inadequado</p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <p className="font-medium">Ana Costa - 8º B</p>
                    <p className="text-sm text-gray-600">Dificuldades de aprendizagem</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Próximos Eventos</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-medium">Conselho de Classe - 9º Ano</p>
                    <p className="text-sm text-gray-600">08/06/2024 às 14:00</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-medium">Feira de Ciências</p>
                    <p className="text-sm text-gray-600">15/06/2024 às 08:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "occurrences":
        return <OccurrencesList />;
      case "events":
        return <EventsCalendar />;
      case "rooms":
        return <RoomsManagement />;
      case "students":
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestão de Alunos</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Módulo de gestão de alunos em desenvolvimento...</p>
            </div>
          </div>
        );
      case "reports":
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Relatórios</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Módulo de relatórios em desenvolvimento...</p>
            </div>
          </div>
        );
      default:
        return <DashboardCards />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userProfile={userProfile} />
      <div className="flex">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
