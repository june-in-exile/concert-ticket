'use client'
import React, { useEffect } from "react";
// import { useRouter } from 'next/navigation';
import { useLoggedIn, useAddress, useProvider, useWeb3Auth } from './context';
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { WALLET_ADAPTERS, CHAIN_NAMESPACES, WEB3AUTH_NETWORK, UX_MODE } from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'

const w3a_clientId = "BFGwdPvLq1EkTdOQMA5YUscOiycV56JuacnskVNN5S57ZgS1Td78R5oUIYXjvlE640taCcitQRxpM9RXzpBikuA"; // get from https://dashboard.web3auth.io
const google_client_id = "63140164655-5fsi5uk3ufolbtufe9ovofm2uf5mho39.apps.googleusercontent.com";

export default function Home() {
  //   // const router = useRouter();
  const { loggedIn, setLoggedIn } = useLoggedIn();
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

        const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

        const web3AuthInstance = new Web3AuthNoModal({
          clientId: w3a_clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider,
        });

        const authAdapter = new AuthAdapter({
          adapterSettings: {
            uxMode: UX_MODE.POPUP,
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
          // await setLoggedIn(true);
          console.log("web3AuthInstance connected!");
        };
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [setLoggedIn, setProvider, setWeb3Auth]);

  useEffect(() => {
    if (loggedIn) {
      const getAccount = async () => {
        if (!web3Auth.connected) {
          console.log("web3Auth not connected yet");
          return;
        }

        if (!provider) {
          console.log("provider not initialized yet");
          return;
        }
        const walletClient = createWalletClient({
          chain: sepolia,
          transport: custom(provider)
        });

        const addresses = await walletClient.getAddresses();
        await setAddress(addresses[0]);
      };
      getAccount();
    }
  }, [web3Auth, loggedIn, provider, setAddress]);

  const showAccount = async () => {
    console.log("User Address:", address);
  }

  const loginWithGoogle = async () => {
    // ref: https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/custom-authentication/single-verifier-examples/google-no-modal-example
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      return;
    } if (loggedIn) {
      console.log("Already logged in.");
      return;
    }
    await web3Auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });
    await setLoggedIn(true);
  };

  const logout = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3Auth.logout();
    // await setProvider(null);
    await setAddress(null);
    await setLoggedIn(false);
    console.log("Logged out!");
  };

  const loginButton = (
    <button
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-6 sm:h-6 px-4 sm:px-5 sm:min-w-20 group absolute top-0 right-0 m-4 text-2xl"
      aria-label="Login"
      onClick={loginWithGoogle}
    >
      Login
    </button>
  );

  const logoutButton = (
    <button
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-6 sm:h-6 px-4 sm:px-5 sm:min-w-20 group absolute top-0 right-0 m-4 text-2xl"
      aria-label="Logout"
      onClick={logout}
    >
      Logout
    </button>
  );

  const showAccountButton = (
    <button
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-20 relative group"
      aria-label="Show User's Account"
      onClick={showAccount}
    >
      Show Account
    </button>
  );

  return (
    <>
      <div className="flex gap-4 items-center justify-center flex-col sm:flex-row" >
        {loggedIn ? <>{logoutButton}{showAccountButton}</> : loginButton}
      </div>
    </>
  );
}
