import { DEXSCREENER_API } from "@/constant/endpoint";
import { Solana } from "./solana";
import {
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  ComputeBudgetProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { JitoTransactionExecutor } from "./jitoRpcExcutor";
import bs58 from "bs58";
import fs from "fs";
import FormData from "form-data";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { IDL, PumpFun } from "./IDL";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { LOG, WALLET } from "@/constant/types";
import { Logs } from "../logs";

const MPL_TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const METADATA_SEED = "metadata";
const BONDING_CURVE_SEED = "bonding-curve";
const SLIPPAGE_BASIS_POINTS: bigint = 100n;

const getProvider = () => {
  const connection = new Connection("https://solana-rpc.publicnode.com");
  const wallet = new NodeWallet(new Keypair());
  return new AnchorProvider(connection, wallet, { commitment: "finalized" });
};

type BONDING_CURVE_TYPE = {
  virtualTokenReserves: bigint;
  virtualSolReserves: bigint;
  realTokenReserves: bigint;
  realSolReserves: bigint;
};

export class TokenPumpfun {
  public BONDING_CURVE_DATA: BONDING_CURVE_TYPE = {
    virtualTokenReserves: BigInt(0),
    virtualSolReserves: BigInt(0),
    realTokenReserves: BigInt(0),
    realSolReserves: BigInt(0),
  };

  constructor(address: string) {
    if (!address) {
      throw new Error("Token address is required");
    }
  }
}
