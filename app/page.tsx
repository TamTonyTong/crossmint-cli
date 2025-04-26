import Link from "next/link"
import { ArrowRight, Code, Command, Github, Layers, Repeat } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Command className="h-6 w-6" />
              <span className="inline-block font-bold">EverNFTs</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link
                href="#features"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                How It Works
              </Link>
              <Link
                href="#docs"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Documentation
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="https://github.com" target="_blank" rel="noreferrer">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-background text-sm font-medium transition-colors hover:bg-muted hover:text-foreground">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </div>
              </Link>
              <Button>Get Started</Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-1.5 text-sm font-medium text-white">
              Seamless Cross-Chain NFT Management
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Bridge Your NFTs Between
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Ethereum & Solana
              </span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              EverNFTs is a powerful tool that lets you burn NFTs on Ethereum, mint upgraded versions
              on Solana, and track provenance across chains.
            </p>
            <div className="space-x-4">
              <Link href="/connection">
              <Button size="lg" className="gap-2">
                Bridge Now <ArrowRight className="h-4 w-4" />
              </Button>
              </Link>
              <Button size="lg" variant="outline">
                View Documentation
              </Button>
            </div>
          </div>
        </section>
        <section id="features" className="container space-y-12 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Key Features</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              EverNFTs provides a seamless experience for managing your NFTs across different blockchains.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Layers className="h-6 w-6 text-purple-500" />
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="font-bold">Burn on Ethereum</h3>
                <p className="text-muted-foreground">
                  Safely burn NFTs you own on the Ethereum blockchain with simple commands.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Code className="h-6 w-6 text-blue-500" />
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="font-bold">Mint on Solana</h3>
                <p className="text-muted-foreground">
                  Create new NFTs on Solana with upgraded metadata or enhanced functionality.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <Repeat className="h-6 w-6 text-green-500" />
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="font-bold">Track Provenance</h3>
                <p className="text-muted-foreground">
                  Maintain a verifiable link between original and new assets across different chains.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className="container space-y-12 bg-slate-50 py-12 dark:bg-slate-900/30 md:py-16 lg:py-24"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">How It Works</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              EverNFTs simplifies the process of moving your NFTs across chains in just a few steps.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            <div className="flex flex-col items-start space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <span className="text-lg font-bold text-purple-500">1</span>
              </div>
              <h3 className="text-xl font-bold">Connect Your Wallets</h3>
              <p className="text-muted-foreground">
                Link your Ethereum and Solana wallets to the CLI tool with secure authentication.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <span className="text-lg font-bold text-purple-500">2</span>
              </div>
              <h3 className="text-xl font-bold">Select NFT to Bridge</h3>
              <p className="text-muted-foreground">
                Choose which Ethereum NFT you want to bridge to Solana with a simple command.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <span className="text-lg font-bold text-purple-500">3</span>
              </div>
              <h3 className="text-xl font-bold">Burn Original NFT</h3>
              <p className="text-muted-foreground">
                Safely burn your original NFT on Ethereum, creating a verifiable record of the action.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <span className="text-lg font-bold text-purple-500">4</span>
              </div>
              <h3 className="text-xl font-bold">Mint on Solana</h3>
              <p className="text-muted-foreground">
                Create your new, upgraded NFT on Solana with enhanced metadata and functionality.
              </p>
            </div>
          </div>
        </section>
        <section className="container py-12 md:py-16 lg:py-20">
          <div className="mx-auto max-w-[58rem] space-y-6 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Ready to Bridge Your NFTs?</h2>
            <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Get started with EverNFTs today and unlock the full potential of your digital assets.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="gap-2">
                Install Now <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Documentation
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 EverNFTs. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
