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
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createSyncNativeInstruction,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { IDL_DAOFUN, DaoFun } from "./IDL";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { TOKEN } from "../constant/types";

const getProvider = () => {
  const connection = new Connection(
    "https://mainnet.helius-rpc.com/?api-key=9af21197-faa1-45de-bd64-f08b576e491b"
  );
  const wallet = new NodeWallet(new Keypair() as any);
  return new AnchorProvider(connection as any, wallet, {
    commitment: "finalized",
  });
};

const programId = new PublicKey(IDL_DAOFUN.address);

export class TokenDaofun {
  public address: string;
  public depositor: string;
  public tokenVault: string;
  public fundingVault: string;
  private solana: Solana | null = null;
  private programDaofun: Program<DaoFun>;

  constructor(
    address: string,
    depositor: string,
    tokenVault: string,
    fundingVault: string
  ) {
    if (!address) {
      throw new Error("Token address is required");
    }
    this.address = address;
    this.depositor = depositor;
    this.tokenVault = tokenVault;
    this.fundingVault = fundingVault;
    this.programDaofun = new Program<DaoFun>(
      IDL_DAOFUN as DaoFun,
      getProvider()
    );
    this.solana = new Solana();
  }

  async getInfo() {
    try {
      let json: any;

      const mintPublicKey = new PublicKey(this.address);

      const _inforToken: TOKEN = {
        ...json?.pairs?.[0],
        baseToken: {
          ...json?.pairs?.[0].baseToken,
        },
      };
      return json?.pairs
        ? _inforToken
        : {
            baseToken: {
              address: this.address,
            },
          };
    } catch (e: any) {
      console.log(`Error fetching token information: ${e.message}`);
    }
  }

  async createAssociatedTokenAccountIfNotExists(
    transaction: Transaction,
    ownerKeypair: Keypair,
    tokenMint: string,
    _TOKEN_PROGRAM_ID = TOKEN_PROGRAM_ID
  ) {
    const associatedTokenAddress = await getAssociatedTokenAddress(
      new PublicKey(tokenMint),
      ownerKeypair.publicKey,
      false,
      _TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const accountInfo = await this.solana?.connection.getAccountInfo(
      associatedTokenAddress
    );
    if (accountInfo === null) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          ownerKeypair.publicKey,
          associatedTokenAddress,
          ownerKeypair.publicKey,
          new PublicKey(tokenMint),
          _TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
    }

    return associatedTokenAddress;
  }

  async buyToken(buyerPrivateKey: string, amountIn: number) {
    try {
      console.log(buyerPrivateKey);
      const buyerSecretKey = bs58.decode(buyerPrivateKey);
      const buyerKeypair = Keypair.fromSecretKey(buyerSecretKey);

      const mintPublicKey = new PublicKey(this.address);

      const fundingMint = new PublicKey(this.solana?.WSOL as string);

      const depositor = new PublicKey(this.depositor);

      const tokenVault = new PublicKey(this.tokenVault);

      const fundingVault = new PublicKey(this.fundingVault);

      const transaction = new Transaction();

      const computeBudgetLimitInstruction =
        ComputeBudgetProgram.setComputeUnitLimit({
          units: 200000,
        });

      const computeBudgetPriceInstruction =
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 24183551,
        });

      transaction.add(computeBudgetPriceInstruction);

      transaction.add(computeBudgetLimitInstruction);

      const wSOLAccount = await this.createAssociatedTokenAccountIfNotExists(
        transaction,
        buyerKeypair,
        this.solana?.WSOL as string
      );

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: buyerKeypair.publicKey,
          toPubkey: wSOLAccount,
          lamports: amountIn * LAMPORTS_PER_SOL,
        }),
        createSyncNativeInstruction(wSOLAccount, TOKEN_PROGRAM_ID)
      );

      // const txAccountWSOL: any = await this.solana?.createTokenAccountWithSeed(
      //   buyerKeypair.publicKey.toString(),
      //   this.solana.WSOL,
      //   amountIn * LAMPORTS_PER_SOL
      // );

      // if (txAccountWSOL?.transaction) {
      //   transaction.add(txAccountWSOL?.transaction as any);
      // }

      const tokenOutAccount =
        await this.createAssociatedTokenAccountIfNotExists(
          transaction,
          buyerKeypair,
          mintPublicKey.toString(),
          TOKEN_2022_PROGRAM_ID
        );

      const [curvePDA] = await PublicKey.findProgramAddress(
        [Buffer.from("curve"), depositor.toBuffer()],
        programId
      );

      transaction.add(
        await (this.programDaofun.methods as any)
          .buyToken(
            new BN((amountIn * LAMPORTS_PER_SOL).toString()),
            new BN((0).toString())
          )
          .accounts({
            signer: buyerKeypair.publicKey,
            depositor: depositor,
            tokenMint: mintPublicKey,
            fundingMint: fundingMint,
            curve: curvePDA,
            signerTokenAta: tokenOutAccount,
            signerFundingAta: wSOLAccount,
            tokenVault: tokenVault,
            fundingVault: fundingVault,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
            fundingTokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          })
          .instruction()
      );

      let signature = await sendAndConfirmTransaction(
        this.solana?.connection as any,
        transaction,
        [buyerKeypair]
      );

      console.log(signature);

      const confirmed = await this.solana?.connection.confirmTransaction(
        signature
      );

      console.log(confirmed);
      return {
        confirmed: confirmed,
        signature: signature,
      };
    } catch (e) {
      console.log("Buy Error: ", buyerPrivateKey);
      await this.buyToken(buyerPrivateKey, amountIn);
    }
  }
}
