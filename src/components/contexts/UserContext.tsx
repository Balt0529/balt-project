import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "@/libs/supabase";
import { Session, User } from "@supabase/supabase-js";

type UserContextType = {
  user: User | null;
  session: Session | null;
};

const UserContext = createContext<UserContextType>({ user: null, session: null });

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchUserSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      setSession(data.session);
      setUser(data.session?.user || null);
    };

    fetchUserSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, session }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
