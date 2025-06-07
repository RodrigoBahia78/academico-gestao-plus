
import { useState } from "react";
import { 
  LayoutDashboard,
  FileText,
  Calendar,
  MapPin,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types/user";

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  userProfile: UserProfile;
}

const Sidebar = ({ activeModule, onModuleChange, userProfile }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard,
      permission: "view_dashboard",
      badge: null
    },
    { 
      id: "occurrences", 
      label: "Ocorrências", 
      icon: AlertTriangle,
      permission: "manage_occurrences",
      badge: { count: 5, color: "bg-red-500" }
    },
    { 
      id: "events", 
      label: "Eventos", 
      icon: Calendar,
      permission: "manage_events",
      badge: { count: 3, color: "bg-blue-500" }
    },
    {
      id: "calendar",
      label: "Calendário",
      icon: Calendar,
      permission: "view_calendar", // Defina uma permissão apropriada
      badge: null
    },
    { 
      id: "resources", 
      label: "Salas e Recursos", 
      icon: MapPin,
      permission: "manage_resources",
      badge: null
    },
    { 
      id: "students", 
      label: "Alunos", 
      icon: Users,
      permission: "view_students",
      badge: null
    },
    { 
      id: "reports", 
      label: "Relatórios", 
      icon: BarChart3,
      permission: "view_reports", 
      badge: null
    },
  ];

  const hasPermission = (permission: string) => {
    return userProfile.permissions.includes(permission);
  };

  return (
    <div className={cn(
      "bg-gradient-to-b from-blue-800 to-blue-900 text-white transition-all duration-300 shadow-lg",
      collapsed ? "w-16" : "w-72"
    )}>
      <div className="p-4 border-b border-blue-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold">Menu Principal</h2>
              <p className="text-xs text-blue-200 mt-1">
                {userProfile.school.code} • {userProfile.schoolYear}
              </p>
            </div>
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
      
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const canAccess = hasPermission(item.permission);
          
          if (!canAccess) return null;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start text-white hover:bg-blue-700 relative",
                activeModule === item.id && "bg-blue-700 shadow-md",
                collapsed && "px-2 justify-center"
              )}
              onClick={() => onModuleChange(item.id)}
            >
              <div className="flex items-center gap-3 w-full">
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge className={cn(
                        "text-white text-xs px-2 py-0.5",
                        item.badge.color
                      )}>
                        {item.badge.count}
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </Button>
          );
        })}
      </nav>

      
    </div>
  );
};

export default Sidebar;
