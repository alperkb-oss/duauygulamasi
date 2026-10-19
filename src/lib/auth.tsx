import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

type AuthState =
  | { status: 'loading' }
  | { status: 'guest' }
  | { status: 'authenticated'; user: User; session: Session };

type AuthResult = { error: string | null; needsConfirmation?: boolean };

interface AuthContextValue {
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapAuthError(error: { message?: string } | null): string {
  if (!error || !error.message) return 'auth.errorGeneric';
  const msg = error.message.toLowerCase();
  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return 'auth.errorInvalidCredentials';
  }
  if (msg.includes('user already registered') || msg.includes('already been registered')) {
    return 'auth.errorEmailTaken';
  }
  if (msg.includes('password should be at least')) {
    return 'auth.errorPasswordTooShort';
  }
  if (msg.includes('unable to validate email address')) {
    return 'auth.errorInvalidEmail';
  }
  if (msg.includes('email not confirmed')) {
    return 'auth.errorEmailNotConfirmed';
  }
  if (msg.includes('rate limit') || msg.includes('too many')) {
    return 'auth.errorRateLimit';
  }
  return 'auth.errorGeneric';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        setAuthState({ status: 'authenticated', user: session.user, session });
      } else {
        setAuthState({ status: 'guest' });
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session) {
        setAuthState({ status: 'authenticated', user: session.user, session });
      } else {
        setAuthState({ status: 'guest' });
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: mapAuthError(error) };
    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: mapAuthError(error) };
    // If email confirmation is enabled, no session is returned
    if (data.user && !data.session) {
      return { error: null, needsConfirmation: true };
    }
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function isAuthenticated(state: AuthState): state is { status: 'authenticated'; user: User; session: Session } {
  return state.status === 'authenticated';
}
