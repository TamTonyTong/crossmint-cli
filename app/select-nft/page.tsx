"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ethers } from "ethers"
import { ArrowLeft, ChevronRight, RefreshCw, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

// ERC1155 interface for querying NFTs
const ERC1155_INTERFACE = new ethers.Interface([
  "function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) external view returns (uint256[] memory)",
  "function uri(uint256 id) external view returns (string memory)",
])

// Sepolia testnet configuration
const SEPOLIA_CHAIN_ID = '0xaa36a7'  // Chain ID for Sepolia in hex
const SEPOLIA_CONFIG = {
  chainId: SEPOLIA_CHAIN_ID,
  chainName: 'Sepolia',
  rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_KEY', 'https://rpc.sepolia.org'],
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'SEP',
    decimals: 18,
  },
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
}

export default function SelectNFT() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nfts, setNfts] = useState<Array<{
    contractAddress: string;
    tokenId: string;
    balance: string;
    metadata: any;
    uri: string;
  }>>([])
  const [selectedNft, setSelectedNft] = useState<number | null>(null)
  const [networkName, setNetworkName] = useState<string>('')
  const [walletConnected, setWalletConnected] = useState(false)
  
  // Add a check for wallet connection as soon as component mounts
  useEffect(() => {
    async function checkWalletConnection() {
      if (typeof window.ethereum === 'undefined') {
        router.push('/connection')
        return
      }
      
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length === 0) {
          // No wallet connected, redirect to connection page
          router.push('/connection')
          return
        }
        
        setWalletConnected(true)
      } catch (err) {
        console.error('Error checking wallet connection:', err)
        router.push('/connection')
      }
    }
    
    checkWalletConnection()
  }, [router])
  
  // Function to ensure we're on Sepolia network
  async function ensureSepoliaNetwork() {
    if (!window.ethereum) return false
    
    try {
      // Check current network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      
      if (chainId !== SEPOLIA_CHAIN_ID) {
        try {
          // Try to switch to Sepolia
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          })
          return true
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [SEPOLIA_CONFIG],
              })
              return true
            } catch (addError) {
              setError('Failed to add Sepolia network to MetaMask')
              return false
            }
          } else {
            setError('Failed to switch to Sepolia network')
            return false
          }
        }
      }
      
      // Update network name display
      setNetworkName('Sepolia')
      return true
    } catch (error) {
      console.error('Error ensuring Sepolia network:', error)
      return false
    }
  }
  
  // Mock NFT data that will be used directly
  const mockNftData = [
    {
      contractAddress: "0x76BE3b62873462d2142405439777e971754E8E77",
      tokenId: "1",
      balance: "1",
      metadata: {
        name: "FireSword",
        description: "This is a mock NFT for development",
        image: "https://i.ibb.co/4n302qh6/1.jpg",
      },
      uri: "https://example.com/mock/1"
    },
    
  ]
  
  useEffect(() => {
    // Only proceed if wallet is connected
    if (!walletConnected) return
    
    async function initializeDisplay() {
      try {
        setLoading(true)
        
        // Ensure we're on Sepolia
        const onSepolia = await ensureSepoliaNetwork()
        if (!onSepolia) {
          setLoading(false)
          return
        }
        
        // Display the mock NFT data directly
        setNfts(mockNftData)
        setLoading(false)
      } catch (err: any) {
        setError(err.message || 'Failed to initialize display')
        setLoading(false)
      }
    }
    
    initializeDisplay()
    
    // Listen for account changes and network changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // Wallet disconnected, redirect to connection page
          router.push('/connection')
        } else {
          // Just reset the display with the mock data
          setNfts(mockNftData)
        }
      }
      
      const handleChainChanged = () => {
        // Reload when the network changes
        ensureSepoliaNetwork().then(onSepolia => {
          if (onSepolia) {
            setNfts(mockNftData)
          }
        })
      }
      
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [walletConnected, router])
  
  // Don't render the main content until we've confirmed wallet is connected
  if (!walletConnected) {
    return (
      <div className="container max-w-4xl py-10 text-center">
        <h1 className="text-2xl font-heading font-bold mb-4">Checking wallet connection...</h1>
        <div className="flex justify-center">
          <RefreshCw className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    )
  }
  
  // Rest of your component remains the same
  const handleContinue = () => {
    if (selectedNft !== null) {
      // In a real app, you would save the selected NFT to state or pass it to the next page
      const selected = nfts[selectedNft]
      localStorage.setItem('selectedNFT', JSON.stringify(selected))
      router.push('/bridge')
    }
  }
  
  const refreshNFTs = async () => {
    setLoading(true)
    setError(null)
    
    // Ensure we're on Sepolia before refreshing
    const onSepolia = await ensureSepoliaNetwork()
    if (!onSepolia) {
      setLoading(false)
      return
    }
    
    // Simply simulate a reload with a brief loading state
    setTimeout(() => {
      setNfts([...mockNftData]) // Create a new array reference to trigger re-render
      setLoading(false)
    }, 800)
  }
  
  return (
    <div className="container max-w-4xl py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link 
            href="/connection"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Wallet Connection
          </Link>
          <h1 className="text-3xl font-heading font-bold">Select an NFT</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {networkName && (
            <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {networkName}
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={refreshNFTs}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">ERC-1155 NFTs in Your Wallet (Sepolia)</h2>
        <p className="text-muted-foreground">
          Select an NFT to bridge from Ethereum Sepolia to Solana
        </p>
      </div>
      
      {/* Rest of your component remains the same... */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : nfts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nfts.map((nft, index) => {
            const isSelected = selectedNft === index
            const name = nft.metadata?.name || `Token #${nft.tokenId}`
            const image = nft.metadata?.image || "/placeholder-nft.png"
            
            return (
              <Card 
                key={`${nft.contractAddress}-${nft.tokenId}`}
                className={`overflow-hidden cursor-pointer transition-all border-2 ${isSelected ? 'border-primary scale-[1.02]' : 'hover:border-gray-400'}`}
                onClick={() => setSelectedNft(index)}
              >
                <div className="relative">
                  <img 
                    src={image.replace('ipfs://', 'https://ipfs.io/ipfs/')} 
                    alt={name}
                    className="h-48 w-full object-cover"
                    onError={(e) => e.currentTarget.src = "/placeholder-nft.png"}
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {nft.balance} owned
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate">{name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {nft.contractAddress.substring(0, 6)}...{nft.contractAddress.substring(38)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Token ID: {nft.tokenId}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground mb-2">No ERC-1155 NFTs found in your wallet on Sepolia</p>
          <p className="text-sm">Make sure your wallet contains ERC-1155 tokens on Sepolia or try refreshing</p>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Button 
          size="lg" 
          className="px-8"
          disabled={selectedNft === null}
          onClick={handleContinue}
        >
          Continue with Selected NFT 
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          Select an NFT to continue with the bridging process
        </p>
      </div>
    </div>
  )
}