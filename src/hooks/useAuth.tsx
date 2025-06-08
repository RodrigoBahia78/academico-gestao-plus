
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar usuário atual
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        await fetchUserProfile(user.id);
      }
      setLoading(false);
    };

    getCurrentUser();

    // Listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

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
  };

  return {
    user,
    userProfile,
    loading,
    signOut,
    refetchProfile: () => user && fetchUserProfile(user.id)
  };
};
