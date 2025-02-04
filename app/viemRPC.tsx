import {
  createWalletClient,
  createPublicClient,
  http,
  custom,
  formatEther,
  parseEther,
  HttpTransport,
} from "viem";
import {
  arbitrum,
  arbitrumSepolia,
  localhost,
  mainnet,
  polygonAmoy,
  sepolia,
} from "viem/chains";

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProvider } from "@web3auth/base";
import ticketNFT from "../foundry/out/TicketNFT.sol/TicketNFT.json";
import { rpcUrl, contract_address, chain } from "./constant";
import { local } from "web3modal";

export default class EthereumRpc {
  private provider: IProvider;
  private transport: HttpTransport;
  private publicClient;
  private walletClient;

  private contractABI = ticketNFT.abi;

  constructor(provider: IProvider) {
    this.provider = provider;
    if (chain == localhost) {
      this.publicClient = createPublicClient({
        chain,
        transport: http("http://localhost:8545"),
      });
      this.walletClient = createWalletClient({
        chain,
        transport: http("http://localhost:8545"),
      });
    } else { 
      this.publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider),
      });
      this.walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider),
      });
    }
  }

  getViewChain() {
    switch (this.provider.chainId) {
      case "1":
        return mainnet;
      case "0x539":
        return localhost;
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
      return await this.walletClient.getAddresses();
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
      const balance = await this.publicClient.getBalance({ address: address[0] });
      return formatEther(balance);
    } catch (error) {
      return error as string;
    }
  }

  // async sendTransaction(): Promise<any> {
  //   try {
  //     const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";
  //     const amount = parseEther("0.0001");
  //     const address = await this.getAccounts();

  //     const hash = await this.walletClient.sendTransaction({
  //       account: address[0],
  //       to: destination,
  //       value: amount,
  //     });
  //     const receipt = await this.publicClient.waitForTransactionReceipt({ hash });

  //     return this.toObject(receipt);
  //   } catch (error) {
  //     return error;
  //   }
  // }

  // async signMessage() {
  //   try {
  //     const address = await this.getAccounts();
  //     const originalMessage = "YOUR_MESSAGE";

  //     const hash = await this.walletClient.signMessage({
  //       account: address[0],
  //       message: originalMessage,
  //     });

  //     return hash.toString();
  //   } catch (error) {
  //     return error;
  //   }
  // }

  // async readContract() {
  //   try {
  //     const number = await this.publicClient.readContract({
  //       address: "0x9554a5CC8F600F265A89511e5802945f2e8A5F5D",
  //       abi: this.contractABI,
  //       functionName: "retrieve",
  //     });

  //     return this.toObject(number);
  //   } catch (error) {
  //     return error;
  //   }
  // }

  // async writeContract() {
  //   try {
  //     const address = await this.getAccounts();
  //     const randomNumber = Math.floor(Math.random() * 9000) + 1000;

  //     // Submit transaction to the blockchain
  //     const hash = await this.walletClient.writeContract({
  //       account: address[0],
  //       address: "0x9554a5CC8F600F265A89511e5802945f2e8A5F5D",
  //       abi: this.contractABI,
  //       functionName: "store",
  //       args: [randomNumber],
  //     });

  //     const receipt = await this.publicClient.waitForTransactionReceipt({ hash });

  //     return this.toObject(receipt);
  //   } catch (error) {
  //     return error;
  //   }
  // }

  async buyTicket() {
    try {
      const accounts = await this.getAccounts();

      const hash = await this.walletClient.writeContract({
        account: accounts[0],
        address: contract_address,
        abi: this.contractABI,
        functionName: "buyTicket",
        args: [],
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
    } catch (error) {
      return error;
    }
  }

  async isYourTicket(ticketId: number) {
    try {
      const accounts = await this.getAccounts();

      const isValid = await this.publicClient.readContract({
        account: accounts[0],
        address: contract_address,
        abi: this.contractABI,
        functionName: "isYourTicket",
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
        account: accounts[0],
        address: contract_address,
        abi: this.contractABI,
        functionName: "cancelTicket",
        args: [ticketId],
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });

      return this.toObject(receipt);
    } catch (error) {
      return error;
    }
  }

  async getMyTickets() {
    try {
      const ticketIds = await this.publicClient.readContract({
        address: contract_address,
        abi: this.contractABI,
        functionName: "getMyTickets",
      });

      return this.toObject(ticketIds);
    } catch (error) {
      return error;
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
