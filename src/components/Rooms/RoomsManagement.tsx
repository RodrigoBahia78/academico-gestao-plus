
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Monitor, Users, Clock, Plus } from "lucide-react";

interface Room {
  id: string;
  name: string;
  type: "sala_aula" | "laboratorio" | "auditorio" | "biblioteca";
  capacity: number;
  equipment: string[];
  status: "disponivel" | "ocupada" | "manutencao";
  currentReservation?: {
    user: string;
    purpose: string;
    time: string;
  };
}

interface Equipment {
  id: string;
  name: string;
  type: "projetor" | "computador" | "som" | "camera";
  status: "disponivel" | "em_uso" | "manutencao";
  location: string;
}

const mockRooms: Room[] = [
  {
    id: "1",
    name: "Auditório Principal",
    type: "auditorio",
    capacity: 200,
    equipment: ["Projetor", "Sistema de Som", "Microfones"],
    status: "ocupada",
    currentReservation: {
      user: "Prof. Ana Silva",
      purpose: "Palestra sobre Sustentabilidade",
      time: "14:00 - 16:00"
    }
  },
  {
    id: "2",
    name: "Laboratório de Informática",
    type: "laboratorio",
    capacity: 30,
    equipment: ["30 Computadores", "Projetor", "Ar Condicionado"],
    status: "disponivel"
  },
  {
    id: "3",
    name: "Biblioteca",
    type: "biblioteca",
    capacity: 50,
    equipment: ["Computadores", "Impressora", "Scanner"],
    status: "disponivel"
  }
];

const mockEquipment: Equipment[] = [
  {
    id: "1",
    name: "Projetor Portátil 01",
    type: "projetor",
    status: "em_uso",
    location: "Sala 201"
  },
  {
    id: "2",
    name: "Notebook Dell 15",
    type: "computador",
    status: "disponivel",
    location: "Almoxarifado"
  },
  {
    id: "3",
    name: "Caixa de Som Bluetooth",
    type: "som",
    status: "disponivel",
    location: "Coordenação"
  }
];

const RoomsManagement = () => {
  const [rooms] = useState<Room[]>(mockRooms);
  const [equipment] = useState<Equipment[]>(mockEquipment);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponivel": return "bg-green-100 text-green-800";
      case "ocupada": return "bg-red-100 text-red-800";
      case "em_uso": return "bg-red-100 text-red-800";
      case "manutencao": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "auditorio": return "🎭";
      case "laboratorio": return "🔬";
      case "biblioteca": return "📚";
      case "sala_aula": return "🏫";
      default: return "🏢";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Salas e Equipamentos</h2>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Reserva
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Salas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rooms.map((room) => (
                <div key={room.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(room.type)}</span>
                      <div>
                        <h3 className="font-semibold">{room.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Capacidade: {room.capacity} pessoas
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(room.status)}>
                      {room.status}
                    </Badge>
                  </div>

                  {room.currentReservation && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                      <div className="text-sm">
                        <p className="font-medium text-red-800">Reservado por: {room.currentReservation.user}</p>
                        <p className="text-red-600">{room.currentReservation.purpose}</p>
                        <p className="text-red-600 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {room.currentReservation.time}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">Equipamentos:</p>
                    <div className="flex flex-wrap gap-1">
                      {room.equipment.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" disabled={room.status !== "disponivel"}>
                      Reservar
                    </Button>
                    <Button variant="outline" size="sm">
                      Ver Agenda
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Equipamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {equipment.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </p>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" disabled={item.status !== "disponivel"}>
                      Reservar
                    </Button>
                    <Button variant="outline" size="sm">
                      Histórico
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoomsManagement;
