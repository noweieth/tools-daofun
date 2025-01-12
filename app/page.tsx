"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { shortAddress } from "./utils";
import { useSolanaProvider } from "./provider/provider";

export default function Home() {
  const [listPrivateKey, setListPrivateKey] = useState("");

  const { token } = useSolanaProvider();
  return (
    <div className="font-[family-name:var(--font-geist-sans)] bg-black text-white max-w-[1024px] mx-auto min-h-screen mt-4">
      <div className="w-full text-center font-bold">TOOLS DAOFUN</div>
      <main className="mt-2">
        <div className="">
          <div className="text-white">
            <div className="">Address: {token?.address}</div>
            <div className="">Name: {token?.name}</div>
            <div className="">Symbol: {token?.symbol}</div>
          </div>
          <textarea
            name="private-key"
            className="border w-full p-2 mt-2 text-black"
            placeholder="List Private Key"
            onChange={(e) => setListPrivateKey(e.target.value)}
          ></textarea>

          <div className="mt-4 space-y-2">
            {listPrivateKey
              .split("\n")
              .map((privateKey: string, index: number) => {
                return (
                  <OneWallet
                    key={privateKey}
                    privateKey={privateKey}
                    index={index}
                  />
                );
              })}
          </div>
        </div>
      </main>
    </div>
  );
}

function OneWallet({
  privateKey,
  index,
}: {
  privateKey: string;
  index: number;
}) {
  const { solana } = useSolanaProvider();
  console.log(solana);

  const [wallet, setWallet] = useState({
    privateKey: privateKey,
    address: "",
  });
  useEffect(() => {
    setWallet({
      privateKey: privateKey,
      address: solana?.importWallet(privateKey) as any,
    });
  }, [privateKey]);

  return (
    <div className="flex justify-around">
      <div className="min-w-[400px]">
        {index + 1}. {shortAddress(wallet?.address as any)}
      </div>
      <button className="bg-white border min-w-10 px-2 text-black">
        Buy FCFS
      </button>
      <button className="bg-white border min-w-10 px-2 text-black">
        Buy Public
      </button>
    </div>
  );
}
