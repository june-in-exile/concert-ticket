'use client'

import React, { createContext, useContext, useState } from 'react';
import { IProvider } from "@web3auth/base";

const ProviderContext = createContext(null);

export const Provider = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [provider, setProvider] = useState<IProvider | null>(null);
    return (
        <ProviderContext.Provider value={{ provider, setProvider }}>
            {children}
        </ProviderContext.Provider>
    );
};

export const useProvider = () => useContext(ProviderContext);