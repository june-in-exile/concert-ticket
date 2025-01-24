'use client'

import React, { createContext, useContext, useState } from 'react';

const addressContext = createContext(null);

export const Address = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [address, setAddress] = useState<`0x${string}` | null>(null);
    return (
        <addressContext.Provider value={{ address, setAddress }}>
            {children}
        </addressContext.Provider>
    );
};

export const useAddress = () => useContext(addressContext);