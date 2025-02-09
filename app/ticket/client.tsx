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
  nft_contract_address,
  sbt_contract_address,
  Login,
} from "../constant";
import { privateKeyToAccount } from "viem/accounts";
import { anvil } from "viem/chains";
import { IProvider } from "@web3auth/base";
import ticketNFT from "./TicketNFT.json";
import ticketSBT from "./TicketSBT.json";

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
  isSoulbound: boolean,
) {
  const walletClient = await getWalletClient(loginMethod, provider);
  const publicClient = walletClient.extend(publicActions);
  const address = isSoulbound ? sbt_contract_address : nft_contract_address;
  const abi = isSoulbound ? ticketSBT.abi : ticketNFT.abi;
  const contract = getContract({
    address,
    abi,
    client: { public: publicClient, wallet: walletClient },
  });

  return { publicClient, walletClient, contract };
}
