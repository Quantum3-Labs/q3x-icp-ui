// src/contexts/InternetIdentityContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Identity } from "@dfinity/agent";
import { useRouter } from "next/navigation";

interface InternetIdentityContextType {
  isAuthenticated: boolean;
  identity: Identity | null;
  principal: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const InternetIdentityContext = createContext<InternetIdentityContextType | undefined>(undefined);

export const InternetIdentityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuthClient();
  }, []);

  const initAuthClient = async () => {
    try {
      const client = await AuthClient.create({});
      setAuthClient(client);

      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);

      let identity;
      let principal;
      if (isAuthenticated) {
        identity = client.getIdentity();
        principal = identity.getPrincipal().toString();
        setIdentity(identity);
        setPrincipal(principal);
      }
    } catch (error) {
      console.log("Failed to initialize auth client:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    if (!authClient) return;

    try {
      setLoading(true);

      await authClient.login({
        identityProvider: "http://uxrrr-q7777-77774-qaaaq-cai.localhost:4943/",
        onSuccess: () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal().toString();
          console.log("🚀 ~ login ~ identity:", identity);
          console.log("🚀 ~ login ~ principal:", principal);

          setIdentity(identity);
          setPrincipal(principal);
          setIsAuthenticated(true);
        },
        onError: error => {
          console.log("Login failed:", error);
        },
      });

      router.push("/dashboard");
    } catch (error) {
      console.log("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!authClient) return;

    try {
      await authClient.logout();
      setIdentity(null);
      setPrincipal(null);
      setIsAuthenticated(false);
      localStorage.clear();
      sessionStorage.clear();
      if ("indexedDB" in window) {
        try {
          const databases = await indexedDB.databases();
          databases.forEach(db => {
            if (db.name) indexedDB.deleteDatabase(db.name);
          });
        } catch (e) {
          console.warn("Could not clear IndexedDB:", e);
        }
      }
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const contextValue: InternetIdentityContextType = {
    isAuthenticated,
    identity,
    principal,
    login,
    logout,
    loading,
  };

  return <InternetIdentityContext.Provider value={contextValue}>{children}</InternetIdentityContext.Provider>;
};

export const useInternetIdentity = () => {
  const context = useContext(InternetIdentityContext);
  if (context === undefined) {
    throw new Error("useInternetIdentity must be used within an InternetIdentityProvider");
  }
  return context;
};
