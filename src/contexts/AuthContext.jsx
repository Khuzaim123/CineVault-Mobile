import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [supabaseError, setSupabaseError] = useState(null);

  useEffect(() => {
    // Try to get session — handle network errors gracefully
    const timeout = setTimeout(() => {
      // If Supabase hasn't responded in 8s, let the app load anyway
      if (loading) {
        console.warn('Supabase connection timeout — loading in offline mode');
        setLoading(false);
      }
    }, 8000);

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
      })
      .catch((err) => {
        // Supabase unreachable (project paused, no internet, etc.)
        // App still loads — just without auth state
        console.warn('Supabase unreachable:', err.message);
        setSupabaseError(err.message);
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setSupabaseError(null);
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setIsGuest(false);
    setSupabaseError(null);
    return data;
  };

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut().catch(() => {});
    setIsGuest(false);
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const continueAsGuest = () => setIsGuest(true);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isGuest,
        supabaseError,
        isAuthenticated: !!user || isGuest,
        signIn,
        signUp,
        signOut,
        resetPassword,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
