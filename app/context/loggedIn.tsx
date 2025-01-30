"use client";

import React, { createContext, useContext, useState } from "react";

const LoggedInContext = createContext(null);

export const LoggedIn = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  return (
    <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </LoggedInContext.Provider>
  );
};

export const useLoggedIn = () => useContext(LoggedInContext);
