"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import ticketNFT from "../../foundry/out/TicketNFT.sol/TicketNFT.json";
import { ethers } from "ethers";
import { rpcUrl, contract_address } from "../constant";
import { useWeb3Auth, useProvider } from "./index";
import RPC from ".././viemRPC";

const TicketNFTContext = createContext(null);

export const TicketNFT = ({ children }) => {
  const { web3Auth } = useWeb3Auth();
  const { provider } = useProvider();
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const privateKey = await rpc.getPrivateKey();
      const rpcProvider = new ethers.JsonRpcProvider(rpcUrl);
      const signer = new ethers.Wallet(privateKey, rpcProvider);
      setContract(new ethers.Contract(contract_address, ticketNFT.abi, signer));
    };
    init();
  }, [web3Auth, provider]);

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
      return await contract.isTicketValid(ticketId);
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
