"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAddress, useProvider, useWeb3Auth, useLoggedIn } from "./context";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  WEB3AUTH_NETWORK,
  UX_MODE,
} from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";
import {
  AccountAbstractionProvider,
  SafeSmartAccount,
} from "@web3auth/account-abstraction-provider";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { createWalletClient, custom } from "viem";
import {
  chain,
  arb_sepolia_usdc,
  arb_sepolia_chainId,
  pimlico_api_key,
  w3a_clientId,
  google_clientId,
} from "./constant";
import RPC from "./viemRPC"; // for using viem

export default function Home() {
  const router = useRouter();
  const { address, setAddress } = useAddress();
  const { provider, setProvider } = useProvider();
  const { web3Auth, setWeb3Auth } = useWeb3Auth();
  const { loggedIn, setLoggedIn } = useLoggedIn();

  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x66eee", // Hex of 421614
          // Avoid using public rpcTarget in production.
          // Use services like Infura, Quicknode etc
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
          setLoggedIn(true);
          console.log("web3AuthInstance connected!");
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const handleLogin = async () => {
      if (loggedIn) {
        await pushAccount();
      }
    };
    handleLogin();
  }, [router, loggedIn]);

  const pushAccount = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const account = await rpc.getAccounts();
    await setAddress(account);
    router.push(`/ticket?address=${account}`);
  };

  const loginWithGoogle = async () => {
    if (!web3Auth) {
      console.log("web3Auth not initialized yet");
      return;
    }
    const web3AuthProvider = await web3Auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });
    setProvider(web3AuthProvider);
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
