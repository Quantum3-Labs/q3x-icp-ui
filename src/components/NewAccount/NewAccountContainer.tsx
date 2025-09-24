"use client";

import React, { useState } from "react";
import Account from "./Account";
import StatusContainer from "./StatusContainer";

type STEP = "BASIC_SETUP" | "SIGNERS_AND_CONFIRMATIONS" | "SUCCESS";

interface Signer {
  id: string;
  name: string;
  address: string;
  isValid: boolean;
}

export default function NewAccountContainer() {
  const [step, setStep] = useState<STEP>("BASIC_SETUP");
  const [accountName, setAccountName] = useState("");
  const [signersCount, setSignersCount] = useState(1);
  const [signers, setSigners] = useState<Signer[]>([]);
  const [threshold, setThreshold] = useState("");

  const handleStepChange = (newStep: STEP) => {
    setStep(newStep);
  };

  const handleAccountNameChange = (name: string) => {
    setAccountName(name);
  };

  const handleSignersCountChange = (count: number) => {
    setSignersCount(count);
  };

  const handleSignersChange = (newSigners: Signer[]) => {
    setSigners(newSigners);
  };

  const handleThresholdChange = (value: string) => {
    setThreshold(value);
  };

  return (
    <div className="flex flex-row gap-1 w-full h-full bg-app-background">
      <Account 
        className="flex-1" 
        onStepChange={handleStepChange}
        onAccountNameChange={handleAccountNameChange}
        onSignersCountChange={handleSignersCountChange}
        onSignersChange={handleSignersChange}
        onThresholdChange={handleThresholdChange}
      />
      <StatusContainer 
        className={step === "SUCCESS" ? "w-[0px]" : "w-[400px]"}
        step={step}
        accountName={accountName}
        signersCount={signersCount}
        signers={signers}
        threshold={threshold}
        onNextStep={() => setStep(step === "BASIC_SETUP" ? "SIGNERS_AND_CONFIRMATIONS" : "BASIC_SETUP")}
      />
    </div>
  );
}
