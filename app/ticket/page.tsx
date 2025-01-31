"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useWeb3Auth,
  useProvider,
  useLoggedIn,
  useTicketNFT,
} from "../context";
import {
  ticketId_pattern,
  address_pattern,
  invalid_ticketId_msg,
} from "../constant";
import RPC from ".././viemRPC";

export default function Ticket() {
  const router = useRouter();
  const [validatedTicket, setValidatedTicket] = useState("");
  const [cancelledTicket, setCancelledTicket] = useState("");
  const [address, setAddress] = useState<`0x${string}`>("0x");
  const [balance, setBalance] = useState("");
  const [tickets, setTickets] = useState<BigInt[]>([]);
  const { provider, setProvider } = useProvider();
  const { web3Auth } = useWeb3Auth();
  const { loggedIn, setLoggedIn } = useLoggedIn();
  const { buyOnChain, validateOnChain, cancelOnChain, getTicketsOnChain } =
    useTicketNFT();

  useEffect(() => {
    const init = async () => {
      try {
        showAddress();
        showBalance();
        showTickets();
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      setAddress(null);
      router.push(`/`);
      return;
    }
    if (!address) {
      setLoggedIn(false);
      setProvider(null);
      router.push(`/`);
      return;
    }
  }, [router, loggedIn, address]);

  useEffect(() => {
    if (address && !address_pattern.test(address)) {
      setAddress(null);
    }
  }, [address]);

  const showAddress = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    setAddress(await rpc.getAccounts());
  };

  const addressText = (
    <p
      id="address"
      className="flex items-center justify-center text-foreground gap-2 text-sm sm:text-base h-6 sm:h-6 sm:min-px-5 w-30 sm:w-30 group absolute bottom-12 right-0 m-6 text-2xl"
    >
      Your Address: {address}
    </p>
  );

  const showBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    // this function cannot show the balance of local node
    setBalance(await rpc.getBalance());
  };

  const balanceText = (
    <p
      id="balance"
      className="flex items-center justify-center text-foreground gap-2 text-sm sm:text-base h-6 sm:h-6 sm:min-px-5 w-30 sm:w-30 group absolute bottom-6 right-0 m-6 text-2xl"
    >
      Your ETH Balance: {balance}
    </p>
  );

  const showTickets = async () => {
    const ticketIds = await getTicketsOnChain();
    const firstZeroIndex = ticketIds.findIndex(
      (ticketId: BigInt) => ticketId === BigInt(0),
    );
    setTickets(ticketIds.slice(0, firstZeroIndex));
  };

  const ticketText = (
    <p
      id="ticket"
      className="flex items-center justify-center text-foreground gap-2 text-sm sm:text-base h-6 sm:h-6 sm:min-px-5 w-30 sm:w-30 group absolute bottom-0 right-0 m-6 text-2xl"
    >
      Your Tickets: {tickets.join(", ")}
    </p>
  );

  const logout = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      return;
    }
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
    await buyOnChain();
    await Promise.all([showAddress(), showBalance(), showTickets()]);
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
    if (event.key === "Enter") {
      if (ticketId_pattern.test(validatedTicket)) {
        const ticketId = parseInt(validatedTicket);
        try {
          if (await validateOnChain(ticketId)) {
            alert(`Ticket ${validatedTicket} is VALID.`);
          } else {
            alert(`Ticket ${validatedTicket} is NOT valid.`);
          }
        } catch (error) {
          console.error(`Error while validating ticket:`, error);
        }
        setValidatedTicket("");
      } else {
        alert(invalid_ticketId_msg);
      }
    }
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
    if (event.key === "Enter") {
      if (ticketId_pattern.test(cancelledTicket)) {
        const ticketId = parseInt(cancelledTicket);
        await cancelOnChain(ticketId).catch((error) => {
          console.error("Error while cancelling ticket:", error);
        });
        setCancelledTicket("");
        await Promise.all([showAddress(), showBalance(), showTickets()]);
      } else {
        alert(invalid_ticketId_msg);
      }
    }
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
