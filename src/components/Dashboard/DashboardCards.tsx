
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Calendar, MapPin, TrendingUp } from "lucide-react";

const DashboardCards = () => {
  const cards = [
    {
      title: "Ocorrências Abertas",
      value: "12",
      change: "+3 esta semana",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Eventos Este Mês",
      value: "8",
      change: "4 próximos",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Salas Reservadas Hoje",
      value: "6",
      change: "75% ocupação",
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Eficiência Geral",
      value: "87%",
      change: "+5% vs mês anterior",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`${card.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <p className="text-xs text-gray-500 mt-1">{card.change}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardCards;
