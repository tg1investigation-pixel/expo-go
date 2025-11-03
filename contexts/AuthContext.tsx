import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback } from 'react';
import { AuthUser } from '@/types';
import { databaseService } from '@/services/database';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await databaseService.authenticate(username, password);
      
      if (success) {
        setUser({
          username,
          fullName: 'المشرف العام',
          role: 'admin'
        });
        return true;
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
        return false;
      }
    } catch {
      setError('حدث خطأ أثناء تسجيل الدخول');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: user !== null
  };
});
