'use client'
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  accessToken: string | null;
  userId: string | null;
  userName: string | null;
  userLoading: boolean;
  isAdmin: boolean | null;
  accessLevel: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  setUserId: (id: string | null) => void; 
  setUserName: (name: string | null) => void;
  setIsAdmin: (value: boolean | null) => void;
  setAccessLevel: (value: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  userId: null,
  userName: null,
  isAdmin: null,
  accessLevel: null,
  setAccessToken: () => {},
  logout: () => {},
  userLoading: false,
  setUserId: () => {},
  setUserName: () => {},
  setIsAdmin: () => {},
  setAccessLevel: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [accessLevel, setAccessLevel] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
    } else {
      setUserLoading(false); 
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      setUserLoading(true);
      fetch("https://backend-django-2-7qpl.onrender.com/api/funcionarios/me/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserId(data.id);
          setUserName(data.nome);
          const detectedLevel = data?.is_admin
            ? "admin"
            : (data?.nivel_acesso || data?.role || "funcionario");
          setIsAdmin(!!data?.is_admin);
          setAccessLevel(typeof detectedLevel === "string" ? detectedLevel : "funcionario");
        })
        .catch((err) => {
          console.error(err);
          setAccessToken(null); // token inválido
        })
        .finally(() => {
          setUserLoading(false);
        });
    }
  }, [accessToken]);

  const logout = () => {
    localStorage.removeItem("access_token");
    setAccessToken(null);
    setUserId(null);
    setUserName(null);
    setIsAdmin(null);
    setAccessLevel(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userId,
        userName,
        isAdmin,
        accessLevel,
        setAccessToken,
        logout,
        userLoading,
        setUserId,
        setUserName,
        setIsAdmin,
        setAccessLevel
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
