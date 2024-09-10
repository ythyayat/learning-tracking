"use client";

import { createContext, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export const AuthContext = createContext({});

interface AuthProviderProps {
  children: React.ReactNode;
  accessToken: string;
}

const AuthProvider = ({ accessToken, children }: AuthProviderProps) => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== accessToken) {
        router.refresh();
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, [accessToken, supabase, router]);

  return children;
};

export default AuthProvider;
