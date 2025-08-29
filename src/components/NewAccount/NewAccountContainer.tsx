"use client";

import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import SelectTokenTooltip from "../Common/SelectTokenTooltip";
import SelectAddressTooltip from "../Common/SelectAddressTooltip";
import Account from "./Account";
import StatusContainer from "./StatusContainer";

export default function NewAccountContainer() {
  return (
    <div className="flex flex-row gap-1 w-full h-full bg-app-background">
      <Account className="flex-1" />
      <StatusContainer className="w-[400px]" />
    </div>
  );
}
