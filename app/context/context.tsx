"use client";

import { ReactNode } from "react";
import { Address } from "./address";
import { Provider } from "./provider";
import { Web3Auth } from "./web3Auth";
import { TicketNFT } from "./ticketNFT";

export const Context = ({ children }: { children: ReactNode }) => {
  return (
    <Address>
      <Provider>
        <Web3Auth>
          <TicketNFT>{children}</TicketNFT>
        </Web3Auth>
      </Provider>
    </Address>
  );
};
