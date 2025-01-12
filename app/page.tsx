"use client";
import Image from "next/image";
import { useState } from "react";
import { shortAddress } from "./utils";

export default function Home() {
  const [listPrivateKey, setListPrivateKey] = useState("");
  return (
    <div className="font-[family-name:var(--font-geist-sans)] max-w-[1024px] mx-auto min-h-screen mt-4">
      <div className="w-full text-center font-bold">TOOLS DAOFUN</div>
      <main className="mt-2">
        <div className="">
          <input
            type="text"
            className="border w-full p-2"
            placeholder="Token Address"
          />
          <textarea
            name="private-key"
            className="border w-full p-2 mt-2"
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
  return (
    <div className="flex justify-around">
      <div className="min-w-[400px]">
        {index + 1}. {shortAddress(privateKey)}
      </div>
      <button className="bg-white border min-w-10 px-2">Buy FCFS</button>
      <button className="bg-white border min-w-10 px-2">Buy Public</button>
    </div>
  );
}
