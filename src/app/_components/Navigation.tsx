"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Wallet } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ConnectButton } from "@/components/ConnectButton";

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="flex items-center h-16 px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center mr-8 text-xl font-bold">
            <span className="mr-2">💰</span>
            <span>Plutus</span>
          </div>
          <Button variant={pathname === "/" ? "default" : "ghost"} asChild>
            <Link href="/">
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Deposit
            </Link>
          </Button>
          <Button variant={pathname === "/positions" ? "default" : "ghost"} asChild>
            <Link href="/positions">
              <Wallet className="w-4 h-4 mr-2" />
              My Positions
            </Link>
          </Button>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
