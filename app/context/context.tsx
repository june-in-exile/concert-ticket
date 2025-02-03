"use client";

import { ReactNode } from "react";
import { Provider } from "./provider";
import { Web3Auth } from "./web3Auth";
import { LoggedIn } from "./loggedIn";

export const Context = ({ children }: { children: ReactNode }) => {
  return (
    <Provider>
      <Web3Auth>
        <LoggedIn>{children}</LoggedIn>
      </Web3Auth>
    </Provider>
  );
};
