"use client";

import React, { createContext, useContext, useState } from "react";
import { Login } from "../constant";

const LoginMethodContext = createContext(null);

export const LoginMethod = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [loginMethod, setLoginMethod] = useState<Login>();
  return (
    <LoginMethodContext.Provider value={{ loginMethod, setLoginMethod }}>
      {children}
    </LoginMethodContext.Provider>
  );
};

export const useLoginMethod = () => useContext(LoginMethodContext);
