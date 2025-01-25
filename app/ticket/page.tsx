'use client'

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAddress, useWeb3Auth } from '../context';

export default function Poll() {
    const router = useRouter();
    const { address, setAddress } = useAddress();
    const { web3Auth } = useWeb3Auth();

    useEffect(() => {
        if (!web3Auth) {
            console.log("web3auth not initialized yet");
            router.push(`/`);
            return;
        }
        if (!web3Auth.connected) {
            console.log("web3Auth not connected yet");
            router.push(`/`);
            return;
        }
    }, [web3Auth, router]);

    const logout = async () => {
        if (!web3Auth) {
            console.log("web3auth not initialized yet");
            return;
        }
        await web3Auth.logout();
        await setAddress(null);
        router.push(`/`);
        console.log("Logged out!");
    };

    const showAccount = async () => {
        console.log("User Address:", address);
    }

    const logoutButton = (
        <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-6 sm:h-6 sm:min-px-5 w-20 sm:w-20 group absolute top-0 right-0 m-6 text-2xl"
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
        <div className="flex gap-4 items-center justify-center flex-col sm:flex-row" >
            {logoutButton}
            {showAccountButton}
        </div>
    );

};
