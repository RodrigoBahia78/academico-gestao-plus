
import { useState } from "react";
import { 
  BookOpen, 
  Calendar, 
  MapPin, 
  BarChart3, 
  Users, 
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "occurrences", label: "Ocorrências", icon: FileText },
  { id: "events", label: "Eventos", icon: Calendar },
  { id: "rooms", label: "Salas e Equipamentos", icon: MapPin },
  { id: "students", label: "Alunos", icon: Users },
  { id: "reports", label: "Relatórios", icon: BookOpen },
];

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-blue-500">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-lg font-semibold">Menu Principal</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:bg-blue-700"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <nav className="p-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start mb-1 text-white hover:bg-blue-700",
                activeSection === item.id && "bg-blue-700",
                collapsed && "px-2"
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
              {!collapsed && item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
