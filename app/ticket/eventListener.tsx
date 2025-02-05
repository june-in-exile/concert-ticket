import { createPublicClient, http, custom, parseAbi } from "viem";
import { chain, contract_address } from "../constant";
import { anvil } from "viem/chains";

export const SetupEventListener = (provider, loggedIn) => {
    try {
        const publicClient = createPublicClient({
            chain,
            transport: chain === anvil ? http() : custom(provider),
        });

        const unwatch = publicClient.watchEvent({
            address: contract_address,
            events: parseAbi([
                "event TicketBought(address indexed user, uint256 tokenId)",
                "event TicketCanceled(address indexed user, uint256 tokenId)",
            ]),
            onLogs: (logs) => {
                console.log(logs[0].eventName);
            },
        });
        if (!loggedIn) {
            unwatch();
        }
    } catch (error) {
        console.error(error);
    }
};
