"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3Auth, useProvider, useLoggedIn } from "../context";
import {
  chain,
  rpcUrl,
  contract_address,
  ticketId_pattern,
  alert_ticketId_msg,
  alert_owner_msg,
  confirm_buy_msg,
  confirm_cancel_msg,
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
  const [tickets, setTickets] = useState<string[]>([]);
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
      transport: chain === anvil ? http() : http(rpcUrl),
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
    setAddress(await rpc.getAccounts()[0]);
    setBalance(await rpc.getBalance());
    setTickets(await rpc.getMyTickets());
  };

  const logout = async () => {
    if (!web3Auth) {
      throw new Error("web3auth not initialized yet");
    }
    await web3Auth.logout();
    setLoggedIn(false);
    setProvider(null);
  };

  const buyTicket = async () => {
    if (!confirm(confirm_buy_msg)) return;
    try {
      const publicClient = await checkProviderAndPublicClient();
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
      const rpc = await checkProviderAndRPC();
      const transaction = await rpc.buyTicket();
      console.log("Transaction Mined", transaction);
      updateState(rpc);
    } catch (error) {
      throw error;
    } finally {
    }
  };

  const updateValidatedTicket = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValidatedTicket(event.target.value);
  };

  const validateTicket = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    if (!ticketId_pattern.test(validatedTicket)) {
      alert(alert_ticketId_msg);
      return;
    }

    const ticketId = parseInt(validatedTicket);

    try {
      const rpc = await checkProviderAndRPC();
      const isValid = await rpc.isMyTicket(ticketId);
      alert(
        isValid
          ? `Ticket ${validatedTicket} is VALID.`
          : `Ticket ${validatedTicket} is INVALID.`,
      );
    } catch (error) {
      throw error;
    } finally {
      setValidatedTicket("");
    }
  };

  const updateCancelledTicket = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCancelledTicket(event.target.value);
  };

  const cancelTicket = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    if (!ticketId_pattern.test(cancelledTicket)) {
      alert(alert_ticketId_msg);
      return;
    }

    if (!confirm(confirm_cancel_msg)) return;

    const ticketId = parseInt(cancelledTicket);

    try {
      const publicClient = await checkProviderAndPublicClient();
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
      const rpc = await checkProviderAndRPC();
      const isValid = await rpc.isMyTicket(ticketId);
      if (!isValid) {
        alert(alert_owner_msg);
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
        {tickets.length ? `Your Tickets: ${tickets.map(ticket => ticket.padStart(4, '0')).join(", ")}` : `No Tickets Yet`}
      </p>
    </div>
  );
}
