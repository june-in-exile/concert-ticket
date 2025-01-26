"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAddress, useWeb3Auth } from "../context";
// import { useAddress, useWeb3Auth, useTicketNFT } from "../context";

export default function Ticket() {
  const router = useRouter();
  const [validatedTicket, setValidatedTicket] = useState('');
  const [cancelledTicket, setCancelledTicket] = useState('');
  const { setAddress } = useAddress();
  const { web3Auth } = useWeb3Auth();
  // const { buyOnChain, validateOnChain, cancelOnChain } = useTicketNFT();

  useEffect(() => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      router.push(`/`);
      return;
    }
    if (!web3Auth.connected) {
      console.log("web3Auth not connected yet");
      router.push(`/`);
      return;
    }
  }, [web3Auth, router]);

  const logout = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3Auth.logout();
    await setAddress(null);
    router.push(`/`);
    console.log("Logged out!");
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
    // await buyOnChain();
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

  const validateTicket = (event) => {
    if (event.key === 'Enter' && validatedTicket.trim() !== '') {
      const ticketID = parseFloat(validatedTicket);
      if (!isNaN(ticketID) && Number.isInteger(ticketID) && ticketID >= 0) {
        console.log('Validate Ticket ID %d', ticketID);
      } else {
        alert('Please enter a valid Ticket ID.');
      }
      setValidatedTicket('');
    }
    // validateOnChain();
  };

  const validateTicketInput = (
    <input
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#E8FFC4] text-sm sm:text-base h-10 sm:h-12 sm:min-px-5 w-40 sm:w-40 relative group"
      type="text"
      placeholder="Validate Ticket"
      onChange={updateValidatedTicket}
      onKeyDown={validateTicket}
    />
  );

  const updateCancelledTicket = (event) => {
    setCancelledTicket(event.target.value);
  };

  const cancelTicket = (event) => {
    if (event.key === 'Enter' && cancelledTicket.trim() !== '') {
      const ticketID = parseFloat(cancelledTicket);
      if (!isNaN(ticketID) && Number.isInteger(ticketID) && ticketID >= 0) {
        console.log('Cancel Ticket ID %d', ticketID);
      } else {
        alert('Please enter a valid Ticket ID.');
      }
      setCancelledTicket('');
    }
    // cancelOnChain();
  };

  const cancelTicketInput = (
    <input
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#FFDAC8] text-sm sm:text-base h-10 sm:h-12 sm:min-px-5 w-40 sm:w-40 relative group"
      type="text"
      placeholder="Cancel Ticket"
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
