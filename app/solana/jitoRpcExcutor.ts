import {
  BlockhashWithExpiryBlockHeight,
  Keypair,
  PublicKey,
  SystemProgram,
  Connection,
  TransactionMessage,
  VersionedTransaction,
  Transaction,
} from "@solana/web3.js";
import axios, { AxiosError } from "axios";
import bs58 from "bs58";
import { Currency, CurrencyAmount } from "@raydium-io/raydium-sdk";
import { TransactionExecutor } from "./transactionExcutor";
import { sleep } from "../utils";
// import { searcherClient } from "jito-ts/dist/sdk/block-engine/searcher.js";

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 15000;

export class JitoTransactionExecutor implements TransactionExecutor {
  private jitpTipAccounts = [
    "Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY",
    "DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL",
    "96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5",
    "3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT",
    "HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe",
    "ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49",
    "ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt",
    "DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh",
  ];

  private JitoFeeWallet: PublicKey;
  private jitoFee: string = process.env.NEXT_PUBLIC_JITO_FEE as string;

  constructor(private readonly connection: Connection) {
    this.JitoFeeWallet = this.getRandomValidatorKey();
    if (typeof window !== "undefined") {
      const tipJITO = window.localStorage.getItem("tipJito");
      if (Number(tipJITO)) this.jitoFee = tipJITO as string;
    }
  }

  private getRandomValidatorKey(): PublicKey {
    const randomValidator =
      this.jitpTipAccounts[
        Math.floor(Math.random() * this.jitpTipAccounts.length)
      ];
    return new PublicKey(randomValidator);
  }

  public async executeAndConfirm(
    transaction: Transaction,
    payer: Keypair[]
  ): Promise<{ confirmed: boolean; signature?: string; error?: string }> {
    this.JitoFeeWallet = this.getRandomValidatorKey(); // Update wallet key each execution

    try {
      const fee = new CurrencyAmount(
        Currency.SOL,
        this.jitoFee,
        false
      ).raw.toNumber();
      console.log(`Calculated fee: ${fee} lamports`);

      const _transaction = transaction;

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: payer[0].publicKey,
          toPubkey: this.JitoFeeWallet,
          lamports: fee,
        })
      );

      let latestBlockhash = await this.connection.getLatestBlockhash({
        commitment: "confirmed",
      });

      for (let i = 0; i < 2; i++) {
        latestBlockhash = await this.connection.getLatestBlockhash({
          commitment: "confirmed",
        });
      }

      const txMessage = new TransactionMessage({
        payerKey: payer[0].publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: transaction.instructions,
      }).compileToV0Message();

      const txExcute = new VersionedTransaction(txMessage);
      txExcute.sign(payer);

      const serializedTransaction = bs58.encode(txExcute.serialize());
      const serializedTransactions = [serializedTransaction];

      const endpoints = [
        "https://tokyo.mainnet.block-engine.jito.wtf/api/v1/bundles",
      ];

      const requests = endpoints.map((url) =>
        axios.post(url, {
          jsonrpc: "2.0",
          id: 1,
          method: "sendBundle",
          params: [serializedTransactions],
        })
      );

      const jitoTxsignature = bs58.encode(txExcute.signatures[0]);

      console.log("Sending transactions to endpoints...");
      const results = await Promise.all(requests.map((p) => p.catch((e) => e)));

      const successfulResults = results.filter(
        (result) => !(result instanceof Error)
      );

      console.log("successfulResults => ", successfulResults);

      if (successfulResults.length > 0) {
        console.log(`At least one successful response`);
        console.log(`Confirming jito transaction...`, jitoTxsignature);
        // const confirm = await this.confirm(jitoTxsignature, latestBlockhash);
        // console.log(confirm);
        // const slot = await this.connection.getSlot();
        // console.log("slot => ", slot);
        const status = await this.checkJitoBundleStatus(
          successfulResults[0].data.result
        );
        if (status)
          return {
            confirmed: true,
            signature: jitoTxsignature,
          };
        else {
          const simulate = await this.connection.simulateTransaction(
            _transaction,
            payer
          );
          if (simulate.value.err) throw Error("Transaction Failed");
          return await this.executeAndConfirm(_transaction, payer);
        }
      } else {
        console.log(`No successful responses received for jito`);
      }

      return {
        confirmed: false,
        signature: jitoTxsignature,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(
          { error: error.response?.data },
          "Failed to execute jito transaction"
        );
      }
      console.log("Error during transaction execution", error);

      throw new Error(error as any);
      return {
        confirmed: false,
      };
    }
  }

  public async executeAndConfirmMulti(
    transaction: Transaction[],
    payer: [Keypair[]]
  ) {
    this.JitoFeeWallet = this.getRandomValidatorKey(); // Update wallet key each execution

    try {
      const fee = new CurrencyAmount(
        Currency.SOL,
        this.jitoFee,
        false
      ).raw.toNumber();
      console.log(`Calculated fee: ${fee} lamports`);

      transaction[0].add(
        SystemProgram.transfer({
          fromPubkey: payer[0][0].publicKey,
          toPubkey: this.JitoFeeWallet,
          lamports: fee,
        })
      );

      let latestBlockhash = await this.connection.getLatestBlockhash({
        commitment: "confirmed",
      });

      for (let i = 0; i < 8; i++) {
        latestBlockhash = await this.connection.getLatestBlockhash({
          commitment: "confirmed",
        });
      }
      const serializedTransactions = [] as any;
      for (let i = 0; i < transaction.length; i++) {
        const txMessage = new TransactionMessage({
          payerKey: payer[i][0].publicKey,
          recentBlockhash: latestBlockhash.blockhash,
          instructions: transaction[i].instructions,
        }).compileToV0Message();

        const txExcute = new VersionedTransaction(txMessage);
        txExcute.sign(payer[i]);

        const serializedTransaction = bs58.encode(txExcute.serialize());
        serializedTransactions.push(serializedTransaction);
      }

      const endpoints = [
        "https://tokyo.mainnet.block-engine.jito.wtf/api/v1/bundles",
      ];

      const requests = endpoints.map((url) =>
        axios.post(url, {
          jsonrpc: "2.0",
          id: 1,
          method: "sendBundle",
          params: [serializedTransactions],
        })
      );

      console.log("Sending transactions to endpoints...");
      const results = await Promise.all(requests.map((p) => p.catch((e) => e)));

      const successfulResults = results.filter(
        (result) => !(result instanceof Error)
      );

      console.log("successfulResults => ", successfulResults);

      if (successfulResults.length > 0) {
        console.log(`At least one successful response`);
        console.log(`Confirming jito transaction...`);
        // const status = await this.checkJitoBundleStatus(
        //   successfulResults[0].data.result
        // );
        // if (status)
        //   return {
        //     confirmed: true,
        //     signature: jitoTxsignature,
        //   };
        // else {
        //   const simulate = await this.connection.simulateTransaction(
        //     _transaction,
        //     payer
        //   );
        //   if (simulate.value.err) throw Error("Transaction Failed");
        //   return await this.executeAndConfirm(_transaction, payer);
        // }
      } else {
        console.log(`No successful responses received for jito`);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(
          { error: error.response?.data },
          "Failed to execute jito transaction"
        );
      }
      console.log("Error during transaction execution", error);

      throw new Error(error as any);
      return {
        confirmed: false,
      };
    }
  }

  public async executeAndConfirmWarp(
    transaction: Transaction,
    payer: Keypair[]
  ) {
    this.JitoFeeWallet = this.getRandomValidatorKey(); // Update wallet key each execution

    try {
      // const fee = new CurrencyAmount(
      //   Currency.SOL,
      //   this.jitoFee,
      //   false
      // ).raw.toNumber();
      // console.log(`Calculated fee: ${fee} lamports`);

      const _transaction = transaction;

      // transaction.add(
      //   SystemProgram.transfer({
      //     fromPubkey: payer[0].publicKey,
      //     toPubkey: this.JitoFeeWallet,
      //     lamports: fee,
      //   })
      // );

      const latestBlockhash = await this.connection.getLatestBlockhash();

      const txMessage = new TransactionMessage({
        payerKey: payer[0].publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: transaction.instructions,
      }).compileToV0Message();

      const txExcute = new VersionedTransaction(txMessage);
      txExcute.sign(payer);

      const fee = new CurrencyAmount(Currency.SOL, 1, false).raw.toNumber();
      const warpFeeMessage = new TransactionMessage({
        payerKey: payer[0].publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: [
          SystemProgram.transfer({
            fromPubkey: payer[0].publicKey,
            toPubkey: new PublicKey(
              "WARPzUMPnycu9eeCZ95rcAUxorqpBqHndfV3ZP5FSyS"
            ),
            lamports: fee,
          }),
        ],
      }).compileToV0Message();

      const warpFeeTx = new VersionedTransaction(warpFeeMessage);
      warpFeeTx.sign([payer[0]]);

      const serializedTransaction = bs58.encode(txExcute.serialize());
      const serializedTransactions = [
        bs58.encode(warpFeeTx.serialize()),
        serializedTransaction,
      ];

      const response = await axios.post<{
        confirmed: boolean;
        signature: string;
        error?: string;
      }>(
        "https://tx.warp.id/transaction/execute",
        {
          transactions: serializedTransactions,
          latestBlockhash,
        },
        {
          timeout: 100000,
        }
      );

      const jitoTxsignature = bs58.encode(txExcute.signatures[0]);

      console.log(
        "Sending transactions to endpoints...",
        response.data,
        jitoTxsignature
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(
          { error: error.response?.data },
          "Failed to execute jito transaction"
        );
      }
      console.log("Error during transaction execution", error);

      throw new Error(error as any);
      return {
        confirmed: false,
      };
    }
  }

  // async executeAndConfirmBloxRoute(
  //   transaction: Transaction,
  //   payer: Keypair[]
  // ): Promise<{ confirmed: boolean; signature?: string; error?: string }> {
  //   const feeWallet = this.getRandomValidatorKey(); // Update wallet key each execution
  //   const bloxrouteFee = 5000; // Fee in lamports, replace with dynamic calculation if needed

  //   try {
  //     console.log(`Calculated fee: ${bloxrouteFee} lamports`);
  //     // const provider = new HttpProvider();
  //     transaction.add(
  //       SystemProgram.transfer({
  //         fromPubkey: payer[0].publicKey,
  //         toPubkey: feeWallet,
  //         lamports: bloxrouteFee,
  //       })
  //     );

  //     const latestBlockhash = await this.connection.getLatestBlockhash();

  //     const txMessage = new TransactionMessage({
  //       payerKey: payer[0].publicKey,
  //       recentBlockhash: latestBlockhash.blockhash,
  //       instructions: transaction.instructions,
  //     }).compileToV0Message();

  //     const txExecute = new VersionedTransaction(txMessage);
  //     txExecute.sign(payer);

  //     const serializedTransaction = bs58.encode(txExecute.serialize());
  //     const serializedTransactions = [serializedTransaction];

  //     console.log("Sending transactions as a bundle to Bloxroute...");

  //     // const response = await axios.post(
  //     //   this.bloxrouteEndpoint,
  //     //   {
  //     //     transactions: serializedTransactions,
  //     //   },
  //     //   {
  //     //     headers: {
  //     //       Authorization: `Bearer ${this.bloxrouteApiKey}`,
  //     //       "Content-Type": "application/json",
  //     //     },
  //     //   }
  //     // );

  //     console.log("Bloxroute Response: ", response.data);

  //     const bundleId = response.data.bundleId;
  //     if (bundleId) {
  //       console.log(`Bundle ID: ${bundleId}`);
  //       console.log(`Confirming transaction...`);

  //       // Confirm the bundle status (You may need to implement `checkBundleStatus` based on Bloxroute docs)
  //       // const status = await this.checkBundleStatus(bundleId);
  //       // if (status) {
  //       //   console.log("Bundle confirmed.");
  //       //   return {
  //       //     confirmed: true,
  //       //     signature: bs58.encode(txExecute.signatures[0]),
  //       //   };
  //       // } else {
  //       //   console.error("Bundle not confirmed, retrying...");
  //       //   return await this.executeAndConfirm(transaction, payer);
  //       // }
  //     } else {
  //       console.error("Failed to send bundle.");
  //     }

  //     return {
  //       confirmed: false,
  //     };
  //   } catch (error) {
  //     console.error("Error during transaction execution:", error);
  //     throw new Error(error as any);
  //   }
  // }

  async checkJitoBundleStatus(bundleId: string) {
    try {
      const startTime = Date.now();
      let lastStatus = "";
      return true;
      while (Date.now() - startTime < POLL_TIMEOUT_MS) {
        await sleep(POLL_INTERVAL_MS);
        const response = await axios.post(
          "https://mainnet.block-engine.jito.wtf/api/v1/bundles",
          {
            jsonrpc: "2.0",
            id: 1,
            method: "getInflightBundleStatuses",
            params: [[bundleId]],
          }
        );
        console.log("response.data => ", response.data);
        const status = response.data.result.value[0].status;
        if (status == "Failed") {
          return false;
        }
        if (status == "Landed" || status == "Invalid") {
          return true;
        }
      }
    } catch (error) {
      console.error("Error checking bundle status:", error);
      throw error;
    }
  }

  private async confirm(
    signature: string,
    latestBlockhash: BlockhashWithExpiryBlockHeight
  ) {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Transaction Failed")), 25000)
    );
    const confirmation = this.connection.confirmTransaction(
      signature,
      "processed"
    );

    return Promise.race([confirmation, timeout]);

    // return { confirmed: !confirmation.value.err, signature };
  }
}
