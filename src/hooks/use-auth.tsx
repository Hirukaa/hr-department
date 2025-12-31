"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@/types';
import { users } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<User | null>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for a logged-in user in session storage on initial load
    try {
      const storedUser = sessionStorage.getItem('facet-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Could not parse user from session storage", error);
      sessionStorage.removeItem('facet-user');
    }
    setLoading(false);
  }, []);
  
  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
    if (!loading && user && pathname === '/login') {
        router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string) => {
    setLoading(true);
    // Mock API call
    return new Promise<User | null>(resolve => {
      setTimeout(() => {
        const foundUser = users.find(u => u.email === email);
        if (foundUser) {
          setUser(foundUser);
          sessionStorage.setItem('facet-user', JSON.stringify(foundUser));
          router.push('/dashboard');
          resolve(foundUser);
        } else {
          resolve(null);
        }
        setLoading(false);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('facet-user');
    router.push('/login');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated }}>
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center">
          {/* You can replace this with a beautiful spinner component */}
          <p>Loading application...</p>
        </div>
      ) : children }
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
