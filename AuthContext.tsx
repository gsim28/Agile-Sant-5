import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

type AuthContextType = {
  user: any;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  signInWithApple: () => Promise<any>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      navigation.navigate('App' as never);
    } else {
      navigation.navigate('Auth' as never);
    }
  }, [user]);

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${Constants.expoConfig?.extra?.appUrl}/callback` }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${Constants.expoConfig?.extra?.appUrl}/callback` }
    });
    return { data, error };
  };

  const signInWithApple = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: `${Constants.expoConfig?.extra?.appUrl}/callback` }
    });
    return { data, error };
  };

  const resetPassword = async (email: string) => {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${Constants.expoConfig?.extra?.appUrl}/reset-password`
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, signUp, signIn, signOut, signInWithGoogle, signInWithApple, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);