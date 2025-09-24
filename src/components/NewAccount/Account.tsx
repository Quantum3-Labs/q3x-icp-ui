"use client";

import React, { useState, useEffect } from "react";
import PrimaryButton from "../Common/Button/PrimaryButton";

type STEP = "BASIC_SETUP" | "SIGNERS_AND_CONFIRMATIONS" | "SUCCESS";


interface Signer {
  id: string;
  name: string;
  address: string;
  isValid: boolean;
}

interface AccountProps {
  className?: string;
  onStepChange?: (step: "BASIC_SETUP" | "SIGNERS_AND_CONFIRMATIONS" | "SUCCESS") => void;
  onAccountNameChange?: (name: string) => void;
  onSignersCountChange?: (count: number) => void;
  onSignersChange?: (signers: Signer[]) => void;
  onThresholdChange?: (value: string) => void;
}

export default function Account({ 
  className, 
  onStepChange, 
  onAccountNameChange, 
  onSignersCountChange, 
  onSignersChange,
  onThresholdChange 
}: AccountProps) {
  const [showAddressTooltip, setShowAddressTooltip] = useState(false);
  const [step, setStep] = useState<STEP>("BASIC_SETUP");

  const [selectedAddress, setSelectedAddress] = useState<{
    id: string;
    name: string;
    company: string;
    address: string;
    icon: string;
  } | null>(null);

  const handleAddressSelect = (address: any) => {
    setSelectedAddress(address);
    setAddress(address.address);
    setShowAddressTooltip(false);
  };

  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [threshold, setThreshold] = useState("");
  
  const [signers, setSigners] = useState<Array<{
    id: string;
    name: string;
    address: string;
    isValid: boolean;
  }>>([
    {
      id: "1",
      name: "",
      address: "",
      isValid: true
    }
  ]);

  // Update parent component when values change
  useEffect(() => {
    onAccountNameChange?.(address);
  }, [address, onAccountNameChange]);

  useEffect(() => {
    onSignersCountChange?.(signers.length);
    onSignersChange?.(signers);
  }, [signers, onSignersCountChange, onSignersChange]);

  useEffect(() => {
    onThresholdChange?.(threshold);
  }, [threshold, onThresholdChange]);

  const removeSigner = (id: string) => {
    const remainingSigners = signers.filter(signer => signer.id !== id);
    setSigners(updateSignerValidation(remainingSigners));
  };

  const validateSigner = (signer: { id: string; name: string; address: string }, allSigners: Array<{ id: string; name: string; address: string }>) => {
    // Empty signers are always valid
    if (signer.name.trim() === '' && signer.address.trim() === '') {
      return true;
    }
    
    // If only one field is filled, it's valid (no duplicate checking for partial entries)
    if (signer.name.trim() === '' || signer.address.trim() === '') {
      return true;
    }
    
    // Only check for duplicates when both fields have content
    const otherSigners = allSigners.filter(s => s.id !== signer.id);
    const hasDuplicateName = otherSigners.some(s => s.name.toLowerCase() === signer.name.toLowerCase() && s.name.trim() !== '');
    const hasDuplicateAddress = otherSigners.some(s => s.address.toLowerCase() === signer.address.toLowerCase() && s.address.trim() !== '');
    return !hasDuplicateName && !hasDuplicateAddress;
  };

  const updateSignerValidation = (updatedSigners: Array<{ id: string; name: string; address: string; isValid: boolean }>) => {
    return updatedSigners.map(signer => ({
      ...signer,
      isValid: validateSigner(signer, updatedSigners)
    }));
  };

  const addNewSigner = () => {
    const newSigner = {
      id: Date.now().toString(),
      name: "",
      address: "",
      isValid: true
    };
    const updatedSigners = [...signers, newSigner];
    setSigners(updateSignerValidation(updatedSigners));
  };

  return (
    <div
      className={`overflow-hidden relative w-full h-full flex flex-col rounded-lg bg-background ${className} border border-divider`}
    >
      {/* Earth background images */}
      <div className="w-full relative">
        <div className="absolute top-0 flex h-[736.674px] items-center justify-center left-1/2 translate-x-[-50%] w-[780px] pointer-events-none">
          <img src="/send/top-globe.svg" alt="Bottom globe" className="w-full h-full" />
        </div>
        <div className="absolute top-10 left-0 right-0 h-[400px] w-full bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
      </div>

      {/* Main content */}
      <div className={`flex flex-col gap-[20px] items-center justify-start flex-1 px-4 relative z-10 transition-all duration-700 ease-in-out ${step === "SIGNERS_AND_CONFIRMATIONS" ? "mt-20" : "mt-50"}`}>
        {/* Title section */}
        <div className="flex flex-col items-center justify-center pb-8">
          {step === "SUCCESS" ? <>
            <div className="text-[#545454] text-6xl text-center font-bold uppercase w-full">successfully</div>
            <div className="text-[#545454] text-6xl text-center font-bold uppercase w-full">created</div>
          </> : <div className="text-[#545454] text-6xl text-center font-bold uppercase w-full">create new</div>}
          <div className="flex gap-[5px] items-center justify-center w-full">
            <div className="text-[#545454] text-6xl text-center font-bold uppercase">acc</div>
            <div className="h-[48px] relative rounded-full w-[125.07px] border-[4.648px] border-primary border-solid"></div>
            <div className="text-[#545454] text-6xl text-center font-bold uppercase">unt</div>
          </div>
        </div>
        {/* Step content */}
        {step === "SUCCESS" ? null : <div className="flex items-center justify-center w-full max-w-2xl flex-col text-center">
          <span className="text-text-primary uppercase text-[26px] font-bold">
            {step === "BASIC_SETUP" ? "1. Basic setup" : "2. Signers & confirmations"}
          </span>
          {step === "BASIC_SETUP" ? (
            <>
              <span className="text-text-secondary text-[16px]">
                This is the basic setup of the account, please enter the account name in the box below.
              </span>
              <span className="text-text-secondary text-[16px]">
                Or click the generate button next to it to automatically generate the account name.
              </span>
            </>
          ) : (
            <>
              <span className="text-text-primary text-[16px] uppercase text-left w-full font-bold">
              account signers
              </span>
              <span className="text-text-secondary text-[16px] text-left">
              Addresses added to the signers list below will play an important role in approving future transactions as team members.
              </span>
            </>
          )}
        </div>}

        {/* Address input or Signers list */}
        {step === "SUCCESS" ? null : <>
        {step === "BASIC_SETUP" ? (
          <div className="flex flex-col gap-[5px] items-center w-full max-w-lg">
            <div className="flex gap-2.5 items-center w-full">
              <div className="bg-white grow relative rounded-[16px] border border-[#e0e0e0] shadow-[0px_0px_10.3px_0px_rgba(135,151,255,0.14),0px_0px_89.5px_0px_rgba(0,0,0,0.05)] p-3 flex justify-between">
                <input
                  type="text"
                  placeholder="Your account name"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="text-text-secondary text-[16px] outline-none placeholder:text-text-secondary flex-1"
                />
                {selectedAddress?.name && (
                  <div className="text-text-secondary text-[16px] flex-1 flex items-center justify-end">
                    [<span className="text-primary">{selectedAddress.name}</span>]
                  </div>
                )}
              </div>
              <img
                src="/swap/swap-icon.svg"
                alt="Address book"
                className="w-5 h-5 cursor-pointer"
                data-tooltip-id="address-selector-tooltip"
                onClick={() => setShowAddressTooltip(true)}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-[5px] items-start w-full max-w-[680px]">
            {signers.map((signer) => (
              <div key={signer.id} className="grid grid-cols-[0.6fr_2fr_auto] gap-[10px] items-center w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Signer name"
                    value={signer.name}
                    onChange={(e) => {
                      const updatedSigners = signers.map(s => 
                        s.id === signer.id ? { ...s, name: e.target.value } : s
                      );
                      setSigners(updateSignerValidation(updatedSigners));
                    }}
                    className={`w-full bg-white rounded-[16px] border p-3 shadow-[0px_0px_10.3px_0px_rgba(135,151,255,0.14),0px_0px_89.5px_0px_rgba(0,0,0,0.05)] text-[16px] outline-none placeholder:text-text-secondary ${!signer.isValid ? 'border-red-500 text-red-500' : 'border-[#e0e0e0] text-text-primary'}`}
                  />
                  {!signer.isValid && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4">
                      <img src="/misc/info-icon.svg" alt="Error" className="w-full h-full" />
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Signer address"
                  value={signer.address}
                  onChange={(e) => {
                    const updatedSigners = signers.map(s => 
                      s.id === signer.id ? { ...s, address: e.target.value } : s
                    );
                    setSigners(updateSignerValidation(updatedSigners));
                  }}
                  className="w-full bg-white rounded-[16px] border border-[#e0e0e0] p-3 shadow-[0px_0px_10.3px_0px_rgba(135,151,255,0.14),0px_0px_89.5px_0px_rgba(0,0,0,0.05)] text-[16px] outline-none placeholder:text-text-secondary text-text-primary"
                />
                <div className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity" onClick={() => removeSigner(signer.id)}>
                  <img src="/misc/red-trashcan-icon.svg" alt="Remove" className="w-full h-full" />
                </div>
              </div>
            ))}

            <button
              onClick={addNewSigner}
              className="ml-0.5 bg-gradient-to-b from-[#9c9c9c] to-[#303030] px-5 py-2 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(131,131,131,0.5),0px_0px_0px_1px_#a1a1a1] text-white text-[16px] font-semibold cursor-pointer"
            >
              New Signer
            </button>

         <div className="mt-2 flex items-center justify-center w-full max-w-2xl flex-col text-center">
              <span className="text-text-primary text-[16px] uppercase text-left w-full font-bold">
              Threshold
              </span>
              <span className="text-text-secondary text-[16px] text-left">
              This is the minimum number of confirmations required for a transaction to go through. Anyone on the list can approve the transaction as long as the minimum number of approvals is met.
              </span>
        </div>
        <div className="flex gap-2.5 items-center w-full flex-row justify-center">
        <div className="bg-white grow relative rounded-[16px] border border-[#e0e0e0] shadow-[0px_0px_10.3px_0px_rgba(135,151,255,0.14),0px_0px_89.5px_0px_rgba(0,0,0,0.05)] p-3 flex justify-between max-w-[200px]">
                <input
                  type="text"
                  placeholder="Enter threshold number"
                  value={threshold}
                  onChange={e => setThreshold(e.target.value)}
                  className="text-text-secondary text-[16px] outline-none placeholder:text-text-secondary flex-1"
                />         
              </div>
              <span className="text-text-secondary text-[16px] text-left">/out of {signers.length} signers</span>
        </div>
          </div>
        )}
        </>}

        {/* Action buttons */}
        {step === "SUCCESS" ? null : <div className="flex gap-2 items-center justify-center w-full">
          {step === "SIGNERS_AND_CONFIRMATIONS" && (
            <button
            onClick={() => {
              setStep("BASIC_SETUP");
              onStepChange?.("BASIC_SETUP");
            }}
            className="ml-0.5 bg-gradient-to-b from-[#9c9c9c] to-[#303030] px-5 py-2 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(131,131,131,0.5),0px_0px_0px_1px_#a1a1a1] text-white text-[16px] font-semibold cursor-pointer"
          >
            Go Back
          </button>
          )}
          <PrimaryButton 
            text={step === "BASIC_SETUP" ? "Next Step" : step === "SIGNERS_AND_CONFIRMATIONS" ? "Create Account" : "Success"} 
            onClick={() => {
              if (step === "BASIC_SETUP") {
                setStep("SIGNERS_AND_CONFIRMATIONS");
                onStepChange?.("SIGNERS_AND_CONFIRMATIONS");
              } else {
                setStep("SUCCESS");
                onStepChange?.("SUCCESS");
              }
            }} 
          />
        </div>}
      </div>
    </div>
  );
}
