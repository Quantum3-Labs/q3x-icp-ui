"use client";

import React, { useState } from "react";
import Account from "./Account";
import StatusContainer from "./StatusContainer";
import SignersConfirmations from "./SignersConfirmations";
import { useWalletCanister } from "@/hooks/useWalletCanister";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Principal } from "@dfinity/principal";
import { createWalletAPI } from "@/services/api";
import { getAccountAddressFromPrincipal } from "@/utils/helper";
import SuccessScreen from "../Account/SuccessScreen";

export type SignerData = Array<{ name: string; address: string }>;

export interface WalletData {
  signers: SignerData;
  threshold: number;
}
export default function NewAccountContainer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [accountName, setAccountName] = useState("");
  const [walletData, setWalletData] = useState<WalletData>({ signers: [], threshold: 1 });

  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdWalletInfo, setCreatedWalletInfo] = useState<{
    name: string;
    canisterId: string;
    accountAddress: string;
  } | null>(null);

  const { isAuthenticated, identity, principal } = useInternetIdentity();
  const { actor, error, createWallet, initializeActorWithCanister } = useWalletCanister();

  const handleCreateWallet = async () => {
    if (!actor || !accountName.trim() || walletData.signers.length === 0) {
      setCreateError("Missing required  data");
      return;
    }

    try {
      setIsCreating(true);
      setCreateError(null);
      setLoading(true);

      // Convert string addresses to Principal
      console.log("walletData:", walletData);
      const signerPrincipals = walletData.signers.map(s => Principal.fromText(s.address.trim()));
      const creatorPrincipal = walletData.signers[0].address;

      // Step 1: Call backend to deploy canister
      const backendResponse = await createWalletAPI({
          name: accountName,
          signers: walletData.signers.map(s => s.address), // Principal strings
          creatorPrincipal: creatorPrincipal,
        });
      // const backendResponse = {
      //   data: {
      //     canisterId: "vg3po-ix777-77774-qaafa-cai",
      //   },
      // };
      console.log("🚀 ~ handleCreateWallet ~ backendResponse:", backendResponse);

      // Step 2: Initialize actor with new canister ID
      const newActor = await initializeActorWithCanister(backendResponse.data.canisterId);
      console.log("🚀 ~ handleCreateWallet ~ newActor:", newActor)

      // Step 3: Call canister create_wallet
      const result = await newActor.create_wallet(
        accountName, // wallet_id: string
        signerPrincipals, // signers: Principal[]
        walletData.threshold, // threshold: number
      );
      console.log("Create wallet result:", result);

      // Handle Result type
      if ("Ok" in result) {
        const accountAddress = getAccountAddressFromPrincipal(backendResponse.data.canisterId);

        setCreatedWalletInfo({
          name: accountName,
          canisterId: backendResponse.data.canisterId,
          accountAddress,
        });
        console.log("Wallet created successfully");
        setCreateSuccess(true);
        setCurrentStep(3); // move to final step
        setLoading(false);
      } else {
        setCreateError(result.Err);
      }
    } catch (err) {
      console.log("Failed to create wallet:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleNextStep = () => {
    if (accountName.trim()) {
      setCurrentStep(2);
    }
  };

  const handleGoBack = () => {
    setCurrentStep(1);
  };

  const handleSignersNext = (data: WalletData) => {
    console.log("🚀 ~ handleSignersNext ~ data:", data);
    setWalletData(data);
    setCurrentStep(3); // Will be create wallet step
  };

  const handleAccountNameChange = (name: string) => {
    setAccountName(name);
  };

  if (currentStep === 3 && createdWalletInfo) {
    return (
      <div className="flex flex-row gap-1 w-full h-full bg-app-background">
        <SuccessScreen walletInfo={createdWalletInfo} className="w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-1 w-full h-full bg-app-background">
      {currentStep === 1 ? (
        <Account
          className="flex-1"
          onAccountNameChange={handleAccountNameChange}
          onNextStep={handleNextStep}
          accountName={accountName}
        />
      ) : (
        <SignersConfirmations onGoBack={handleGoBack} onNextStep={handleSignersNext} />
      )}

      <StatusContainer
        className="w-[400px]"
        accountName={accountName || "Your account name"}
        currentStep={currentStep}
        walletData={walletData}
        onCreateWallet={handleCreateWallet}
        loading={loading}
      />
    </div>
  );
}
