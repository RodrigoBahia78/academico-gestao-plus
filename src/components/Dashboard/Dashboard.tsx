
import DashboardStats from "./DashboardStats";
import DashboardCharts from "./DashboardCharts";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";
import { UserProfile } from "@/types/user";

interface DashboardProps {
  userProfile: UserProfile;
}

const Dashboard = ({ userProfile }: DashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Bem-vindo(a), {userProfile.name.split(' ')[0]}! Visão geral das atividades da coordenação.
          </p>
        </div>
      </div>

      <DashboardStats userProfile={userProfile} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCharts />
        </div>
        <div className="space-y-6">
          <QuickActions userProfile={userProfile} />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
