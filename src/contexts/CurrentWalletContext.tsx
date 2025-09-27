"use client";

import { getWalletByCanisterId, Wallet } from "@/services/api";
import { useSearchParams } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

interface CurrentWalletData {
  canisterId: string;
  name: string;
}

interface CurrentWalletContextType {
  currentWallet: CurrentWalletData | null;
  setCurrentWallet: (wallet: CurrentWalletData | null) => void;
}

export const CurrentWalletContext = createContext<Wallet | null>(null);

export const CurrentWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const searchParams = useSearchParams();
  const canisterId = searchParams.get("canisterid");
  console.log("🚀 ~ CurrentWalletProvider ~ canisterId:", canisterId)
  // const [currentWallet, setCurrentWallet] = useState<CurrentWalletData | null>(null);

  const [walletData, setWalletData] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (canisterId) {
      fetchWalletData(canisterId);
    }
  }, [canisterId]); // URL change → refetch

  // const contextValue: CurrentWalletContextType = {
  //   currentWallet,
  //   setCurrentWallet,
  // };

  const fetchWalletData = async (id: string) => {
    setLoading(true);
    const data = await getWalletByCanisterId(id);
    setWalletData(data);
    setLoading(false);
  };

  return <CurrentWalletContext.Provider value={walletData}>{children}</CurrentWalletContext.Provider>;
};

export const useCurrentWallet = () => {
  const context = useContext(CurrentWalletContext);
  if (context === undefined) {
    throw new Error("useCurrentWallet must be used within a CurrentWalletProvider");
  }
  return context;
};
