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
  
  useEffect(() => {
    async function checkConnection() {
      if (typeof window.ethereum === 'undefined') {
        setError('MetaMask is not installed. Please go back and connect your wallet.')
        setLoading(false)
        return false
      }
      
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length === 0) {
          setError('No wallet connected. Please go back and connect your MetaMask wallet.')
          setLoading(false)
          return false
        }
        return true
      } catch (err: any) {
        setError(err.message || 'Failed to check wallet connection')
        setLoading(false)
        return false
      }
    }
    
    async function fetchNFTs() {
      const connected = await checkConnection()
      if (!connected) return
      
      try {
        setLoading(true)
        
        // Get the current wallet address
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        const address = accounts[0]
        
        // Create ethers provider from MetaMask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        
        // This would typically be a backend API call to fetch all ERC1155 contracts owned by the user
        // For demonstration, we'll use a mock service or direct chain queries
        
        // Example query to Moralis or Alchemy could go here
        // For demo purposes, let's assume we get these contract addresses 
        // (In a real app, you would query an indexer API)
        const erc1155Contracts = [
          // These are example contract addresses - replace with real ones
          "0x76BE3b62873462d2142405439777e971754E8E77",
          "0x495f947276749Ce646f68AC8c248420045cb7b5e" // OpenSea Shared Storefront
        ]
        
        const nftData = []
        
        for (const contractAddress of erc1155Contracts) {
          const contract = new ethers.Contract(
            contractAddress,
            ERC1155_INTERFACE,
            provider
          )
          
          // In a real app, you'd need to know which tokenIds to query
          // This would typically come from an indexer like Moralis, Alchemy, or The Graph
          // For demonstration, we'll mock some token IDs
          const mockTokenIds = ["1", "2", "3"]
          
          // Create arrays for batch balance checking
          const accounts = mockTokenIds.map(() => address)
          const tokenIds = mockTokenIds.map(id => ethers.BigNumber.from(id))
          
          // Get balances for all tokens at once
          const balances = await contract.balanceOfBatch(accounts, tokenIds)
          
          // Process the results
          for (let i = 0; i < mockTokenIds.length; i++) {
            const balance = balances[i]
            if (balance.gt(0)) {
              // Token is owned by the user
              const tokenId = mockTokenIds[i]
              let uri = ""
              let metadata = {}
              
              try {
                // Get the token URI
                uri = await contract.uri(tokenId)
                
                // Replace ipfs:// with https gateway if needed
                const formattedUri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
                
                // Replace any token ID placeholders in the URI string
                // Some ERC1155 contracts use {id} placeholder in the URI
                const tokenIdHex = ethers.utils.hexZeroPad(ethers.BigNumber.from(tokenId).toHexString(), 32).slice(2)
                const fullUri = formattedUri.replace('{id}', tokenIdHex)
                
                // Fetch metadata
                const response = await fetch(fullUri)
                if (response.ok) {
                  metadata = await response.json()
                }
              } catch (e) {
                console.error("Failed to fetch metadata for token", tokenId, e)
                metadata = { name: `Token #${tokenId}`, description: "Metadata unavailable" }
              }
              
              nftData.push({
                contractAddress,
                tokenId,
                balance: balance.toString(),
                metadata,
                uri
              })
            }
          }
        }
        
        setNfts(nftData)
        
      } catch (err: any) {
        setError(err.message || 'Failed to fetch NFTs')
      } finally {
        setLoading(false)
      }
    }
    
    fetchNFTs()
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', fetchNFTs)
      return () => {
        window.ethereum.removeListener('accountsChanged', fetchNFTs)
      }
    }
  }, [])
  
  const handleContinue = () => {
    if (selectedNft !== null) {
      // In a real app, you would save the selected NFT to state or pass it to the next page
      const selected = nfts[selectedNft]
      localStorage.setItem('selectedNFT', JSON.stringify(selected))
      router.push('/bridge')
    }
  }
  
  const refreshNFTs = () => {
    setLoading(true)
    setError(null)
    setNfts([])
    setSelectedNft(null)
    
    // Use setTimeout to give visual feedback that refresh is happening
    setTimeout(() => {
      // Re-run the effect to fetch NFTs
      const connected = checkConnection()
      if (connected) {
        fetchNFTs()
      }
    }, 500)
  }
  
  async function checkConnection() {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please go back and connect your wallet.')
      setLoading(false)
      return false
    }
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length === 0) {
        setError('No wallet connected. Please go back and connect your MetaMask wallet.')
        setLoading(false)
        return false
      }
      return true
    } catch (err: any) {
      setError(err.message || 'Failed to check wallet connection')
      setLoading(false)
      return false
    }
  }
  
  async function fetchNFTs() {
    try {
      setLoading(true)
      
      // Get the current wallet address
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      const address = accounts[0]
      
      // Create ethers provider from MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      
      // For demo purposes with example contracts
      const erc1155Contracts = [
        "0x76BE3b62873462d2142405439777e971754E8E77",
        "0x495f947276749Ce646f68AC8c248420045cb7b5e"
      ]
      
      const nftData = []
      
      for (const contractAddress of erc1155Contracts) {
        const contract = new ethers.Contract(
          contractAddress,
          ERC1155_INTERFACE,
          provider
        )
        
        // Mock token IDs for demonstration
        const mockTokenIds = ["1", "2", "3"]
        const accounts = mockTokenIds.map(() => address)
        const tokenIds = mockTokenIds.map(id => ethers.BigNumber.from(id))
        
        const balances = await contract.balanceOfBatch(accounts, tokenIds)
        
        for (let i = 0; i < mockTokenIds.length; i++) {
          const balance = balances[i]
          if (balance.gt(0)) {
            const tokenId = mockTokenIds[i]
            let uri = ""
            let metadata = {}
            
            try {
              uri = await contract.uri(tokenId)
              const formattedUri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
              const tokenIdHex = ethers.utils.hexZeroPad(ethers.BigNumber.from(tokenId).toHexString(), 32).slice(2)
              const fullUri = formattedUri.replace('{id}', tokenIdHex)
              
              const response = await fetch(fullUri)
              if (response.ok) {
                metadata = await response.json()
              }
            } catch (e) {
              console.error("Failed to fetch metadata for token", tokenId, e)
              metadata = { name: `Token #${tokenId}`, description: "Metadata unavailable" }
            }
            
            nftData.push({
              contractAddress,
              tokenId,
              balance: balance.toString(),
              metadata,
              uri
            })
          }
        }
      }
      
      setNfts(nftData)
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch NFTs')
    } finally {
      setLoading(false)
    }
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
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">ERC-1155 NFTs in Your Wallet</h2>
        <p className="text-muted-foreground">
          Select an NFT to bridge from Ethereum to Solana
        </p>
      </div>
      
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
          <p className="text-muted-foreground mb-2">No ERC-1155 NFTs found in your wallet</p>
          <p className="text-sm">Make sure your wallet contains ERC-1155 tokens or try refreshing</p>
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