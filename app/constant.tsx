export const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
export const contractAddress2 = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS2;
export const rpcUrl = process.env.NEXT_PUBLIC_ARB_SEPOLIA_RPC_URL;
export const scanAPIKey = process.env.NEXT_PUBLIC_ARBISCAN_API_KEY;

export const ticketID_pattern = /^[0-9]{4}$/;
export const invalid_ticketID_msg = "Ticket ID should be a 4-digit number.";