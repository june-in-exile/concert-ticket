"use client";
import { anvil, arbitrumSepolia } from "viem/chains";

export const envChain = process.env.NEXT_PUBLIC_CHAIN as
  | "ARB_SEPOLIA"
  | "ANVIL";

let chain;
let rpcUrl: string;

if (envChain === "ARB_SEPOLIA") {
  chain = arbitrumSepolia;
  rpcUrl = process.env.NEXT_PUBLIC_ARB_SEPOLIA_RPC_URL;
} else {
  chain = anvil;
  rpcUrl = process.env.NEXT_PUBLIC_ANVIL_RPC_URL;
}
export { chain, rpcUrl };

// public
export const arb_sepolia_chainId = process.env.NEXT_PUBLIC_ARB_SEPOLIA_CHAIN_ID;
export const nft_contract_address = process.env
  .NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`;
export const sbt_contract_address = process.env
  .NEXT_PUBLIC_SBT_CONTRACT_ADDRESS as `0x${string}`;

export const ticketId_pattern = /^(?!0000)\d{4}$/;
export const address_pattern = /^0x[a-fA-F0-9]{40}$/;

export const alert_ticketId_msg = "Ticket ID is a nonzero 4-digit number.";
export const alert_owner_msg = "You are not the owner of this ticket.";
export const alert_logout_metamask_msg =
  "Please disconnect from Metamask manually.";
export const confirm_buy_msg = "Are you sure you want to buy a ticket?";
export const confirm_cancel_msg = "Are you sure you want to cancel the ticket?";

export enum Login {
  Metamask = 1,
  Web3Auth = 2,
}

// personal
export const anvil_private_key = process.env
  .NEXT_PUBLIC_ANVIL_PRIVATE_KEY as `0x${string}`;
export const pimlico_api_key = "pim_6uN1PB3Q8fGTd86Xskgthf"; // get from dashboard.pimlico.io/
export const w3a_clientId =
  "BFGwdPvLq1EkTdOQMA5YUscOiycV56JuacnskVNN5S57ZgS1Td78R5oUIYXjvlE640taCcitQRxpM9RXzpBikuA"; // get from dashboard.web3auth.io
export const google_clientId =
  "63140164655-5fsi5uk3ufolbtufe9ovofm2uf5mho39.apps.googleusercontent.com"; // get from console.cloud.google.com/apis/dashboard
