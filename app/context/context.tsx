'use client'

import { ReactNode } from 'react';
import { LoggedIn } from './loggedIn';
import { Address } from './address';
import { Provider } from './provider';
import { Web3Auth } from './web3Auth';

export const Context = ({ children }: { children: ReactNode }) => {
    return (
        <LoggedIn>
            <Address>
                <Provider>
                    <Web3Auth>
                        {children}
                    </Web3Auth>
                </Provider>
            </Address>
        </LoggedIn>
    );
};