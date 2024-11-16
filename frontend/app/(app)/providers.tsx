"use client";

import { ReactNode } from "react";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  rainbowWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cookieStorage,
  createConfig,
  createStorage,
  http,
  State,
  WagmiProvider,
} from "wagmi";
import { sepolia, unichainSepolia } from "wagmi/chains";

import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended Wallet",
      wallets: [coinbaseWallet],
    },
    {
      groupName: "Other Wallets",
      wallets: [rainbowWallet, metaMaskWallet],
    },
  ],
  {
    appName: "some-protocol",
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  }
);

const wagmiConfig = createConfig({
  connectors,
  chains: [sepolia, unichainSepolia],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [sepolia.id]: http(),
    [unichainSepolia.id]: http(),
  },
});

function OnchainProviders(props: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={sepolia}>
          <RainbowKitProvider modalSize="compact">
            {props.children}
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default OnchainProviders;
