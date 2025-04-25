"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Wallet, AlertCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function ConnectWallet() {
  const [ethereumConnected, setEthereumConnected] = useState(false)
  const [solanaConnected, setSolanaConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState({ ethereum: false, solana: false })
  const [error, setError] = useState<string | null>(null)

  const connectEthereum = async () => {
    setIsConnecting(prev => ({ ...prev, ethereum: true }))
    setError(null)
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length > 0) {
          setEthereumConnected(true)
        } else {
          throw new Error("No accounts found")
        }
      } else {
        throw new Error("MetaMask not installed")
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to Ethereum wallet")
    } finally {
      setIsConnecting(prev => ({ ...prev, ethereum: false }))
    }
  }

  const connectSolana = async () => {
    setIsConnecting(prev => ({ ...prev, solana: true }))
    setError(null)
    
    try {
      // Check if Glow wallet is installed
      if (typeof window.glow !== 'undefined') {
        // Request connection
        const resp = await window.glow.connect()
        if (resp.publicKey) {
          setSolanaConnected(true)
        } else {
          throw new Error("Failed to get public key")
        }
      } else {
        throw new Error("Glow wallet not installed")
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to Solana wallet")
    } finally {
      setIsConnecting(prev => ({ ...prev, solana: false }))
    }
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex items-center mb-8">
        <Link 
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-heading font-bold">Connect Your Wallets</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Ethereum Wallet</CardTitle>
              {ethereumConnected && <Badge className="bg-green-500">Connected</Badge>}
            </div>
            <CardDescription>Connect your MetaMask wallet to burn NFTs on Ethereum</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-6 border rounded-lg bg-slate-50 dark:bg-slate-900/30">
              <img 
                src="/metamask-fox.svg" 
                alt="MetaMask" 
                className="h-24"
                onError={(e) => e.currentTarget.src = "https://cdn.worldvectorlogo.com/logos/metamask.svg"}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant={ethereumConnected ? "outline" : "default"}
              onClick={connectEthereum}
              disabled={isConnecting.ethereum}
            >
              {isConnecting.ethereum ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : ethereumConnected ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Connected
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect MetaMask
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Solana Wallet</CardTitle>
              {solanaConnected && <Badge className="bg-green-500">Connected</Badge>}
            </div>
            <CardDescription>Connect your Glow wallet to mint NFTs on Solana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-6 border rounded-lg bg-slate-50 dark:bg-slate-900/30">
              <img 
                src="/glow-wallet.svg" 
                alt="Glow Wallet" 
                className="h-24"
                onError={(e) => e.currentTarget.src = "https://glow.app/assets/logo.svg"}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant={solanaConnected ? "outline" : "default"}
              onClick={connectSolana}
              disabled={isConnecting.solana}
            >
              {isConnecting.solana ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : solanaConnected ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Connected
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Glow
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button 
          size="lg" 
          className="px-8"
          disabled={!ethereumConnected || !solanaConnected}
          onClick={() => window.location.href = '/select-nft'}
        >
          Continue to Select NFT
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          Both wallets must be connected to continue with the bridging process
        </p>
      </div>
    </div>
  )
}