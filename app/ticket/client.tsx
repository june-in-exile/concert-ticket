import {
    createWalletClient,
    createPublicClient,
    getContract,
    publicActions,
    custom,
    http,
} from "viem";
import "viem/window";
import {
    chain,
    rpcUrl,
    w3a_private_key,
    contract_address,
    Login,
    alert_metamask_msg,
} from "../constant";
import { privateKeyToAccount } from "viem/accounts";
import { anvil } from "viem/chains";
import { IProvider } from "@web3auth/base";
import ticketNFT from "./TicketNFT.json";

export async function getClientsAndContract(loginMethod: Login, provider?: IProvider) {
    let publicClient, walletClient, contract;
    try {
        if (loginMethod === Login.Metamask) {
            if (!window.ethereum) {
                throw new Error(alert_metamask_msg);
            }
            walletClient = createWalletClient({
                chain,
                transport: custom(window.ethereum),
            });
            publicClient = createPublicClient({
                chain,
                transport: http(rpcUrl),
            });
        } else if (loginMethod === Login.Web3Auth) {
            if (!provider) {
                throw new Error("No Provider.");
            }
            let privateKey = w3a_private_key;
            if (chain !== anvil) {
                privateKey =
                    "0x" + (await provider.request({ method: "eth_private_key" }));
            }
            walletClient = createWalletClient({
                account: privateKeyToAccount(privateKey),
                chain,
                transport: http(rpcUrl),
            });
            publicClient = walletClient.extend(publicActions);
        } else {
            throw new Error("Not login yet.");
        };
        contract = getContract({
            address: contract_address,
            abi: ticketNFT.abi,
            client: { public: publicClient, wallet: walletClient },
        });
    } catch (error) {
        throw error;
    }
    return { publicClient, walletClient, contract };
}