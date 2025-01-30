"use client";

import { ReactNode } from "react";
import { Address } from "./address";
import { Provider } from "./provider";
import { Web3Auth } from "./web3Auth";
import { LoggedIn } from "./loggedIn";
import { TicketNFT } from "./ticketNFT";

export const Context = ({ children }: { children: ReactNode }) => {
  return (
    <Address>
      <Provider>
        <Web3Auth>
          <LoggedIn>
            <TicketNFT>{children}</TicketNFT>
          </LoggedIn>
        </Web3Auth>
      </Provider>
    </Address>
  );
};
