import { sepolia, localhost } from "viem/chains";

const envChain = process.env.CHAIN as "ARB_SEPOLIA" | "ANVIL";

let chain;
let privateKey: string;
let rpcUrl: string;
let contractAddress: string;

if (envChain === "ARB_SEPOLIA") {
  chain = sepolia;
  privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY!;
  rpcUrl = process.env.NEXT_PUBLIC_ARB_SEPOLIA_RPC_URL!;
  contractAddress = process.env.NEXT_PUBLIC_ARB_SEPOLIA_CONTRACT_ADDRESS!;
} else {
  chain = localhost;
  privateKey = process.env.NEXT_PUBLIC_ANVIL_PRIVATE_KEY!;
  rpcUrl = process.env.NEXT_PUBLIC_ANVIL_RPC_URL!;
  contractAddress = process.env.NEXT_PUBLIC_ANVIL_CONTRACT_ADDRESS!;
}
export { chain, privateKey, rpcUrl, contractAddress };

export const ticketID_pattern = /^(?!0000)\d{4}$/;
export const invalid_ticketID_msg =
  "Ticket ID should be a nonzero 4-digit number.";

export const w3a_clientId =
  "BFGwdPvLq1EkTdOQMA5YUscOiycV56JuacnskVNN5S57ZgS1Td78R5oUIYXjvlE640taCcitQRxpM9RXzpBikuA"; // get from https://dashboard.web3auth.io
export const google_client_id =
  "63140164655-5fsi5uk3ufolbtufe9ovofm2uf5mho39.apps.googleusercontent.com";
