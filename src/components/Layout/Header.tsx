
import { Bell, User, LogOut, School, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/types/user";

interface HeaderProps {
  userProfile: UserProfile;
  onSignOut: () => Promise<void>;
}

const Header = ({ userProfile, onSignOut }: HeaderProps) => {
  const getRoleLabel = (role: string) => {
    const roles = {
      coordenador: "Coordenador(a) Acadêmico(a)",
      secretario: "Secretário(a) Escolar", 
      inspetor: "Inspetor(a)/Orientador(a)",
      diretor: "Diretor(a) Escolar"
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      coordenador: "bg-blue-100 text-blue-800",
      secretario: "bg-green-100 text-green-800",
      inspetor: "bg-purple-100 text-purple-800", 
      diretor: "bg-orange-100 text-orange-800"
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">
              Sistema de Coordenação Acadêmica
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <School className="h-4 w-4" />
                <span>{userProfile.school.name}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Ano Letivo: {userProfile.schoolYear}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 p-2">
                <div className="bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleBadgeColor(userProfile.role)}>
                      {getRoleLabel(userProfile.role)}
                    </Badge>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <School className="mr-2 h-4 w-4" />
                Dados da Escola
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair do Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
