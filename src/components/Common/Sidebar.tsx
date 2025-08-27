import React, { useState } from "react";

const sectionItems = [
  {
    label: "Quick Access",
    description: "Shortcuts to your power tools.",
    menuItems: [
      { icon: "/sidebar/dashboard.svg", label: "Dashboard" },
      { icon: "/sidebar/address-book.svg", label: "Address Book" },
      { icon: "/sidebar/ai-assistant.svg", label: "AI Assistant" },
    ],
  },
  {
    label: "Payments",
    description: "Move assets your way – fast, private.",
    menuItems: [
      { icon: "/sidebar/send.svg", label: "Send" },
      { icon: "/sidebar/swap.svg", label: "Swap" },
      { icon: "/sidebar/batch.svg", label: "Batch", transactionsCount: 10 },
    ],
  },
  {
    label: "Teams",
    description: "Multi-sig? Shared control? It's all here.",
    menuItems: [{ icon: "/sidebar/transaction.svg", label: "Transactions", transactionsCount: 10 }],
  },
];

const SectionItem = ({
  label,
  description,
  menuItems,
  showDivider,
  selectedItem,
  onItemClick,
}: {
  label: string;
  description: string;
  menuItems: { icon: string; label: string; transactionsCount?: number }[];
  showDivider?: boolean;
  selectedItem: string | null;
  onItemClick: (itemLabel: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <span className="text-lg font-bold text-text-primary">{label}</span>
        <span className="text-sm text-text-secondary">{description}</span>
      </div>
      <div className="flex flex-col">
        {menuItems.map(item => (
          <div
            key={item.label}
            className={`flex flex-row items-center gap-3 px-2 py-2 rounded-[12px] cursor-pointer transition-colors justify-between ${
              selectedItem === item.label ? "bg-primary text-white" : "text-text-primary"
            }`}
            onClick={() => onItemClick(item.label)}
          >
            <div className="flex flex-row items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <img
                  src={item.icon}
                  alt={item.label}
                  className="scale-125"
                  style={{ filter: selectedItem === item.label ? "invert(1) brightness(1000%)" : "none" }}
                />
              </div>
              <span
                className={`uppercase ${
                  selectedItem === item.label ? "font-bold text-white" : "font-normal text-text-primary"
                }`}
              >
                {item.label}
              </span>
            </div>
            {item.transactionsCount && item.transactionsCount > 0 && (
              <button className="flex flex-row items-center gap-2 bg-surface-light rounded-lg px-3 py-0.5 border border-divider text-text-primary">
                {item.transactionsCount}
              </button>
            )}
          </div>
        ))}
      </div>
      {showDivider && <div className="w-full h-[1px] my-1 bg-divider" />}
    </div>
  );
};

export default function Sidebar() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleItemClick = (itemLabel: string) => {
    setSelectedItem(itemLabel);
  };

  return (
    <div className="bg-background relative rounded-lg h-screen w-[320px] justify-between flex flex-col">
      <div className="p-3">
        {/* Header */}
        <div className="flex flex-row items-center gap-3">
          <img src="/logo/q3x-logo-icon.svg" alt="logo" className="w-8 h-8" />
          <img src="/logo/q3x-text.svg" alt="logo" className="scale-110" />
          <div className="flex flex-row items-center justify-center rounded-full px-3 py-1 bg-divider">
            <span className="text-sm text-text-secondary">Beta</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] my-3 bg-divider" />

        {/* Menu */}
        <div className="flex flex-col gap-2">
          {sectionItems.map((item, index) => (
            <SectionItem
              key={item.label}
              label={item.label}
              description={item.description}
              menuItems={item.menuItems}
              showDivider={index < sectionItems.length - 1}
              selectedItem={selectedItem}
              onItemClick={handleItemClick}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {/* Request new feature */}
        <div className="px-3">
          <div className="flex flex-row items-center gap-2">
            <div className="flex items-center justify-center rounded-[12px] px-4 py-3 leading-none bg-surface-light">
              <img src="/misc/plus-icon.svg" alt="plus" className="w-4 h-4" />
            </div>
            <div className="flex rounded-[12px] w-full py-3 px-3 leading-none bg-surface-light">
              <span className="text-text-secondary">Request new feature</span>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="flex flex-col">
          <div className="flex items-center px-4 py-3 justify-between bg-surface-blue">
            <div className="flex flex-row items-center gap-2">
              <img src="/logo/icp-avatar.svg" alt="account" className="w-5 h-5" />
              <span className="text-text-secondary">0xBB...37e</span>
              <img src="/misc/copy-icon.svg" alt="copy" className="w-4 h-4" />
            </div>
            <img src="/misc/power-button-icon.svg" alt="logout" className="w-5 h-5" />
          </div>
          <div className="flex rounded-b-lg w-full py-2 px-3 justify-between bg-tertiary">
            <div className="flex flex-row items-center gap-2">
              <img src="/misc/ticket-icon.svg" alt="ticket" className="w-5 h-5" />
              <span className="text-white">Current plan</span>
            </div>
            <div className="flex flex-row items-center rounded-lg px-3 py-1 bg-white">
              <span className="text-text-primary">Free</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
