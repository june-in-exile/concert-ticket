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
    metamask_private_key,
    w3a_private_key,
    contract_address,
    Login,
} from "../constant";
import { privateKeyToAccount } from "viem/accounts";
import { anvil } from "viem/chains";
import { IProvider } from "@web3auth/base";
import ticketNFT from "./TicketNFT.json";

// TODO: metamask for local testing
export async function getClientsAndContract(
    loginMethod: Login,
    provider: IProvider,
) {
    let publicClient, walletClient, contract;
    try {
        if (loginMethod === Login.Metamask) {
            if (chain == anvil) {
                walletClient = createWalletClient({
                    account: privateKeyToAccount(metamask_private_key),
                    chain,
                    transport: http(rpcUrl),
                });
            } else {
                const [account] = await window.ethereum!.request({ method: 'eth_requestAccounts' });
                walletClient = createWalletClient({
                    account,
                    chain,
                    transport: custom(provider),
                });
            }
        } else if (loginMethod === Login.Web3Auth) {
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
        } else {
            throw new Error("Not login yet.");
        }
        publicClient = walletClient.extend(publicActions);
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
