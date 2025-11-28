import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, polygon, arbitrum, base } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// WalletConnect Project ID (public, safe to expose)
const projectId = '73d21dc3f9057213d69396c48b310078';

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, arbitrum, base],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    coinbaseWallet({ appName: 'Nakama OS BeatBunny' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
