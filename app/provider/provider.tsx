/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
"use client";
import { useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { WALLET } from "../constant/types";
import { Solana } from "../solana/solana";
import { Connection, PublicKey } from "@solana/web3.js";

export const SolanaContext = createContext<{
  token?: any;
  createWallet?: any;
  wallets?: WALLET[];
  setWallets?: any;
  removeWallet?: any;
  updateWallets?: any;
  solana?: Solana;
  priceToken?: number;
  getLogs?: any;
  statistics?: any;
}>({});

export function SolanaProvider(props: any) {
  const PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  const searchParams = useSearchParams();

  const [solana, setSolana] = useState<Solana>();
  const [token, setToken] = useState<any>({
    address: "Please input address",
    name: "Please input address",
    symbol: "Please input address",
  });
  const [wallets, setWallets] = useState<WALLET[]>([]);
  const [priceToken, setPriceToken] = useState(0);
  const [statistics, setStatistics] = useState({
    totalToken: "0%",
    totalSol: "0 SOL",
    totalPool: "0 SOL",
    unrealizeProfit: "0 SOL",
  });

  const init = async () => {
    try {
      const _Solana = new Solana();
      setSolana(_Solana);
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const initToken = async (address: string) => {
    try {
      const poolAddress = searchParams.get("pair") as string;
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const getMetadata = async (mintAddress: string, rpcUrl: string) => {
    try {
    } catch (error) {
      console.error("Error fetching metadata:", error);
      return null;
    }
  };

  const getStatistics = async () => {
    try {
      const totalSol = wallets.reduce(
        (total, wallet) => total + Number(wallet.balanceNative),
        0
      );

      const totalToken = wallets.reduce(
        (total, wallet) => total + Number(wallet.balanceToken),
        0
      );

      setStatistics({
        ...statistics,
        totalSol: `${totalSol.toFixed(4)} SOL`,
        totalToken: `${Number(totalToken / 10_000_000).toFixed(4)}%`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const createWallet = async () => {
    try {
      const _wallets = solana?.generateWallet(0, 1) as any;
      for (const _wallet of _wallets) {
        wallets?.push({
          walletName: `Wallet ${_wallet?.index}`,
          address: _wallet.address,
          privateKey: _wallet.privateKey,
          balanceNative: 0,
          balanceToken: 0,
        });
      }
      setWallets([...wallets]);
      toast.success("Added new wallet");
    } catch (e: any) {
      toast.error("Create wallet error");
      console.log(e.message);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setToken({ address: searchParams.get("address") });
    getMetadata(
      searchParams.get("address") as string,
      process.env.NEXT_PUBLIC_RPC_SOLANA as string
    );
  }, [searchParams.get("address")]);

  return (
    <SolanaContext.Provider
      value={{
        token,
        wallets,
        setWallets,
        createWallet,
        solana,
        priceToken,
        statistics,
      }}
    >
      {props.children}
    </SolanaContext.Provider>
  );
}

export const useSolanaProvider = () => useContext(SolanaContext);
