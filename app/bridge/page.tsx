"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Mock data for chains
const chains = [
  { id: 1, name: "Ethereum", icon: "/ethereum.svg", token: "ETH" },
  { id: 2, name: "Polygon", icon: "/polygon.svg", token: "MATIC" },
  { id: 3, name: "Solana", icon: "/solana.svg", token: "SOL" },
  { id: 4, name: "Avalanche", icon: "/avalanche.svg", token: "AVAX" },
];

enum BridgeStatus {
  IDLE = "idle",
  BURNING = "burning",
  CONFIRMING_BURN = "confirming_burn",
  MINTING = "minting",
  CONFIRMING_MINT = "confirming_mint",
  COMPLETED = "completed",
  ERROR = "error",
}

interface NFT {
  contractAddress: string;
  tokenId: string;
  balance: string;
  metadata: {
    name: string;
    description: string;
    image: string;
  };
  uri: string;
}

export default function BridgePage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [sourceChain, setSourceChain] = useState(chains[0]);
  const [destinationChain, setDestinationChain] = useState(chains[1]);
  const [amount, setAmount] = useState("");
  const [bridgeStatus, setBridgeStatus] = useState<BridgeStatus>(BridgeStatus.IDLE);
  const [txHash, setTxHash] = useState("");
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  // Check wallet connection and load selected NFT
  useEffect(() => {
    // Check wallet connection status (mock)
    setIsWalletConnected(true);
    
    // Load the selected NFT from localStorage
    try {
      const storedNFT = localStorage.getItem('selectedNFT');
      if (storedNFT) {
        const parsedNFT = JSON.parse(storedNFT);
        setSelectedNFT(parsedNFT);
        
        // Automatically set source chain to Ethereum (Sepolia)
        setSourceChain(chains[0]); // Assuming Ethereum is first in the chains array
      }
    } catch (error) {
      console.error("Error loading selected NFT:", error);
    }
  }, []);

  // Mock wallet connection
  const connectWallet = async () => {
    // In a real application, we would use a wallet adapter/connector
    setTimeout(() => {
      setIsWalletConnected(true);
    }, 1000);
  };

  // Swap source and destination chains
  const swapChains = () => {
    const temp = sourceChain;
    setSourceChain(destinationChain);
    setDestinationChain(temp);
  };

  // Mock bridge process
  const startBridge = async () => {
    if (selectedNFT && (!amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseInt(selectedNFT.balance))) {
      alert("Please enter a valid amount not exceeding your balance");
      return;
    }

    // Simulate burn transaction
    setBridgeStatus(BridgeStatus.BURNING);
    await mockDelay(2000);
    
    // Simulate burn confirmation
    setBridgeStatus(BridgeStatus.CONFIRMING_BURN);
    setTxHash("0x" + Math.random().toString(16).substr(2, 64));
    await mockDelay(3000);
    
    // Simulate minting on destination chain
    setBridgeStatus(BridgeStatus.MINTING);
    await mockDelay(2000);
    
    // Simulate mint confirmation
    setBridgeStatus(BridgeStatus.CONFIRMING_MINT);
    await mockDelay(2000);
    
    // Complete the bridge
    setBridgeStatus(BridgeStatus.COMPLETED);
  };

  const resetBridge = () => {
    setAmount("");
    setBridgeStatus(BridgeStatus.IDLE);
    setTxHash("");
  };

  const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper to format the image URL properly
  const formatImageUrl = (url: string) => {
    if (!url) return "/placeholder-nft.png";
    return url.startsWith("ipfs://") ? url.replace('ipfs://', 'https://ipfs.io/ipfs/') : url;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex justify-center">
      <div className="max-w-lg w-full">
        <div className="flex items-center mb-6">
          <Link href="/select" className="text-blue-400 hover:text-blue-300 flex items-center mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Selection
          </Link>
          <h1 className="text-3xl font-bold text-center flex-grow pr-10">Cross-Chain Bridge</h1>
        </div>
        
        {!isWalletConnected ? (
          <div className="flex flex-col items-center justify-center py-12">
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            {/* Selected NFT Display */}
            {selectedNFT && (
              <div className="mb-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Selected NFT</h3>
                <div className="flex items-start">
                  <div className="w-24 h-24 bg-gray-600 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={formatImageUrl(selectedNFT.metadata?.image)} 
                      alt={selectedNFT.metadata?.name || "NFT"} 
                      className="w-full h-full object-cover"
                      onError={(e) => e.currentTarget.src = "/placeholder-nft.png"}
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h4 className="font-medium text-white">{selectedNFT.metadata?.name || `Token #${selectedNFT.tokenId}`}</h4>
                    <p className="text-sm text-gray-300 mt-1">{selectedNFT.metadata?.description || "No description available"}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="bg-gray-600 text-xs py-1 px-2 rounded">
                        Balance: {selectedNFT.balance}
                      </span>
                      <span className="bg-gray-600 text-xs py-1 px-2 rounded">
                        Token ID: {selectedNFT.tokenId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Chain Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-5/12">
                  <label className="block text-sm text-gray-400 mb-2">From</label>
                  <select 
                    className="w-full bg-gray-700 rounded-lg p-3 outline-none"
                    value={sourceChain.id}
                    onChange={(e) => setSourceChain(chains.find(c => c.id === parseInt(e.target.value)) || chains[0])}
                    disabled={selectedNFT !== null} // Disable if NFT is selected (locked to Ethereum)
                  >
                    {chains.map((chain) => (
                      <option key={chain.id} value={chain.id}>
                        {chain.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center justify-center">
                  <button 
                    onClick={swapChains}
                    className="bg-gray-700 p-2 rounded-full hover:bg-gray-600"
                    disabled={selectedNFT !== null} // Disable if NFT is selected
                  >
                    ⇄
                  </button>
                </div>
                
                <div className="w-5/12">
                  <label className="block text-sm text-gray-400 mb-2">To</label>
                  <select 
                    className="w-full bg-gray-700 rounded-lg p-3 outline-none"
                    value={destinationChain.id}
                    onChange={(e) => setDestinationChain(chains.find(c => c.id === parseInt(e.target.value)) || chains[1])}
                  >
                    {chains.map((chain) => (
                      <option key={chain.id} value={chain.id}>
                        {chain.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Amount Input - Only show if no NFT is selected or NFT has multiple balance */}
              {(!selectedNFT || parseInt(selectedNFT.balance) > 1) && (
                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-2">
                    {selectedNFT ? "Quantity to Bridge" : "Amount"}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={bridgeStatus !== BridgeStatus.IDLE && bridgeStatus !== BridgeStatus.COMPLETED}
                      className="w-full bg-gray-700 rounded-lg p-3 pr-16 outline-none"
                      min="1"
                      max={selectedNFT ? selectedNFT.balance : undefined}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {selectedNFT ? "NFT" : sourceChain.token}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Bridge Status */}
              {bridgeStatus !== BridgeStatus.IDLE && (
                <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                  <h3 className="font-semibold mb-2">Bridge Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        bridgeStatus === BridgeStatus.BURNING || 
                        bridgeStatus === BridgeStatus.CONFIRMING_BURN || 
                        bridgeStatus === BridgeStatus.MINTING ||
                        bridgeStatus === BridgeStatus.CONFIRMING_MINT ||
                        bridgeStatus === BridgeStatus.COMPLETED ? 'bg-green-500' : 'bg-gray-500'
                      }`}></div>
                      <span>Initiating Bridge</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        bridgeStatus === BridgeStatus.CONFIRMING_BURN || 
                        bridgeStatus === BridgeStatus.MINTING ||
                        bridgeStatus === BridgeStatus.CONFIRMING_MINT ||
                        bridgeStatus === BridgeStatus.COMPLETED ? 'bg-green-500' : 
                        bridgeStatus === BridgeStatus.BURNING ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'
                      }`}></div>
                      <span>Burning on {sourceChain.name}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        bridgeStatus === BridgeStatus.MINTING ||
                        bridgeStatus === BridgeStatus.CONFIRMING_MINT ||
                        bridgeStatus === BridgeStatus.COMPLETED ? 'bg-green-500' : 
                        bridgeStatus === BridgeStatus.CONFIRMING_BURN ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'
                      }`}></div>
                      <span>Confirming Burn Transaction</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        bridgeStatus === BridgeStatus.CONFIRMING_MINT ||
                        bridgeStatus === BridgeStatus.COMPLETED ? 'bg-green-500' : 
                        bridgeStatus === BridgeStatus.MINTING ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'
                      }`}></div>
                      <span>Minting on {destinationChain.name}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        bridgeStatus === BridgeStatus.COMPLETED ? 'bg-green-500' : 
                        bridgeStatus === BridgeStatus.CONFIRMING_MINT ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'
                      }`}></div>
                      <span>Confirming Mint Transaction</span>
                    </div>
                  </div>
                  
                  {txHash && (
                    <div className="mt-4 pt-4 border-t border-gray-600">
                      <p className="text-sm text-gray-400">Transaction Hash:</p>
                      <p className="text-xs overflow-hidden text-ellipsis">{txHash}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Action Button */}
              {bridgeStatus === BridgeStatus.IDLE && (
                <button
                  onClick={startBridge}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Bridge {selectedNFT ? (amount ? `${amount} ` : '1 ') + `${selectedNFT.metadata?.name || 'NFT'}` : amount ? `${amount} ${sourceChain.token}` : 'Tokens'}
                </button>
              )}
              
              {bridgeStatus === BridgeStatus.COMPLETED && (
                <div className="space-y-4">
                  <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
                    <p className="text-green-400">Bridge Completed Successfully!</p>
                    <p className="text-sm text-gray-300 mt-1">
                      {selectedNFT 
                        ? `${amount || '1'} ${selectedNFT.metadata?.name || 'NFT'} has been bridged to ${destinationChain.name}`
                        : `${amount} ${sourceChain.token} has been bridged to ${destinationChain.name}`
                      }
                    </p>
                  </div>
                  <button
                    onClick={resetBridge}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    Bridge More Tokens
                  </button>
                </div>
              )}
              
              {bridgeStatus !== BridgeStatus.IDLE && bridgeStatus !== BridgeStatus.COMPLETED && (
                <button
                  disabled
                  className="w-full bg-gray-600 text-gray-300 font-bold py-3 rounded-lg cursor-not-allowed"
                >
                  Bridging in Progress...
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}