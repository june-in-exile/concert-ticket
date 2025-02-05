import { createPublicClient, http, custom } from "viem";
import { chain, contract_address, address_pattern } from "../constant";
import { anvil } from "viem/chains";
import { IProvider } from "@web3auth/base";
import ticketNFT from "../../foundry/out/TicketNFT.sol/TicketNFT.json";
import RPC from "./viemRPC";

export const SetupEventListener = async (
  provider: IProvider,
) => {
  try {
    const rpc = new RPC(provider);
    const address = await rpc.getAccount();
    if (!address_pattern.test(address)) {
      throw new Error("Invalid address.");
    }
    const publicClient = createPublicClient({
      chain,
      transport: chain === anvil ? http() : custom(provider),
    });

    publicClient.watchContractEvent({
      address: contract_address,
      abi: ticketNFT.abi,
      eventName: "TicketBought",
      args: { from: address },
      onLogs: (logs) => {
        alert(
          `Ticket ${logs[0].args.tokenId.toString().padStart(4, "0")} bought.`,
        );
      },
    });

    publicClient.watchContractEvent({
      address: contract_address,
      abi: ticketNFT.abi,
      eventName: "TicketCancelled",
      args: { from: address },
      onLogs: (logs) => {
        alert(
          `Ticket ${logs[0].args.tokenId.toString().padStart(4, "0")} cancelled.`,
        );
      },
    });
  } catch (error) {
    throw error;
  }
};
