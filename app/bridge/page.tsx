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
  const [sourceChain, setSourceChain] = useState(chains[0]); // Ethereum (Sepolia)
  const [destinationChain, setDestinationChain] = useState(chains[2]); // Default to Solana
  const [bridgeStatus, setBridgeStatus] = useState<BridgeStatus>(BridgeStatus.IDLE);
  const [txHash, setTxHash] = useState("");
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

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
      }
    } catch (error) {
      console.error("Error loading selected NFT:", error);
    }
  }, []);

  // Mock wallet connection
  const connectWallet = async () => {
    setTimeout(() => {
      setIsWalletConnected(true);
    }, 1000);
  };

  // Mock bridge process - automatically bridges the NFT
  const startBridge = async () => {
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
    
    // Show success alert
    setShowSuccessAlert(true);
    
    // Auto-hide success alert after 5 seconds
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 5000);
  };

  const resetBridge = () => {
    setBridgeStatus(BridgeStatus.IDLE);
    setTxHash("");
    setShowSuccessAlert(false);
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
          <Link href="/select-nft" className="text-blue-400 hover:text-blue-300 flex items-center mr-4">
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
            {/* Success Alert */}
            {showSuccessAlert && (
              <div className="mb-6 bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
                <p className="text-green-400 font-bold">Bridge Completed Successfully!</p>
                <p className="text-sm text-gray-300 mt-1">
                  {selectedNFT 
                    ? `${selectedNFT.metadata?.name || 'NFT'} has been bridged to ${destinationChain.name}`
                    : `Tokens have been bridged to ${destinationChain.name}`
                  }
                </p>
              </div>
            )}
            
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
                  <div className="w-full bg-gray-700 rounded-lg p-3 text-white">
                    {sourceChain.name} (Sepolia)
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="p-2">→</div>
                </div>
                
                <div className="w-5/12">
                  <label className="block text-sm text-gray-400 mb-2">To</label>
                  <select 
                    className="w-full bg-gray-700 rounded-lg p-3 outline-none"
                    value={destinationChain.id}
                    onChange={(e) => setDestinationChain(chains.find(c => c.id === parseInt(e.target.value)) || chains[2])}
                    disabled={bridgeStatus !== BridgeStatus.IDLE && bridgeStatus !== BridgeStatus.COMPLETED}
                  >
                    {chains.filter(chain => chain.id !== sourceChain.id).map((chain) => (
                      <option key={chain.id} value={chain.id}>
                        {chain.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Bridge Status */}
              {bridgeStatus !== BridgeStatus.IDLE && bridgeStatus !== BridgeStatus.COMPLETED && (
                <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                  <h3 className="font-semibold mb-2">Bridge Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        bridgeStatus === BridgeStatus.BURNING || 
                        bridgeStatus === BridgeStatus.CONFIRMING_BURN || 
                        bridgeStatus === BridgeStatus.MINTING ||
                        bridgeStatus === BridgeStatus.CONFIRMING_MINT 
                         ? 'bg-green-500' : 'bg-gray-500'
                      }`}></div>
                      <span>Initiating Bridge</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        bridgeStatus === BridgeStatus.CONFIRMING_BURN || 
                        bridgeStatus === BridgeStatus.MINTING ||
                        bridgeStatus === BridgeStatus.CONFIRMING_MINT 
                         ? 'bg-green-500' : 
                        bridgeStatus === BridgeStatus.BURNING ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'
                      }`}></div>
                      <span>Burning on {sourceChain.name}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        bridgeStatus === BridgeStatus.MINTING ||
                        bridgeStatus === BridgeStatus.CONFIRMING_MINT 
                        ? 'bg-green-500' : 
                        bridgeStatus === BridgeStatus.CONFIRMING_BURN ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'
                      }`}></div>
                      <span>Confirming Burn Transaction</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        bridgeStatus === BridgeStatus.CONFIRMING_MINT  ? 'bg-green-500' : 
                        bridgeStatus === BridgeStatus.MINTING ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'
                      }`}></div>
                      <span>Minting on {destinationChain.name}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        // bridgeStatus === BridgeStatus.COMPLETED ? 'bg-green-500' : 
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
                  disabled={!selectedNFT}
                >
                  {`Bridge ${selectedNFT ? selectedNFT.metadata?.name || 'NFT' : 'Tokens'}`}
                </button>
              )}

              {bridgeStatus === BridgeStatus.COMPLETED && (
                <Link href="/" className="block w-full">
                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    Return to Home
                  </button>
                </Link>
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