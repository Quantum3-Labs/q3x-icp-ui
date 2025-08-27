"use client";
import React from "react";
import Sidebar from "./Common/Sidebar";
import Title from "./Common/Title";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row gap-2 pr-2">
      <Sidebar />
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row gap-1 pt-1">
          <Title text="Dashboard" />
          <div className="flex flex-row gap-2 w-[150px] justify-center items-center bg-secondary rounded-lg">
            <img src="/misc/coin-icon.gif" alt="portfolio" className="w-4 h-4" />
            <span className="text-text-primary">PORTFOLIO</span>
          </div>
          <div className="flex flex-row gap-2 w-[50px] justify-center items-center bg-secondary rounded-lg">
            <img src="/misc/bell-icon.gif" alt="notification" className="w-5 h-5" />
          </div>
        </div>

        <div className="flex flex-col w-full h-[94%] bg-background rounded-lg p-2">{children}</div>
      </div>
    </div>
  );
}
