import {
  createWalletClient,
  createPublicClient,
  getContract,
  http,
  custom,
} from "viem";
import { anvil } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProvider } from "@web3auth/base";
import ticketNFT from "../../foundry/out/TicketNFT.sol/TicketNFT.json";
import { contract_address, w3a_private_key, chain, rpcUrl } from "../constant";

export const initializePublicClient = async () => {
  return createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
};

export const initializeWalletClient = async (provider: IProvider) => {
  const privateKey =
    chain === anvil
      ? w3a_private_key
      : await provider.request({ method: "eth_private_key" });
  return createWalletClient({
    account: privateKeyToAccount(privateKey as `0x${string}`),
    chain,
    transport: chain === anvil ? http() : custom(provider),
  });
};

export const initializeContract = async (publicClient, walletClient) => {
  return getContract({
    address: contract_address,
    abi: ticketNFT.abi,
    client: { public: publicClient, wallet: walletClient },
  });
};
