
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Calendar, MapPin, Users, TrendingUp, Clock } from "lucide-react";
import { UserProfile } from "@/types/user";

interface DashboardStatsProps {
  userProfile: UserProfile;
}

const DashboardStats = ({ userProfile }: DashboardStatsProps) => {
  const stats = [
    {
      title: "Ocorrências Abertas",
      value: "12",
      change: "+3 esta semana",
      trend: "up",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Eventos Este Mês",
      value: "8",
      change: "4 próximos",
      trend: "neutral",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Reservas Hoje",
      value: "6",
      change: "75% ocupação",
      trend: "up",
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Alunos Ativos",
      value: "342",
      change: `${userProfile.schoolYear}`,
      trend: "neutral",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Taxa de Resolução",
      value: "87%",
      change: "+5% vs mês anterior",
      trend: "up",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Tempo Médio",
      value: "2.3 dias",
      change: "resolução ocorrências",
      trend: "down",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className={`text-xs mt-1 flex items-center gap-1 ${
                stat.trend === 'up' ? 'text-green-600' : 
                stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
