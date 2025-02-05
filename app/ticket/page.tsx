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

  const checkProviderAndRPC = async () => {
    if (!provider) {
      throw new Error("Provider not initialized yet");
    }
    return new RPC(provider);
  };

  const checkProviderAndPublicClient = async () => {
    if (!provider) {
      throw new Error("Provider not initialized yet");
    }
    return createPublicClient({
      chain,
      transport: chain === anvil ? http() : custom(provider),
    });
  };

  useEffect(() => {
    const init = async () => {
      if (loggedIn) {
        try {
          const rpc = await checkProviderAndRPC();
          await updateState(rpc);
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
    const accounts = await rpc.getAccounts();
    setAddress(accounts[0]);

    setBalance(await rpc.getBalance());

    const ticketIds = await rpc.getMyTickets();
    const validTickets = await ticketIds.filter(
      (ticketId: string) => ticketId !== "0",
    );
    setTickets(validTickets.length ? validTickets : null);
  };

  const logout = async () => {
    if (!web3Auth) {
      throw new Error("web3auth not initialized yet");
      return;
    }
    await web3Auth.logout();
    setLoggedIn(false);
    setProvider(null);
  };

  const buyTicket = async () => {
    try {
      // const publicClient = await checkProviderAndPublicClient();
      // let debounceTimeout;
      // const unwatch = publicClient.watchContractEvent({
      //   address: contract_address,
      //   abi: ticketNFT.abi,
      //   eventName: "TicketBought",
      //   args: { from: address },
      //   onLogs: (logs) => {
      //     clearTimeout(debounceTimeout);
      //     debounceTimeout = setTimeout(() => {
      //       alert(
      //         `Ticket ${logs[0].args.tokenId.toString().padStart(4, "0")} bought.`,
      //       );
      //       unwatch();
      //     }, 100);
      //   },
      // });
      const rpc = await checkProviderAndRPC();
      const transaction = await rpc.buyTicket();
      console.log("Transaction Mined", transaction);
      updateState(rpc);
    } catch (error) {
      throw error;
    } finally {
    }
  };

  const updateValidatedTicket = (event) => {
    setValidatedTicket(event.target.value);
  };

  const validateTicket = async (event) => {
    if (event.key !== "Enter") return;

    if (!ticketId_pattern.test(validatedTicket)) {
      alert(invalid_ticketId_msg);
      return;
    }

    const ticketId = parseInt(validatedTicket);

    try {
      const rpc = await checkProviderAndRPC();
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
      const rpc = await checkProviderAndRPC();
      updateState(rpc);
    }
  };

  const updateCancelledTicket = (event) => {
    setCancelledTicket(event.target.value);
  };

  const cancelTicket = async (event) => {
    if (event.key !== "Enter") return;

    if (!ticketId_pattern.test(cancelledTicket)) {
      alert(invalid_ticketId_msg);
      return;
    }

    const ticketId = parseInt(cancelledTicket);

    try {
      // const publicClient = await checkProviderAndPublicClient();
      // let debounceTimeout;
      // const unwatch = publicClient.watchContractEvent({
      //   address: contract_address,
      //   abi: ticketNFT.abi,
      //   eventName: "TicketCancelled",
      //   args: { from: address },
      //   onLogs: (logs) => {
      //     clearTimeout(debounceTimeout);
      //     debounceTimeout = setTimeout(() => {
      //       alert(
      //         `Ticket ${logs[0].args.tokenId.toString().padStart(4, "0")} cancelled.`,
      //       );
      //       unwatch();
      //     }, 100);
      //   },
      // });
      const rpc = await checkProviderAndRPC();
      const isValid = await rpc.isMyTicket(ticketId);
      if (!isValid) {
        alert(invalid_owner_msg);
        return;
      }
      const transaction = await rpc.cancelTicket(ticketId);
      console.log("Transaction Mined", transaction);
      updateState(rpc);
    } catch (error) {
      throw error;
    } finally {
      setCancelledTicket("");
    }
  };

  return (
    <div className="flex gap-4 items-center justify-center flex-col sm:flex-col">
      {/* top right */}
      <button
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-6 sm:h-6 sm:min-px-5 w-20 sm:w-20 group absolute top-0 right-0 m-6 text-2xl"
        aria-label="Logout"
        onClick={logout}
      >
        Logout
      </button>

      {/* center */}
      <button /* top */
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#FFFFCE] text-sm sm:text-base h-10 sm:h-12 sm:min-px-5 w-40 sm:w-40 relative group"
        aria-label="Buy Ticket"
        onClick={buyTicket}
      >
        Buy Ticket
      </button>
      <input /* center */
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#E8FFC4] text-sm sm:text-base h-10 sm:h-12 sm:min-px-5 w-40 sm:w-40 relative group"
        type="text"
        placeholder="Validate Ticket"
        value={validatedTicket}
        onChange={updateValidatedTicket}
        onKeyDown={validateTicket}
      />
      <input /* bottom */
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#FFDAC8] text-sm sm:text-base h-10 sm:h-12 sm:min-px-5 w-40 sm:w-40 relative group"
        type="text"
        placeholder="Cancel Ticket"
        value={cancelledTicket}
        onChange={updateCancelledTicket}
        onKeyDown={cancelTicket}
      />

      {/* bottom right */}
      <p /* top */
        id="address"
        className="flex items-center justify-center text-foreground gap-2 text-sm sm:text-base h-6 sm:h-6 sm:min-px-5 w-30 sm:w-30 group absolute bottom-12 right-0 m-6 text-2xl"
      >
        Your Address: {address}
      </p>
      <p /*  center */
        id="balance"
        className="flex items-center justify-center text-foreground gap-2 text-sm sm:text-base h-6 sm:h-6 sm:min-px-5 w-30 sm:w-30 group absolute bottom-6 right-0 m-6 text-2xl"
      >
        Your ETH Balance: {balance}
      </p>
      <p /*  bottom */
        id="ticket"
        className="flex items-center justify-center text-foreground gap-2 text-sm sm:text-base h-6 sm:h-6 sm:min-px-5 w-30 sm:w-30 group absolute bottom-0 right-0 m-6 text-2xl"
      >
        Your Tickets: {tickets ? tickets.join(", ") : "None"}
      </p>
    </div>
  );
}
