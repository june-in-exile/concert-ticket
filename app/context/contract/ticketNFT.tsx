"use client";
import React, { createContext, useContext } from "react";
import ticketNFT from "./TicketNFT.json";
import { ethers } from "ethers";
import { privateKey, contractAddress, rpcUrl } from "../../constant";

const TicketNFTContext = createContext(null);

export const TicketNFT = ({ children }) => {
  const buyOnChain = async () => {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = new ethers.Contract(
      contractAddress,
      ticketNFT.abi,
      signer,
    );
    await contractWithSigner
      .buyTicket()
      .then((transaction) => {
        console.log("Transaction Mined", transaction);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  const validateOnChain = async (ticketId: number) => {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contractWithProvider = new ethers.Contract(
      contractAddress,
      ticketNFT.abi,
      provider,
    );
    await contractWithProvider
      .isTicketValid(ticketId)
      .then((isValid) => {
        console.log("isValid = ", isValid);
        return isValid;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const cancelOnChain = async (ticketId: number) => {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = new ethers.Contract(
      contractAddress,
      ticketNFT.abi,
      signer,
    );
    await contractWithSigner
      .cancelTicket(ticketId)
      .then((transaction) => {
        console.log("Transaction Mined", transaction);
      })
      .catch((error) => {
        console.error(error);
      });
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
