// src/contexts/WalletCanisterContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory } from "@/assets/wallet.did";
import { useInternetIdentity } from "./InternetIdentityContext";
import { useSearchParams } from "next/navigation";
import { useCurrentWallet } from "./CurrentWalletContext";

interface WalletCanisterContextType {
  actor: any | null;
  loading: boolean;
  error: string | null;
  currentCanisterId: string | null;
  initializeActorWithCanister: (canisterId: string) => Promise<any>;
  createWallet: (walletId: string, signers: string[], threshold: number) => Promise<any>;
  getWallet: (walletId: string) => Promise<any>;
  getWalletsForPrincipal: (principal: string) => Promise<string[]>;
  addSigner: (walletId: string, signerPrincipal: string) => Promise<string>;
  removeSigner: (walletId: string, signerPrincipal: string) => Promise<string>;
  setThreshold: (walletId: string, threshold: number) => Promise<string>;
  approveMessage: (walletId: string, messageId: string) => Promise<number>;
  checkCanSign: (walletId: string, messageId: string) => Promise<boolean>;
  signMessage: (walletId: string, messageId: string) => Promise<string>;
}

const WalletCanisterContext = createContext<WalletCanisterContextType | undefined>(undefined);

export const WalletCanisterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { identity } = useInternetIdentity(); // Get identity from II context
  const currentWallet = useCurrentWallet();

  const searchParams = useSearchParams();
  const canisterIdFromUrl = searchParams.get("canisterid");

  const [actor, setActor] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCanisterId, setCurrentCanisterId] = useState<string | null>(null);

  // Auto-initialize when identity changes
  useEffect(() => {
    console.log("WalletCanisterContext identity changed:", canisterIdFromUrl);
    if (identity && !actor) {
      initializeActor(identity);
    } else if (!identity) {
      setActor(null);
      setCurrentCanisterId(null);
    }
  }, [identity, canisterIdFromUrl, actor]);

  const initializeActor = async (identityToUse = identity) => {
    if (!identityToUse) return;

    try {
      setLoading(true);
      setError(null);

      const agent = await HttpAgent.create({
        host: "http://localhost:4943",
        identity: identityToUse,
      });

      if (process.env.NODE_ENV === "development") {
        await agent.fetchRootKey();
      }

      const targetCanisterId = canisterIdFromUrl || currentCanisterId || "ulvla-h7777-77774-qaacq-cai";

      const walletActor = Actor.createActor(idlFactory, {
        agent,
        canisterId: Principal.fromText(targetCanisterId),
      });

      setActor(walletActor);
      setCurrentCanisterId(targetCanisterId);
      console.log("Wallet actor initialized successfully");
    } catch (err) {
      console.log("Failed to initialize wallet actor:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const initializeActorWithCanister = async (canisterId: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log("principal: ", identity?.getPrincipal().toText());
      console.log("CanisterId: ", canisterId);

      if (!identity) {
        throw new Error("No identity available");
      }

      const agent = await HttpAgent.create({
        host: "http://localhost:4943",
        identity,
      });

      if (process.env.NODE_ENV === "development") {
        await agent.fetchRootKey();
      }

      const walletActor = Actor.createActor(idlFactory, {
        agent,
        canisterId: Principal.fromText(canisterId),
      });

      setActor(walletActor);
      setCurrentCanisterId(canisterId);
      console.log(`Wallet actor initialized with canister: ${canisterId}`);
      return walletActor;
    } catch (err) {
      console.log("Failed to initialize wallet actor with canister:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async (walletId: string, signers: string[], threshold: number) => {
    if (!actor) throw new Error("Actor not initialized");

    try {
      const signerPrincipals = signers.map(signer => Principal.fromText(signer));
      const result = await actor.create_wallet(walletId, signerPrincipals, threshold);
      console.log("Create wallet result:", result);
      return result;
    } catch (err) {
      console.log("Failed to create wallet:", err);
      throw err;
    }
  };

  const getWallet = async (walletId: string) => {
    if (!actor) throw new Error("Actor not initialized");

    try {
      const result = await actor.get_wallet(walletId);
      console.log("Get wallet result:", result);
      console.log("Get wallet result:", result[0]?.message_queue?.[0]);
      return result;
    } catch (err) {
      console.log("Failed to get wallet:", err);
      throw err;
    }
  };

  const getWalletsForPrincipal = async (principal: string) => {
    if (!actor) throw new Error("Actor not initialized");

    try {
      const principalObj = Principal.fromText(principal);
      const result = await actor.get_wallets_for_principal(principalObj);
      console.log("Get wallets for principal result:", result);
      return result;
    } catch (err) {
      console.log("Failed to get wallets for principal:", err);
      throw err;
    }
  };

  const addSigner = async (walletId: string, signerPrincipal: string) => {
    if (!actor) throw new Error("Actor not initialized");

    try {
      const principal = Principal.fromText(signerPrincipal);
      const result = await actor.add_signer(walletId, principal);

      if ("Ok" in result) {
        console.log("Signer added successfully:", result.Ok);
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.log("Failed to add signer:", error);
      throw error;
    }
  };

  const removeSigner = async (walletId: string, signerPrincipal: string) => {
    if (!actor) throw new Error("Actor not initialized");

    try {
      const principal = Principal.fromText(signerPrincipal);
      console.log("🚀 ~ removeSigner ~ signerPrincipal:", signerPrincipal);
      const result = await actor.remove_signer(walletId, principal);

      if ("Ok" in result) {
        console.log("Signer removed successfully:", result.Ok);
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.log("Failed to remove signer:", error);
      throw error;
    }
  };

  const setThreshold = async (walletId: string, threshold: number) => {
    if (!actor) throw new Error("Actor not initialized");

    try {
      const result = await actor.set_threshold(walletId, threshold);

      if ("Ok" in result) {
        console.log("Threshold updated successfully:", result.Ok);
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.log("Failed to set threshold:", error);
      throw error;
    }
  };

  const approveMessage = async (walletId: string, messageId: string) => {
    if (!actor) throw new Error("Actor not initialized");

    try {
      const result = await actor.approve(walletId, messageId);

      if ("Ok" in result) {
        console.log("Message approved, current approvals:", result.Ok);
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.log("Failed to approve message:", error);
      throw error;
    }
  };

  const checkCanSign = async (walletId: string, messageId: string) => {
    if (!actor) throw new Error("Actor not initialized");

    try {
      const canSign = await actor.can_sign(walletId, messageId);
      console.log("Can sign message:", canSign);
      return canSign;
    } catch (error) {
      console.log("Failed to check can_sign:", error);
      return false;
    }
  };

  const signMessage = async (walletId: string, messageId: string) => {
    if (!actor) throw new Error("Actor not initialized");

    try {
      const result = await actor.sign(walletId, messageId);

      if ("Ok" in result) {
        console.log("Message signed successfully:", result.Ok);
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.log("Failed to sign message:", error);
      throw error;
    }
  };

  const contextValue: WalletCanisterContextType = {
    actor,
    loading,
    error,
    currentCanisterId,
    initializeActorWithCanister,
    createWallet,
    getWallet,
    getWalletsForPrincipal,
    addSigner,
    removeSigner,
    setThreshold,
    approveMessage,
    checkCanSign,
    signMessage,
  };

  return <WalletCanisterContext.Provider value={contextValue}>{children}</WalletCanisterContext.Provider>;
};

export const useWalletCanister = () => {
  const context = useContext(WalletCanisterContext);
  if (context === undefined) {
    throw new Error("useWalletCanister must be used within a WalletCanisterProvider");
  }
  return context;
};
