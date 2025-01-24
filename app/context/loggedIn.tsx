'use client'

import React, { createContext, useContext, useState } from 'react';

const loggedInContext = createContext(null);

export const LoggedIn = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [loggedIn, setLoggedIn] = useState(false);
    return (
        <loggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
            {children}
        </loggedInContext.Provider>
    );
};

export const useLoggedIn = () => useContext(loggedInContext);