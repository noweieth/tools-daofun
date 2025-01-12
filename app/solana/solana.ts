import * as bip39 from "bip39";
import {
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { derivePath } from "ed25519-hd-key";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createInitializeAccountInstruction,
} from "@solana/spl-token";
import { JitoTransactionExecutor } from "./jitoRpcExcutor";
import * as https from "https";
import { sleep } from "../utils";
import Decimal from "decimal.js";
import { WALLET } from "../constant/types";

const keepaliveAgent = new https.Agent({
  keepAlive: true,
  timeout: 4000,
  maxSockets: 2048,
  maxFreeSockets: 256,
});

export class Solana {
  public mnemonic: string = "";
  private index: number = 0;
  private wallets: WALLET[] = [];
  public connection: Connection;
  public WSOL: string = process.env.NEXT_PUBLIC_WSOL as string;
  private txExcutor: JitoTransactionExecutor | null;
  private JITO_FEE: string = process.env.NEXT_PUBLIC_JITO_FEE as string;

  constructor() {
    this.connection = new Connection(
      process.env.NEXT_PUBLIC_RPC_SOLANA as string,
      {
        wsEndpoint: process.env.NEXT_PUBLIC_WSS_SOLANA,
        commitment: "processed",
        httpAgent: keepaliveAgent,
      }
    );
    this.txExcutor = new JitoTransactionExecutor(this.connection);
    this.init();
  }

  async getBlock() {
    try {
      const latestBlockhash = await this.connection.getLatestBlockhash();
      setTimeout(() => this.getBlock(), 600);
    } catch (e) {
      console.log(e);
    }
  }

  init() {
    try {
      this.getIndex();
      this.getMnemonic();
    } catch (e: any) {
      console.log(e.message);
    }
  }

  async getbalanceNative(address: string): Promise<number | undefined> {
    try {
      const publicKey = new PublicKey(address);
      const balance = await this.connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
      return;
    } catch (e: any) {
      console.log(e.message);
    }
  }

  async createTokenAccountWithSeed(
    ownerPublickey: string,
    tokenMint: string,
    amountBuy: number = 0
  ) {
    try {
      const seed = "NOWEI" + new Date().getTime().toString();
      const derivedAccountPubkey = await PublicKey.createWithSeed(
        new PublicKey(ownerPublickey),
        seed,
        TOKEN_PROGRAM_ID
      );

      const accountInfo = await this.connection.getAccountInfo(
        derivedAccountPubkey
      );
      if (accountInfo !== null) {
        console.log("Account Exist: ", derivedAccountPubkey.toBase58());
        return derivedAccountPubkey;
      }

      const lamports = await this.connection.getMinimumBalanceForRentExemption(
        165
      );
      console.log(lamports);

      const transaction = new Transaction();

      transaction.add(
        SystemProgram.createAccountWithSeed({
          fromPubkey: new PublicKey(ownerPublickey),
          basePubkey: new PublicKey(ownerPublickey),
          seed: seed,
          newAccountPubkey: derivedAccountPubkey,
          lamports: lamports + amountBuy,
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        })
      );

      transaction.add(
        createInitializeAccountInstruction(
          new PublicKey(ownerPublickey),
          new PublicKey(tokenMint),
          TOKEN_PROGRAM_ID,
          derivedAccountPubkey
        )
      );
      return {
        transaction: transaction,
        account: derivedAccountPubkey,
      };
    } catch (e: any) {
      console.log(e.message);
      return null;
    }
  }

  async createAssociatedTokenAccountIfNotExists(
    ownerPublickey: string,
    tokenMint: string,
    _TOKEN_PROGRAM_ID: PublicKey = TOKEN_PROGRAM_ID
  ) {
    try {
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async transferSolana(
    privateKey: string,
    recipentWallet: string,
    amount: number
  ): Promise<any | undefined> {
    try {
      const senderSecretKey = bs58.decode(privateKey);

      const senderKeypair = Keypair.fromSecretKey(senderSecretKey);

      const recipientPublicKey = new PublicKey(recipentWallet);

      const transaction = new Transaction();
      console.log(Math.floor(amount * LAMPORTS_PER_SOL));
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey,
          toPubkey: recipientPublicKey,
          lamports: Math.floor(amount * LAMPORTS_PER_SOL),
        })
      );
      transaction.feePayer = senderKeypair.publicKey;

      let signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [senderKeypair]
      );
      console.log(signature);
      return {
        confirmed: true,
        signature: signature,
      };
    } catch (e: any) {
      console.log(e.message);
      throw new Error(e.message);
    }
  }

  async multiTransferSolana(
    privateKey: string,
    recipentWallets: string[],
    amount: number
  ): Promise<any | undefined> {
    try {
      console.log(recipentWallets);
      const senderSecretKey = bs58.decode(privateKey);

      const senderKeypair = Keypair.fromSecretKey(senderSecretKey);

      const transaction = new Transaction();

      for (const recipentWallet of recipentWallets) {
        const recipientPublicKey = new PublicKey(recipentWallet);
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: senderKeypair.publicKey,
            toPubkey: recipientPublicKey,
            lamports: Math.floor(amount * LAMPORTS_PER_SOL),
          })
        );
      }

      let signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [senderKeypair]
      );
      return {
        confirmed: true,
        signature: signature,
      };
    } catch (e: any) {
      console.log(e.message);
      throw new Error(e.message);
    }
  }

  async transferSolana1to1(
    privateKey: string,
    recipentWallet: string,
    amount: number
  ) {
    try {
      if (amount <= 0.001) throw Error("Min Transfer 0.001SOL");
      const MIN_FEE_GAS = 0.000005;
      const rand = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
      const wal = this.generateWallet(rand, rand + 1, false)[0];
      console.log(wal);
      await this.transferSolana(privateKey, wal.address, amount + MIN_FEE_GAS);
      await sleep(6000);
      let data = null,
        balance = 1;
      balance = (await this.getbalanceNative(wal.address)) || 0;
      const transferAmount = new Decimal(balance).minus(MIN_FEE_GAS).toNumber();
      data = await this.transferSolana(
        wal.privateKey,
        recipentWallet,
        transferAmount
      );
      return data;
    } catch (e: any) {
      throw Error(e.message);
    }
  }

  generateWallet(start: number, end: number, isSave: boolean = true): WALLET[] {
    try {
      const index = Number(window.localStorage.getItem("indexSolana")) || 0;
      const seed = bip39.mnemonicToSeedSync(this.mnemonic);
      let wallets = [];
      for (let i = start; i < end; i++) {
        const path = `m/44'/501'/${index + i}'/0'`;
        const { key } = derivePath(path, seed.toString("hex"));
        const account = Keypair.fromSeed(key.slice(0, 32));
        wallets.push({
          index: index + i,
          walletName: `Wallet ${index + i}`,
          address: account.publicKey.toString(),
          privateKey: bs58.encode(Buffer.from(account.secretKey)),
          balanceNative: 0,
          balanceToken: 0,
        });
      }
      if (isSave)
        window.localStorage.setItem(
          "indexSolana",
          (index + end - start).toString()
        );
      return wallets;
    } catch (e: any) {
      console.log("Generate wallet: ", e.message);
      return [];
    }
  }

  saveWallets(wallets: WALLET[], empty: boolean = false): void {
    try {
      if (typeof window !== "undefined" && (empty || wallets.length > 0)) {
        window.localStorage.setItem("walletSolana", JSON.stringify(wallets));
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }

  importWallets(listKey: string): WALLET[] {
    try {
      const wallets: WALLET[] = this.getWallets();
      const newWallets: WALLET[] = [];

      listKey.split("\n").map((_privateKey: string) => {
        try {
          console.log(_privateKey);
          const secretKey = bs58.decode(_privateKey.trim());
          console.log(secretKey);
          const account = Keypair.fromSecretKey(secretKey);
          const address = account.publicKey.toString();
          const privateKey = _privateKey;
          const isExist = wallets.find((item) => item.address == address);
          if (!isExist) {
            newWallets.push({
              address,
              privateKey,
            });
          }
        } catch (e: any) {
          console.log(e.message);
        }
      });

      return newWallets;
    } catch (e: any) {
      console.log(e.message);
      return [];
    }
  }

  getWallets(): WALLET[] {
    try {
      if (typeof window !== "undefined") {
        const _wallets = window.localStorage.getItem("walletSolana");
        if (_wallets) return JSON.parse(_wallets);
      }
      return [];
    } catch (e: any) {
      console.log(e.message);
      return [];
    }
  }

  generateMnemonic(): string | undefined {
    try {
      this.mnemonic = bip39.generateMnemonic();
      return this.mnemonic;
    } catch (e: any) {
      console.log(e.message);
    }
  }

  getMnemonic(): string | undefined {
    try {
      if (typeof window !== "undefined") {
        const _mnemonic = window.localStorage.getItem("mnemonic-12");
        if (!_mnemonic) {
          const _newMnemonic = this.generateMnemonic();
          this.mnemonic = _newMnemonic as string;
          this.saveMnemonic(this.mnemonic);
        } else {
          this.mnemonic = _mnemonic;
        }
        return this.mnemonic;
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }

  getIndex(): number | undefined {
    try {
      if (typeof window !== "undefined") {
        this.index = Number(window.localStorage.getItem("indexSUI"));
        return this.index;
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }

  saveMnemonic(mnemonic: string): void {
    try {
      if (typeof window !== "undefined" && mnemonic) {
        window.localStorage.setItem("mnemonic-12", mnemonic);
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }
}
