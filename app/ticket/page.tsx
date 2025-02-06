"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3Auth, useProvider, useLoggedIn } from "../context";
import {
  chain,
  rpcUrl,
  w3a_private_key,
  contract_address,
  ticketId_pattern,
  alert_ticketId_msg,
  alert_owner_msg,
  confirm_buy_msg,
  confirm_cancel_msg,
} from "../constant";
import {
  createWalletClient,
  getContract,
  http,
  publicActions,
} from "viem";
import RPC from "./viemRPC";
import { anvil } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import ticketNFT from "../../foundry/out/TicketNFT.sol/TicketNFT.json";

export default function Ticket() {
  const router = useRouter();
  const [validatedTicket, setValidatedTicket] = useState<string>("");
  const [cancelledTicket, setCancelledTicket] = useState<string>("");
  const [address, setAddress] = useState<`0x${string}`>("0x");
  const [balance, setBalance] = useState<string>("");
  const [tickets, setTickets] = useState<string[]>([]);
  const [contract, setContract] = useState(null);
  const { provider, setProvider } = useProvider();
  const { web3Auth } = useWeb3Auth();
  const { loggedIn, setLoggedIn } = useLoggedIn();

  useEffect(() => {
    const init = async () => {
      if (loggedIn) {
        try {
          let privateKey = w3a_private_key;
          if (chain !== anvil) {
            privateKey = '0x' + (await provider.request({ method: "eth_private_key" }))
          };

          const walletClient = createWalletClient({
            account: privateKeyToAccount(privateKey),
            chain,
            transport: http(rpcUrl),
          });

          const publicClient = walletClient.extend(publicActions);

          const contract = getContract({
            address: contract_address,
            abi: ticketNFT.abi,
            client: { public: publicClient, wallet: walletClient },
          });

          setContract(contract);

          await updateState();
        } catch (error) {
          throw error;
        }
      } else {
        router.push(`/`);
      }
    };
    init();
  }, [router, loggedIn, provider]);

  useEffect(() => {
    if (contract && address) {
      contract.watchEvent.TicketBought({
        from: address,
      },
        {
          onLogs: (logs) => { alert(`Ticket ${logs[0].args.tokenId.toString().padStart(4, "0")} bought.`) }
        })
      contract.watchEvent.TicketCancelled({
        from: address,
      },
        {
          onLogs: (logs) => {
            alert(
              `Ticket ${logs[0].args.tokenId.toString().padStart(4, "0")} cancelled.`,
            )
          }
        })
    }
  }, [address, contract]);

  const updateState = async () => {
    if (!provider) {
      throw new Error("Provider not initialized yet");
    }
    const rpc = new RPC(provider);
    setAddress(await rpc.getAccount());
    setBalance(await rpc.getBalance());
    setTickets(await rpc.getMyTickets());
  };

  const logout = async () => {
    if (!web3Auth) {
      throw new Error("web3auth not initialized yet");
    }
    await web3Auth.logout();
    setLoggedIn(false);
    setProvider(null);
  };

  const buyTicket = async () => {
    if (!confirm(confirm_buy_msg)) return;
    try {
      const transaction = await contract.write.buyTicket();
      console.log("Transaction of buyTicket:", transaction);
    } catch (error) {
      throw error;
    } finally {
      updateState();
    }
  };

  const updateValidatedTicket = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValidatedTicket(event.target.value);
  };

  const validateTicket = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== "Enter") return;

    if (!ticketId_pattern.test(validatedTicket)) {
      alert(alert_ticketId_msg);
      return;
    }

    const ticketId = parseInt(validatedTicket);

    try {
      const isValid = await contract.read.isMyTicket([ticketId]);
      alert(
        isValid
          ? `Ticket ${validatedTicket} is VALID.`
          : `Ticket ${validatedTicket} is INVALID.`,
      );
    } catch (error) {
      throw error;
    } finally {
      setValidatedTicket("");
      updateState();
    }
  };

  const updateCancelledTicket = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCancelledTicket(event.target.value);
  };

  const cancelTicket = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    if (!ticketId_pattern.test(cancelledTicket)) {
      alert(alert_ticketId_msg);
      return;
    }

    if (!confirm(confirm_cancel_msg)) return;

    const ticketId = parseInt(cancelledTicket);

    try {
      const isValid = await contract.read.isMyTicket([ticketId]);
      if (!isValid) {
        alert(alert_owner_msg);
        return;
      }
      const transaction = await contract.write.cancelTicket([ticketId]);
      console.log("Transaction of cancelTicket:", transaction);
    } catch (error) {
      throw error;
    } finally {
      setCancelledTicket("");
      updateState();
    }
  };

  return (
    <div className="flex gap-4 items-center justify-center flex-col sm:flex-col">
      {/* top right */}
      <button
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-6 sm:h-6 sm:min-px-5 w-20 sm:w-20 group absolute top-0 right-0 m-6 text-2xl"
        aria-label="Logout"
        onClick={logout}
      >
        Logout
      </button>

      {/* top left */}
      <p /* top */
        id="address"
        className="absolute top-8 left-0 m-6 text-foreground text-sm sm:text-base h-6 sm:h-6 sm:min-px-5 w-30 sm:w-30 text-2xl"
      >
        Address: {address}
      </p>
      <p /*  center */
        id="balance"
        className="absolute top-14 left-0 m-6 text-foreground text-sm sm:text-base h-6 sm:h-6 sm:min-px-5 w-30 sm:w-30 text-2xl"
      >
        ETH Balance: {balance}
      </p>
      <p /*  bottom */
        id="ticket"
        className="absolute top-20 left-0 m-6 text-foreground text-sm sm:text-base h-6 sm:h-6 sm:min-px-5 w-30 sm:w-30 text-2xl"
      >
        {tickets.length
          ? `Tickets: ${tickets.map((ticket) => ticket.padStart(4, "0")).join(", ")}`
          : `No Tickets Yet`}
      </p>

      {/* center */}
      <button /* top */
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#FFFFCE] text-sm sm:text-base h-10 sm:h-12 sm:min-px-5 w-40 sm:w-40 relative group"
        aria-label="Buy Ticket"
        onClick={buyTicket}
      >
        Buy Ticket
      </button>
      <input /* center */
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#E8FFC4] text-sm sm:text-base h-10 sm:h-12 sm:min-px-5 w-40 sm:w-40 relative group"
        type="text"
        placeholder="Validate Ticket"
        value={validatedTicket}
        onChange={updateValidatedTicket}
        onKeyDown={validateTicket}
      />
      <input /* bottom */
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#FFDAC8] text-sm sm:text-base h-10 sm:h-12 sm:min-px-5 w-40 sm:w-40 relative group"
        type="text"
        placeholder="Cancel Ticket"
        value={cancelledTicket}
        onChange={updateCancelledTicket}
        onKeyDown={cancelTicket}
      />
    </div>
  );
}
