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
import ticketNFT from "../../foundry/out/TicketNFT.sol/TicketNFT.json";
import {
  contract_address,
  w3a_account,
  w3a_private_key,
  chain,
  rpcUrl,
} from "../constant";

export default class EthereumRpc {
  private provider: IProvider;
  private publicClient;
  private walletClient;
  private contractABI = ticketNFT.abi;

  constructor(provider: IProvider) {
    this.provider = provider;
    this.publicClient = createPublicClient({
      chain,
      transport: http(rpcUrl),
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
      throw error;
    }
  }

  async getAccount(): Promise<any> {
    try {
      const addresses = await this.walletClient.getAddresses();
      return chain === anvil ? w3a_account : addresses[0];
    } catch (error) {
      throw error;
    }
  }

  async getPrivateKey(): Promise<any> {
    try {
      return chain === anvil
        ? w3a_private_key
        : await this.provider.request({
            method: "eth_private_key",
          });
    } catch (error) {
      throw error;
    }
  }

  async getBalance(): Promise<string> {
    try {
      const account = await this.getAccount();
      const balance = await this.publicClient.getBalance({
        address: account,
      });
      return formatEther(balance);
    } catch (error) {
      throw error;
    }
  }

  async getMyTickets() {
    try {
      const account = await this.getAccount();
      const ticketIds = await this.publicClient.readContract({
        account,
        address: contract_address,
        abi: this.contractABI,
        functionName: "getMyTickets",
      });

      return this.toObject(ticketIds);
    } catch (error) {
      throw error;
    }
  }

  toObject(data: any) {
    return JSON.parse(
      JSON.stringify(data, (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );
  }
}
