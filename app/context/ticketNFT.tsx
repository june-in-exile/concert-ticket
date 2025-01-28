"use client";
import React, { createContext, useContext } from "react";
import ticketNFT from "../../foundry/out/TicketNFT.sol/TicketNFT.json";
import { ethers } from "ethers";
import { privateKey, rpcUrl, contractAddress } from "../constant";

const TicketNFTContext = createContext(null);

const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, ticketNFT.abi, signer);

console.log("privateKey = ", privateKey);
console.log("rpcUrl = ", rpcUrl);
console.log("contractAddress = ", contractAddress);

export const TicketNFT = ({ children }) => {
  const buyOnChain = async () => {
    try {
      const transaction = await contract.buyTicket();
      console.log("Transaction Mined", transaction);
    } catch (error) {
      console.error(error);
    }
  };

  const validateOnChain = async (ticketId: number) => {
    try {
      return (await contract.isTicketValid(ticketId));
    } catch (error) {
      console.error(error);
    }
  };

  const cancelOnChain = async (ticketId: number) => {
    try {
      const transaction = await contract.cancelTicket(ticketId);
      console.log("Transaction Mined", transaction);
    } catch (error) {
      console.error(error);
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
