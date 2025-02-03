"use client";
import React, { createContext, useContext } from "react";
import dotenv from "dotenv";
import { ethers } from "ethers";
import ticketNFT from "./TicketNFT.json";

dotenv.config();
const TicketNFTContext = createContext(null);

export const TicketNFT = ({ children }) => {
  const buyOnChain = async () => {
    const provider = new ethers.JsonRpcProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      ticketNFT.abi,
      signer,
    );
    try {
      const transaction = await contract.buyTicket();
      await transaction.wait();
      console.log("Transaction Mined", transaction);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const validateOnChain = async (ticketId: number) => {
    const provider = new ethers.JsonRpcProvider();
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      ticketNFT.abi,
      provider,
    );
    const isValid = await contract.isTicketValid(ticketId);
    if (isValid) {
      console.log("Ticket %d is valid.", ticketId);
    } else {
      console.log("Ticket %d is not valid.", ticketId);
    }
  };

  const cancelOnChain = async (ticketId: number) => {
    const provider = new ethers.JsonRpcProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      ticketNFT.abi,
      signer,
    );
    try {
      const transaction = await contract.cancelTicket(ticketId);
      await transaction.wait();
      console.log("Transaction Mined", transaction);
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <TicketNFTContext.Provider
      value={{ buyOnChain, validateOnChain, cancelOnChain }}
    >
      {children}
    </TicketNFTContext.Provider>
  );
};

export const useTicketNFT = () => useContext(TicketNFTContext);
