"use client";

import { ReactNode } from "react";
import { Provider } from "./provider";
import { Web3Auth } from "./web3Auth";
import { LoginMethod } from "./loginMethod";

export const Context = ({ children }: { children: ReactNode }) => {
  return (
    <Provider>
      <Web3Auth>
        <LoginMethod>{children}</LoginMethod>
      </Web3Auth>
    </Provider>
  );
};
