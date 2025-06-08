
import React, { useMemo } from 'react';
import { UserProfile } from '@/types/user';

export const usePermissions = (userProfile: UserProfile | null) => {
  const hasPermission = useMemo(() => {
    return (permission: string): boolean => {
      if (!userProfile || !userProfile.permissions) return false;
      return userProfile.permissions.includes(permission);
    };
  }, [userProfile]);

  const hasAnyPermission = useMemo(() => {
    return (permissions: string[]): boolean => {
      if (!userProfile || !userProfile.permissions) return false;
      return permissions.some(permission => userProfile.permissions.includes(permission));
    };
  }, [userProfile]);

  const hasAllPermissions = useMemo(() => {
    return (permissions: string[]): boolean => {
      if (!userProfile || !userProfile.permissions) return false;
      return permissions.every(permission => userProfile.permissions.includes(permission));
    };
  }, [userProfile]);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions: userProfile?.permissions || []
  };
};
