"use client";

import InfoCardContainer from "./InfoCardContainer";
import React from "react";
import TransactionRow from "./TransactionRow";
import { TransactionType } from "./TransactionRow";

// Header Component
function Header() {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="text-[55.78px] font-semibold text-text-primary uppercase leading-none">
        <p>Dashboard</p>
      </div>
      <div className="bg-white rounded-xl w-[552px] relative">
        <div className="flex items-center gap-2 pl-1 pr-2 py-1 w-full">
          <div className="bg-surface-light p-2 rounded-lg shadow-[0px_0px_4px_0px_rgba(18,18,18,0.1)]">
            <img src="/misc/search-icon.svg" alt="search" className="w-4 h-4" />
          </div>
          <input
            type="text"
            className="flex-1 text-base text-text-secondary leading-none bg-transparent outline-none placeholder-text-secondary"
            placeholder="Enter address"
            aria-label="Enter address"
          />
          <div className="flex items-center justify-center gap-2 px-1.5 py-1.5 rounded-md shadow-[0px_0px_0px_1px_rgba(0,0,0,0.11),0px_1px_4.2px_-1px_rgba(0,0,0,0.25)] relative">
            <span className="text-[11px] font-medium text-text-secondary leading-none">
              <p>⌘ K</p>
            </span>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 border border-[#e0e0e0] rounded-xl pointer-events-none shadow-[0px_0px_10.3px_0px_rgba(135,151,255,0.14),0px_0px_89.5px_0px_rgba(0,0,0,0.05)]"
        />
      </div>
    </div>
  );
}

export default function DashboardContainer() {
  return (
    <div className="flex flex-col gap-5 p-2">
      <div className="flex flex-row h-[100px] w-full justify-between">
        <div className="w-full relative">
          <img src="/misc/clock.svg" alt="clock" className="w-[150px]" />
          <div className="absolute -bottom-5 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        </div>
        <InfoCardContainer />
      </div>

      {/* header */}
      <Header />

      {/* body */}
      <div className="content-stretch flex flex-col gap-0.5 items-start justify-start relative size-full">
        <TransactionRow
          type={TransactionType.SEND}
          amount="$1,000,000,000 USDT"
          to="Tim Cook"
          showButtons={true}
          showChevron={true}
        />

        <TransactionRow
          type={TransactionType.SWAP}
          amount="$1,000,000,000 USDT"
          to="10 BTC"
          showButtons={true}
          showChevron={true}
        />

        <TransactionRow type={TransactionType.THRESHOLD} showButtons={true} showChevron={true} />

        <TransactionRow
          type={TransactionType.ADD_SIGNER}
          signers={["0xd...s78", "0xe...aK8"]}
          status="success"
          showButtons={false}
          showChevron={false}
          showExternalLink={true}
        />

        <TransactionRow
          type={TransactionType.BATCH}
          status="success"
          showButtons={false}
          showChevron={false}
          showExternalLink={true}
        />

        <TransactionRow
          type={TransactionType.REMOVE_SIGNER}
          signers={["0xB...bf8", "0xE...aS5"]}
          status="failed"
          showButtons={false}
          showChevron={false}
          showExternalLink={true}
        />
      </div>
    </div>
  );
}
