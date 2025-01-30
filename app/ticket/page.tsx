"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAddress, useWeb3Auth, useProvider, useLoggedIn, useTicketNFT } from "../context";
import { ticketId_pattern, invalid_ticketId_msg } from "../constant";

export default function Ticket() {
  const router = useRouter();
  const [validatedTicket, setValidatedTicket] = useState("");
  const [cancelledTicket, setCancelledTicket] = useState("");
  const { setAddress } = useAddress();
  const { setProvider } = useProvider();
  const { web3Auth } = useWeb3Auth();
  const { loggedIn, setLoggedIn } = useLoggedIn();
  const { buyOnChain, validateOnChain, cancelOnChain } = useTicketNFT();

  useEffect(() => {
    if (!loggedIn) {
      router.push(`/`);
    }
  }, [router, loggedIn]);

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
    console.log("Buy Ticket");
    await buyOnChain();
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
        console.log("Validate Ticket Id %d", ticketId);
        try {
          if (await validateOnChain(ticketId)) {
            console.log(`Ticket ${ticketId} is valid.`);
          } else {
            console.log(`Ticket ${ticketId} is not valid.`);
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
        console.log("Cancel Ticket Id %d", ticketId);
        await cancelOnChain(ticketId).catch((error) => {
          console.error("Error while cancelling ticket:", error);
        });
        setCancelledTicket("");
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
    </div>
  );
}
