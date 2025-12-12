'use client';
import { createContext, useContext, useEffect, ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import fetchWithAuth, { getToken, setToken, clearToken } from '@/lib/api';

interface AuthContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any | null;
  loading: boolean;
  role: 'driver' | 'admin' | 'coordinator' | null;
  adminRole: 'viewer' | 'editor' | 'admin' | null;
  signIn: (email: string, password: string) => Promise<{ error?: Error; role?: 'driver' | 'admin' | 'coordinator' | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<'driver' | 'admin' | 'coordinator' | null>(null);
  const [adminRole, setAdminRole] = useState<'viewer' | 'editor' | 'admin' | null>(null);

  const signIn = async (email: string, password: string) => {
    const { callPHPBackend } = await import('@/lib/php-api');
    const res = await callPHPBackend('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    if (data.token) {
      setToken(data.token);
      // load user details
      const meRes = await callPHPBackend('/api/auth/me', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${data.token}` },
      });
      if (meRes.ok) {
        const userData = await meRes.json();
        setUser(userData);
        setRole(data.role || (userData?.role ?? null));
        setAdminRole(userData?.role === 'admin' ? (userData?.adminRole ?? null) : null);
      }
    }
    return { role: data.role ?? null };
  };

  const signOut = async () => {
    clearToken();
    setUser(null);
    setRole(null);
    setAdminRole(null);
    router.push('/login');
  };

  // Only redirect on initial login, not on page refresh
  // Check if we're already on a valid page for the user's role
  useEffect(() => {
    const initSession = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { callPHPBackend } = await import('@/lib/php-api');
        const meRes = await callPHPBackend('/api/auth/me', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!meRes.ok) {
          clearToken();
          setLoading(false);
          return;
        }
        const userData = await meRes.json();
        setUser(userData);
        setRole(userData.role ?? null);
        setAdminRole(userData.role === 'admin' ? (userData?.adminRole ?? null) : null);
      } catch (error) {
        clearToken();
      } finally {
        setLoading(false);
      }
    };
    initSession();
  }, []);

  // Handle redirects after user/role state changes
  useEffect(() => {
    if (!loading && user && role) {
      const currentPath = window.location.pathname;
      const isLoginPage = currentPath === '/login';
      const isSignupPage = currentPath === '/signup';
      
      // Only redirect if on login/signup page or if user has no role
      if (isLoginPage || isSignupPage || !role) {
        if (role === 'admin') router.push('/admin');
        else if (role === 'coordinator') router.push('/user');
        else if (role === 'driver') router.push('/profile');
        else if (!role) router.push('/login?error=unknown_role');
      }
      // Otherwise, stay on current page (don't redirect on refresh)
    }
  }, [user, role, loading, router]);

  return (
    <AuthContext.Provider value={{ user, loading, role, adminRole, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
}