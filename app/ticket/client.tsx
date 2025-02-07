import {
  createWalletClient,
  getContract,
  publicActions,
  custom,
  http,
} from "viem";
import "viem/window";
import {
  chain,
  rpcUrl,
  anvil_private_key,
  contract_address,
  Login,
} from "../constant";
import { privateKeyToAccount } from "viem/accounts";
import { anvil } from "viem/chains";
import { IProvider } from "@web3auth/base";
import ticketNFT from "./TicketNFT.json";

async function getWalletClient(loginMethod: Login, provider: IProvider) {
  try {
    if (!loginMethod) {
      throw new Error("Not login yet.");
    }
    if (chain == anvil) {
      return createWalletClient({
        account: privateKeyToAccount(anvil_private_key),
        chain,
        transport: http(),
      });
    }
    if (loginMethod === Login.Metamask) {
      const [account] = await provider.request({
        method: "eth_requestAccounts",
      });
      return createWalletClient({
        account,
        chain,
        transport: custom(provider),
      });
    }
    if (loginMethod === Login.Web3Auth) {
      const privateKey = await provider.request({ method: "eth_private_key" });
      const account = privateKeyToAccount("0x" + privateKey);
      return createWalletClient({
        account,
        chain,
        transport: http(rpcUrl),
      });
    }
  } catch (error) {
    throw error;
  }
}

export async function getClientsAndContract(
  loginMethod: Login,
  provider: IProvider,
) {
  const walletClient = await getWalletClient(loginMethod, provider);
  const publicClient = walletClient.extend(publicActions);
  const contract = getContract({
    address: contract_address,
    abi: ticketNFT.abi,
    client: { public: publicClient, wallet: walletClient },
  });

  return { publicClient, walletClient, contract };
}
