interface Window {
    ethereum?: {
      removeListener(arg0: string, handleAccountsChanged: (accounts: string[]) => void): unknown;
      isMetaMask?: boolean;
      request: (request: { method: string; params?: Array<any> }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
    };
    glow?: {
      connect: () => Promise<{ publicKey: string }>;
      disconnect: () => Promise<void>;
      signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
    };
  }