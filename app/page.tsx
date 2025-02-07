"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProvider, useWeb3Auth, useLoginMethod } from "./context";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  WEB3AUTH_NETWORK,
  UX_MODE,
} from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import {
  chain,
  rpcUrl,
  StorageKey,
  Login,
  w3a_clientId,
  google_clientId,
} from "./constant";
import {
  createWalletClient,
  createPublicClient,
  custom,
  http,
  formatEther,
} from "viem";


export default function Home() {
  const router = useRouter();
  const { setProvider } = useProvider();
  const { web3Auth, setWeb3Auth } = useWeb3Auth();
  const { loginMethod, setLoginMethod } = useLoginMethod();

  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x66eee", // Hex of 421614
          rpcTarget: "https://rpc.ankr.com/arbitrum_sepolia",
          displayName: "Arbitrum Sepolia Testnet",
          blockExplorerUrl: "https://sepolia.arbiscan.io/",
          ticker: "AETH",
          tickerName: "AETH",
          logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
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
                primary: "#001111",
              },
            },
            loginConfig: {
              google: {
                verifier: "google-concert-ticket",
                typeOfLogin: "google",
                clientId: google_clientId, //use your app client id you got from google
              },
            },
          },
        });

        web3AuthInstance.configureAdapter(authAdapter);
        setWeb3Auth(web3AuthInstance);

        await web3AuthInstance.init();
        setProvider(web3AuthInstance.provider);

        if (web3AuthInstance.connected) {
          setLoginMethod(Login.Web3Auth);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    console.log("loginMethod = ", loginMethod);
    if (loginMethod) {
      router.push("/ticket");
    }
  }, [router, loginMethod]);

  const loginWithMetamask = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    setProvider(window.ethereum!);
    setLoginMethod(Login.Metamask);
  };

  const loginWithW3A = async () => {
    if (!web3Auth) {
      console.log("web3Auth not initialized yet");
      return;
    }
    await web3Auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });
  };

  return (
    <>
      <div className="flex gap-4 items-center justify-center flex-col sm:flex-row">
        <button
          className="px-8 py-2 rounded-md bg-[#1e2124] flex flex-row items-center justify-center border border-[#1e2124] hover:border hover:border-[#f4915d] shadow-md shadow-indigo-500/10"
          onClick={loginWithMetamask}
        >
          <h1 className="mx-auto">Metamask Login</h1>
        </button>
        <button
          className="px-8 py-2 rounded-md bg-[#1e2124] flex flex-row items-center justify-center border border-[#1e2124] hover:border hover:border-[#496ef4] shadow-md shadow-indigo-500/10"
          onClick={loginWithW3A}
        >
          <h1 className="mx-auto">Web3Auth Login</h1>
        </button>
      </div>
    </>
  );
}
