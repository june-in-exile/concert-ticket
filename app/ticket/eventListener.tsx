import { createPublicClient, http, custom, parseAbi } from "viem";
import { chain, contract_address, address_pattern } from "../constant";
import { anvil } from "viem/chains";
import { IProvider } from "@web3auth/base";
import RPC from "./viemRPC";

export const SetupEventListener = async (provider: IProvider, loggedIn: boolean) => {
  try {
    const checkAccount = async (logs) => {
      const rpc = new RPC(provider);
      const address = await rpc.getAccount();
      if (!address_pattern.test(address)) {
        throw new Error("Invalid address.");
      };
      return logs[0].args.user.toLowerCase() === address.toLowerCase();
    };

    const publicClient = createPublicClient({
      chain,
      transport: chain === anvil ? http() : custom(provider),
    });

    const unwatch = publicClient.watchEvent({
      address: contract_address,
      events: parseAbi([
        "event TicketBought(address indexed user, uint256 tokenId)",
        "event TicketCancelled(address indexed user, uint256 tokenId)",
      ]),
      onLogs: (logs) => {
        if (logs[0].eventName == "TicketBought" && checkAccount(logs)) {
          alert(`Ticket ${logs[0].args.tokenId.toString().padStart(4, '0')} bought.`);
        } else if (logs[0].eventName == "TicketCancelled" && checkAccount(logs)) {
          alert(`Ticket ${logs[0].args.tokenId.toString().padStart(4, '0')} cancelled.`);
        } else {
          console.warn(logs);
        }
      },
    });
    if (!loggedIn) {
      unwatch();
    }
  } catch (error) {
    throw error;
  }
};
