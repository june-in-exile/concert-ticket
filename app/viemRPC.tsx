import {
  createWalletClient,
  createPublicClient,
  http,
  custom,
  formatEther,
} from "viem";
import {
  arbitrumSepolia,
  mainnet,
  polygonAmoy,
  sepolia,
  anvil,
} from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProvider } from "@web3auth/base";
import ticketNFT from "../foundry/out/TicketNFT.sol/TicketNFT.json";
import {
  contract_address,
  w3a_account,
  w3a_private_key,
  chain,
} from "./constant";

export default class EthereumRpc {
  private provider: IProvider;
  private publicClient;
  private walletClient;
  private contractABI = ticketNFT.abi;

  constructor(provider: IProvider) {
    this.provider = provider;
    this.publicClient = createPublicClient({
      chain,
      transport: chain === anvil ? http() : custom(provider),
    });
    this.walletClient = createWalletClient({
      account:
        chain === anvil ? privateKeyToAccount(w3a_private_key) : undefined,
      chain,
      transport: chain === anvil ? http() : custom(provider),
    });
  }

  getViewChain() {
    switch (this.provider.chainId) {
      case "1":
        return mainnet;
      case "0x539":
        return anvil;
      case "0x13882":
        return polygonAmoy;
      case "0x66eee":
        return arbitrumSepolia;
      case "0xaa36a7":
        return sepolia;
      default:
        return mainnet;
    }
  }

  async getChainId(): Promise<any> {
    try {
      const chainId = await this.walletClient.getChainId();
      return chainId.toString();
    } catch (error) {
      return error;
    }
  }

  async getAddresses(): Promise<any> {
    try {
      return chain === anvil
        ? [w3a_account]
        : await this.walletClient.getAddresses();
    } catch (error) {
      return error;
    }
  }

  async getAccounts(): Promise<any> {
    try {
      const address = this.getAddresses();
      return address;
    } catch (error) {
      return error;
    }
  }

  async getPrivateKey(): Promise<any> {
    try {
      if (chain === anvil) {
        return w3a_private_key;
      }
      const privateKey = await this.provider.request({
        method: "eth_private_key",
      });
      return privateKey;
    } catch (error) {
      return error as string;
    }
  }

  async getBalance(): Promise<string> {
    try {
      const address = await this.getAccounts();
      const balance = await this.publicClient.getBalance({
        address: address[0],
      });
      return formatEther(balance);
    } catch (error) {
      return error as string;
    }
  }

  async buyTicket() {
    try {
      const accounts = await this.getAccounts();

      const hash = await this.walletClient.writeContract({
        account: chain === anvil ? undefined : accounts[0],
        address: contract_address,
        abi: this.contractABI,
        functionName: "buyTicket",
        args: [],
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
      });

      return this.toObject(receipt);
    } catch (error) {
      throw new Error(error);
    }
  }

  async isMyTicket(ticketId: number) {
    try {
      const accounts = await this.getAccounts();

      const isValid = await this.publicClient.readContract({
        account: accounts[0],
        address: contract_address,
        abi: this.contractABI,
        functionName: "isMyTicket",
        args: [ticketId],
      });

      return this.toObject(isValid);
    } catch (error) {
      throw new Error(error);
    }
  }

  async cancelTicket(ticketId: number) {
    try {
      const accounts = await this.getAccounts();

      const hash = await this.walletClient.writeContract({
        account: chain === anvil ? undefined : accounts[0],
        address: contract_address,
        abi: this.contractABI,
        functionName: "cancelTicket",
        args: [ticketId],
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
      });

      return this.toObject(receipt);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMyTickets() {
    try {
      const accounts = await this.getAccounts();

      const ticketIds = await this.publicClient.readContract({
        account: accounts[0],
        address: contract_address,
        abi: this.contractABI,
        functionName: "getMyTickets",
      });

      return this.toObject(ticketIds);
    } catch (error) {
      throw new Error(error);
    }
  }

  toObject(data: any) {
    // can't serialize a BigInt so this hack
    return JSON.parse(
      JSON.stringify(
        data,
        (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
      ),
    );
  }
}
