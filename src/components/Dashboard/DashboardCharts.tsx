
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const DashboardCharts = () => {
  const occurrencesByMonth = [
    { month: "Jan", disciplinar: 8, pedagogica: 12, administrativa: 3 },
    { month: "Fev", disciplinar: 6, pedagogica: 15, administrativa: 5 },
    { month: "Mar", disciplinar: 10, pedagogica: 18, administrativa: 4 },
    { month: "Abr", disciplinar: 4, pedagogica: 14, administrativa: 6 },
    { month: "Mai", disciplinar: 7, pedagogica: 16, administrativa: 2 },
    { month: "Jun", disciplinar: 5, pedagogica: 11, administrativa: 3 },
  ];

  const eventsByType = [
    { name: "Reuniões", value: 45, color: "#3b82f6" },
    { name: "Conselhos", value: 25, color: "#10b981" }, 
    { name: "Feiras", value: 15, color: "#f59e0b" },
    { name: "Provas", value: 15, color: "#ef4444" },
  ];

  const resourceUsage = [
    { week: "S1", salas: 85, equipamentos: 70 },
    { week: "S2", salas: 90, equipamentos: 65 },
    { week: "S3", salas: 75, equipamentos: 80 },
    { week: "S4", salas: 95, equipamentos: 75 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ocorrências por Mês e Tipo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={occurrencesByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="disciplinar" fill="#ef4444" name="Disciplinar" />
              <Bar dataKey="pedagogica" fill="#3b82f6" name="Pedagógica" />
              <Bar dataKey="administrativa" fill="#10b981" name="Administrativa" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Eventos por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={eventsByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {eventsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso de Recursos (% Ocupação)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={resourceUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Line type="monotone" dataKey="salas" stroke="#3b82f6" strokeWidth={3} name="Salas" />
                <Line type="monotone" dataKey="equipamentos" stroke="#10b981" strokeWidth={3} name="Equipamentos" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardCharts;
