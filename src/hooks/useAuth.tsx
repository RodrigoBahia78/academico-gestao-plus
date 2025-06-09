
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

  useEffect(() => {
    // Configurar listener de mudanças de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
          // Se está autenticado e está na página de auth, redirecionar para home
          if (window.location.pathname === '/auth') {
            navigate('/');
          }
        } else {
          setUserProfile(null);
          // Se não está autenticado e não está na página de auth, redirecionar
          if (window.location.pathname !== '/auth') {
            navigate('/auth');
          }
        }
        setLoading(false);
      }
    );

    // DEPOIS verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      } else {
        if (window.location.pathname !== '/auth') {
          navigate('/auth');
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Buscar perfil do usuário com escola
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
        return;
      }

      // Buscar permissões do usuário
      const { data: permissions, error: permError } = await supabase
        .rpc('get_user_permissions', { user_uuid: userId });

      if (permError) {
        console.error('Erro ao buscar permissões:', permError);
        return;
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

      setUserProfile(userProfile);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
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
