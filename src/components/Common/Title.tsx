"use client";

import React from "react";

interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  return (
    <div className={`flex gap-1.5 items-center justify-start w-full`}>
      {/* Main Title Container */}
      <div className="flex gap-[7px] items-center px-3 py-2 rounded-[10px] bg-background border border-secondary min-w-0 flex-1">
        {/* Icon */}
        <img src="/arrow/filled-blue-arrow-right.svg" alt="icon" className="w-5 h-5" />

        {/* Title Text */}
        <div className="text-[17px] text-[#363636] uppercase tracking-[-0.51px] leading-none whitespace-nowrap">
          {text}
        </div>
      </div>
    </div>
  );
};

export default Title;
