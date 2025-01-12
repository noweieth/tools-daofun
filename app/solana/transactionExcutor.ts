import {
  BlockhashWithExpiryBlockHeight,
  Keypair,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";

export interface TransactionExecutor {
  executeAndConfirm(
    transaction: Transaction,
    payer: Keypair[],
    latestBlockHash: BlockhashWithExpiryBlockHeight
  ): Promise<{ confirmed: boolean; signature?: string; error?: string }>;
}
