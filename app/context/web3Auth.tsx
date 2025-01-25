"use client";

import React, { createContext, useContext, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";

const Web3AuthContext = createContext(null);

export const Web3Auth = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [web3Auth, setWeb3Auth] = useState<Web3AuthNoModal | null>(null);
  return (
    <Web3AuthContext.Provider value={{ web3Auth, setWeb3Auth }}>
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => useContext(Web3AuthContext);
