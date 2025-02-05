"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3Auth, useProvider, useLoggedIn } from "../context";
import {
  ticketId_pattern,
  invalid_ticketId_msg,
  invalid_owner_msg,
  chain,
  contract_address,
} from "../constant";
import { createPublicClient, http, custom } from "viem";
import RPC from "./viemRPC";
import { anvil } from "viem/chains";
import ticketNFT from "../../foundry/out/TicketNFT.sol/TicketNFT.json";

export default function Ticket() {
  const router = useRouter();
  const [validatedTicket, setValidatedTicket] = useState<string>("");
  const [cancelledTicket, setCancelledTicket] = useState<string>("");
  const [address, setAddress] = useState<`0x${string}`>("0x");
  const [balance, setBalance] = useState<string>("");
  const [tickets, setTickets] = useState<string[] | null>(null);
  const { provider, setProvider } = useProvider();
  const { web3Auth } = useWeb3Auth();
  const { loggedIn, setLoggedIn } = useLoggedIn();

  const checkProviderAndRPC = () => {
    if (!provider) {
      throw new Error("Provider not initialized yet");
    }
    return new RPC(provider);
  };

  const publicClient = createPublicClient({
    chain,
    transport: chain === anvil ? http() : custom(provider),
  });

  useEffect(() => {
    const init = async () => {
      if (loggedIn) {
        try {
          const rpc = checkProviderAndRPC();
          updateState(rpc);
        } catch (error) {
          throw error;
        }
      } else {
        router.push(`/`);
      }
    };
    init();
  }, [router, loggedIn, provider]);

  const updateState = async (rpc) => { 
    setAddress(await rpc.getAccount());
    setBalance(await rpc.getBalance());
    const ticketIds = await rpc.getMyTickets();
    const validTickets = ticketIds.filter(
      (ticketId: string) => ticketId !== "0",
    );
    setTickets(validTickets.length ? validTickets : null);
  } 

  const addressText = (
    <p
      id="address"
      className="flex items-center justify-center text-foreground gap-2 text-sm sm:text-base h-6 sm:h-6 sm:min-px-5 w-30 sm:w-30 group absolute bottom-12 right-0 m-6 text-2xl"
    >
      Your Address: {address}
    </p>
  );

  const balanceText = (
    <p
      id="balance"
      className="flex items-center justify-center text-foreground gap-2 text-sm sm:text-base h-6 sm:h-6 sm:min-px-5 w-30 sm:w-30 group absolute bottom-6 right-0 m-6 text-2xl"
    >
      Your ETH Balance: {balance}
    </p>
  );

  const ticketText = (
    <p
      id="ticket"
      className="flex items-center justify-center text-foreground gap-2 text-sm sm:text-base h-6 sm:h-6 sm:min-px-5 w-30 sm:w-30 group absolute bottom-0 right-0 m-6 text-2xl"
    >
      Your Tickets: {tickets ? tickets.join(", ") : "None"}
    </p>
  );

  const logout = async () => {
    if (!web3Auth) {
      throw new Error("web3auth not initialized yet");
      return;
    };
    await web3Auth.logout();
    setLoggedIn(false);
    setProvider(null);
  };

  const logoutButton = (
    <button
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-6 sm:h-6 sm:min-px-5 w-20 sm:w-20 group absolute top-0 right-0 m-6 text-2xl"
      aria-label="Logout"
      onClick={logout}
    >
      Logout
    </button>
  );

  const buyTicket = async () => {
    const rpc = checkProviderAndRPC();
    try {
      let debounceTimeout;

      const unwatch = publicClient.watchContractEvent({
        address: contract_address,
        abi: ticketNFT.abi,
        eventName: "TicketBought",
        args: { from: address },
        onLogs: (logs) => {
          clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(() => {
            alert(
              `Ticket ${logs[0].args.tokenId.toString().padStart(4, "0")} bought.`,
            );
            unwatch();
          }, 100);
        },
      });
      const transaction = await rpc.buyTicket();
      console.log("Transaction Mined", transaction);
    } catch (error) {
      throw error;
    } finally { 
      await updateState(rpc);
    };
  };

  const buyTicketButton = (
    <button
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#FFFFCE] text-sm sm:text-base h-10 sm:h-12 sm:min-px-5 w-40 sm:w-40 relative group"
      aria-label="Buy Ticket"
      onClick={buyTicket}
    >
      Buy Ticket
    </button>
  );

  const updateValidatedTicket = (event) => {
    setValidatedTicket(event.target.value);
  };

  const validateTicket = async (event) => {
    if (event.key !== "Enter") return;

    if (!ticketId_pattern.test(validatedTicket)) {
      alert(invalid_ticketId_msg);
      return;
    };

    const ticketId = parseInt(validatedTicket);

    try {
      const rpc = checkProviderAndRPC();
      const isValid = await rpc.isMyTicket(ticketId);
      alert(
        isValid
          ? `Ticket ${validatedTicket} is VALID.`
          : `Ticket ${validatedTicket} is NOT valid.`,
      );
    } catch (error) {
      throw error;
    } finally {
      setValidatedTicket("");
    };
  };

  const validateTicketInput = (
    <input
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#E8FFC4] text-sm sm:text-base h-10 sm:h-12 sm:min-px-5 w-40 sm:w-40 relative group"
      type="text"
      placeholder="Validate Ticket"
      value={validatedTicket}
      onChange={updateValidatedTicket}
      onKeyDown={validateTicket}
    />
  );

  const updateCancelledTicket = (event) => {
    setCancelledTicket(event.target.value);
  };

  const cancelTicket = async (event) => {
    if (event.key !== "Enter") return;

    if (!ticketId_pattern.test(cancelledTicket)) {
      alert(invalid_ticketId_msg);
      return;
    };

    const ticketId = parseInt(cancelledTicket);

    const rpc = checkProviderAndRPC();

    try {
      let debounceTimeout;

      const unwatch = publicClient.watchContractEvent({
        address: contract_address,
        abi: ticketNFT.abi,
        eventName: "TicketCancelled",
        args: { from: address },
        onLogs: (logs) => {
          clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(() => {
            alert(
              `Ticket ${logs[0].args.tokenId.toString().padStart(4, "0")} cancelled.`,
            );
            unwatch();
          }, 100);
        },
      });

      const isValid = await rpc.isMyTicket(ticketId);
      if (!isValid) {
        alert(invalid_owner_msg);
        return;
      }
      const transaction = await rpc.cancelTicket(ticketId);
      console.log("Transaction Mined", transaction);
    } catch (error) {
      throw error;
    } finally {
      setCancelledTicket("");
      updateState(rpc);
    };
  };

  const cancelTicketInput = (
    <input
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#FFDAC8] text-sm sm:text-base h-10 sm:h-12 sm:min-px-5 w-40 sm:w-40 relative group"
      type="text"
      placeholder="Cancel Ticket"
      value={cancelledTicket}
      onChange={updateCancelledTicket}
      onKeyDown={cancelTicket}
    />
  );

  return (
    <div className="flex gap-4 items-center justify-center flex-col sm:flex-col">
      {logoutButton} {/* top right */}
      {buyTicketButton} {/* center top */}
      {validateTicketInput} {/* center center */}
      {cancelTicketInput} {/* center bottom */}
      {addressText} {/* bottom right top */}
      {balanceText} {/* bottom right center */}
      {ticketText} {/* bottom right bottom */}
    </div>
  );
}
