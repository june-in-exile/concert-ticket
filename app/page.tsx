"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAddress, useProvider, useWeb3Auth } from "./context";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  WEB3AUTH_NETWORK,
  UX_MODE,
} from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { createWalletClient, custom } from "viem";
import { chain, w3a_clientId, google_client_id } from "./constant";

export default function Home() {
  const router = useRouter();
  const { address, setAddress } = useAddress();
  const { provider, setProvider } = useProvider();
  const { web3Auth, setWeb3Auth } = useWeb3Auth();

  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0xaa36a7", // for wallet connect make sure to pass in this chain in the loginSettings of the adapter.
          rpcTarget: "https://rpc.ankr.com/eth_sepolia",
          // Avoid using public rpcTarget in production.
          // Use services like Infura, Quicknode etc
          displayName: "Ethereum Sepolia Testnet",
          blockExplorerUrl: "https://sepolia.etherscan.io",
          ticker: "ETH",
          tickerName: "Ethereum",
          logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
        };

        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });

        const web3AuthInstance = new Web3AuthNoModal({
          clientId: w3a_clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider,
        });

        const authAdapter = new AuthAdapter({
          adapterSettings: {
            uxMode: UX_MODE.REDIRECT,
            whiteLabel: {
              appName: "W3A Heroes",
              appUrl: "https://web3auth.io",
              logoLight: "https://web3auth.io/images/web3authlog.png",
              logoDark: "https://web3auth.io/images/web3authlogodark.png",
              defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
              mode: "dark", // whether to enable dark mode. defaultValue: auto
              theme: {
                primary: "#010101",
              },
            },
            loginConfig: {
              google: {
                verifier: "google-concert-ticket",
                typeOfLogin: "google",
                clientId: google_client_id, // get from https://console.developers.google.com/
              },
            },
          },
        });

        web3AuthInstance.configureAdapter(authAdapter);
        await setWeb3Auth(web3AuthInstance);

        await web3AuthInstance.init();
        await setProvider(web3AuthInstance.provider);

        if (web3AuthInstance.connected) {
          console.log("web3AuthInstance connected!");
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [setProvider, setWeb3Auth]);

  useEffect(() => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    if (!web3Auth.connected) {
      console.log("web3Auth not connected yet");
      return;
    }
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const getAccount = async () => {
      const walletClient = createWalletClient({
        chain: chain,
        transport: custom(provider),
      });

      const addresses = await walletClient.getAddresses();
      await setAddress(addresses[0]);

      router.push(`/ticket?address=${address}`);
    };
    getAccount();
  }, [router, web3Auth, provider, setAddress, address]);

  const getAccount = async () => {
    const walletClient = createWalletClient({
      chain: chain,
      transport: custom(provider),
    });

    const addresses = await walletClient.getAddresses();
    await setAddress(addresses[0]);
  };

  const loginWithGoogle = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    if (web3Auth.connected) {
      console.log("Already logged in.");
      return;
    }
    await web3Auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });
    await getAccount();
    router.push(`/ticket?address=${address}`);
  };

  const loginButton = (
    <button
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-6 sm:h-6 sm:min-px-5 w-20 sm:w-20 group absolute top-0 right-0 m-6 text-2xl"
      aria-label="Login"
      onClick={loginWithGoogle}
    >
      Login
    </button>
  );

  return (
    <>
      <div className="flex gap-4 items-center justify-center flex-col sm:flex-row">
        {loginButton}
      </div>
    </>
  );
}
