
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Buscando perfil do usuário:', userId);
      
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select(`
          *,
          school:schools(*)
        `)
        .eq('user_id', userId)
        .eq('active', true)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        throw profileError;
      }

      if (!profile) {
        console.error('Perfil não encontrado para o usuário:', userId);
        throw new Error('Perfil não encontrado');
      }

      // Buscar permissões do usuário
      const { data: permissions, error: permError } = await supabase
        .rpc('get_user_permissions', { user_uuid: userId });

      if (permError) {
        console.error('Erro ao buscar permissões:', permError);
        // Não throw aqui, permissões podem ser opcionais
      }

      const userProfile: UserProfile = {
        id: profile.id,
        user_id: profile.user_id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        school: profile.school,
        school_id: profile.school_id,
        schoolYear: profile.school_year,
        active: profile.active,
        permissions: permissions?.map(p => p.permission) || [],
        created_at: profile.created_at,
        updated_at: profile.updated_at
      };

      console.log('Perfil do usuário carregado:', userProfile.name, userProfile.role);
      setUserProfile(userProfile);
      return userProfile;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      // Em caso de erro, fazer logout para evitar estado inconsistente
      await supabase.auth.signOut();
      throw error;
    }
  };

  const handleAuthStateChange = async (event: string, session: Session | null) => {
    console.log('Auth state change:', event, session?.user?.email);
    
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user) {
      try {
        // Buscar perfil do usuário
        await fetchUserProfile(session.user.id);
        
        // Redirecionar apenas se estiver na página de auth
        if (window.location.pathname === '/auth') {
          console.log('Redirecionando para home após login');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Erro ao carregar perfil do usuário:', error);
        setUserProfile(null);
      }
    } else {
      setUserProfile(null);
      // Redirecionar para auth apenas se não estiver na página de auth
      if (window.location.pathname !== '/auth') {
        console.log('Redirecionando para auth (sem sessão)');
        navigate('/auth', { replace: true });
      }
    }
    
    setLoading(false);
  };

  useEffect(() => {
    console.log('Inicializando useAuth...');

    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Verificar sessão existente
    const initializeAuth = async () => {
      try {
        console.log('Verificando sessão existente...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao verificar sessão:', error);
          setLoading(false);
          return;
        }

        console.log('Sessão inicial:', session?.user?.email);
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          
          try {
            await fetchUserProfile(session.user.id);
            
            // Se está autenticado e na página de auth, redirecionar
            if (window.location.pathname === '/auth') {
              console.log('Usuário já autenticado, redirecionando para home');
              navigate('/', { replace: true });
            }
          } catch (error) {
            console.error('Erro ao carregar perfil inicial:', error);
          }
        } else {
          // Se não está autenticado e não está na página de auth, redirecionar
          if (window.location.pathname !== '/auth') {
            console.log('Usuário não autenticado, redirecionando para auth');
            navigate('/auth', { replace: true });
          }
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    console.log('Fazendo logout');
    setLoading(true);
    
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setUserProfile(null);
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    userProfile,
    loading,
    signOut,
    refetchProfile: () => user && fetchUserProfile(user.id)
  };
};
