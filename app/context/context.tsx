'use client'

import { ReactNode } from 'react';
import { Address } from './address';
import { Provider } from './provider';
import { Web3Auth } from './web3Auth';

export const Context = ({ children }: { children: ReactNode }) => {
    return (
            <Address>
                <Provider>
                    <Web3Auth>
                        {children}
                    </Web3Auth>
                </Provider>
            </Address>
    );
};