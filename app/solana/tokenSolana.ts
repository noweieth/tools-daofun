import { DEXSCREENER_API } from "@/constant/endpoint";
import { TOKEN, WALLET } from "@/constant/types";
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
import bs58 from "bs58";
import {
  fetchAllPoolKeysBase,
  fetchAllPoolKeysQuote,
  fetchPoolInfo,
} from "./getPoolKey";
import {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAccount,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  createCloseAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Liquidity } from "@raydium-io/raydium-sdk";
import { JitoTransactionExecutor } from "./jitoRpcExcutor";
// import { programs } from "@metaplex/js";
import axios from "axios";

const RAYDIUM_LIQUIDITY_PROGRAM_ID_V4 = new PublicKey(
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
);
const MPL_TOKEN_METADATA_PROGRAM_ID =
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
const METADATA_SEED = "metadata";
const BONDING_CURVE_SEED = "bonding-curve";
const SLIPPAGE_BASIS_POINTS = 100_000;

export class TokenSolana {
  public address: string;
  public apiUrl: string;
  public inforToken: TOKEN | any;
  private solana: Solana | null = null;
  private connection: Connection;
  public WSOL: string = process.env.NEXT_PUBLIC_WSOL || "";
  private FEE_WALLET: string = process.env.NEXT_PUBLIC_FEE_WALLET_SOLANA || "";
  private FEE: number = Number(process.env.NEXT_PUBLIC_FEE_SOL); // /1000
  private txExcutor: JitoTransactionExecutor | null;
  private JITO_FEE: string = process.env.NEXT_PUBLIC_JITO_FEE as string;
  private POOL_KEYS: any;
  private poolAddress: string = "";

  constructor(address: string, poolAddress: string) {
    if (!address) {
      throw new Error("Token address is required");
    }

    this.address = address;
    this.apiUrl = `${DEXSCREENER_API || ""}${address}`;
    this.solana = new Solana();
    this.connection = this.solana.connection;
    this.txExcutor = new JitoTransactionExecutor(this.connection);
    this.poolAddress = poolAddress;
    this.init();
  }

  async init() {
    try {
      this.inforToken = await this.getInfo();
      await this.getListHolder();
      try {
        this.POOL_KEYS = await this.getPoolKeysFromApi(this.address);
      } catch (e) {
        console.log("NOT FOUND POOL KEYS");
      }
      return this;
    } catch (e: any) {
      console.log(e.message);
    }
  }

  async getInfo() {
    try {
      let json: any;
      try {
        const res = await fetch(this.apiUrl);
        json = await res?.json();
      } catch (e) {}

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

  async getBalance(address: string) {
    try {
      const publicKey = new PublicKey(address);

      const tokenAccountAddress = await getAssociatedTokenAddress(
        new PublicKey(this.address),
        publicKey
      );

      const accountInfo = await getAccount(
        this.connection,
        tokenAccountAddress
      );
      return Number(
        BigInt(accountInfo.amount) /
          BigInt(Math.pow(10, this.inforToken.baseToken.decimals))
      );
    } catch (e: any) {
      console.error(e.message);
      return 0;
    }
  }

  async getPoolKeysFromApi(tokenAddress: string) {
    try {
      let poolKeys;
      let data = await axios.get(`${DEXSCREENER_API}${tokenAddress}`);
      console.log(data.data);
      const poolAddress = data?.data?.pairs.map((item: any) => {
        if (item.dexId == "raydium") {
          return item.pairAddress;
        }
      });
      // poolKeys = await fetchAllPoolKeysQuote(
      //   this.connection,
      //   new PublicKey(tokenAddress),
      //   {
      //     4: new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"),
      //     5: new PublicKey("27haf8L6oxUeXrHrgEgsexjSY5hbVUWEmvv9Nyxg8vQv"),
      //   }
      // );
      // console.log("poolKeys => ", poolKeys);
      // if (poolKeys.length == 0) {
      //   poolKeys = await fetchAllPoolKeysBase(
      //     this.connection,
      //     new PublicKey(tokenAddress),
      //     {
      //       4: new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"),
      //       5: new PublicKey("27haf8L6oxUeXrHrgEgsexjSY5hbVUWEmvv9Nyxg8vQv"),
      //     }
      //   );
      // }
      console.log(
        this.poolAddress != "undefined" ? this.poolAddress : poolAddress[0]
      );
      if (!poolKeys) {
        poolKeys = await fetchPoolInfo(
          this.connection,
          this.poolAddress && this.poolAddress != "undefined"
            ? this.poolAddress
            : poolAddress[0]
        );
        console.log("poolKeys => ", poolKeys);
      }
      return poolKeys;
    } catch (error) {
      console.log("Error fetching pool keys:", error);
      throw error;
    }
  }

  async transferToken(
    privateKey: string,
    recipientWallet: string,
    amount: number
  ) {
    try {
      const senderSecretKey = bs58.decode(privateKey);
      const senderKeypair = Keypair.fromSecretKey(senderSecretKey);

      const transaction = new Transaction();

      const computeBudgetLimitInstruction =
        ComputeBudgetProgram.setComputeUnitLimit({
          units: 30000,
        });

      const computeBudgetPriceInstruction =
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 500000,
        });
      // transaction.add(computeBudgetLimitInstruction);

      // transaction.add(computeBudgetPriceInstruction);

      const senderTokenAccount =
        await this.solana?.createAssociatedTokenAccountIfNotExists(
          senderKeypair.publicKey.toString(),
          this.address
        );

      const associatedTokenAddress = await getAssociatedTokenAddress(
        new PublicKey(this.address),
        senderKeypair.publicKey,
        true,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const accountInfo = await this.connection.getAccountInfo(
        associatedTokenAddress
      );
      if (accountInfo === null) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            senderKeypair.publicKey,
            ASSOCIATED_TOKEN_PROGRAM_ID,
            senderKeypair.publicKey,
            new PublicKey(this.address),
            TOKEN_2022_PROGRAM_ID
          )
        );
      }

      transaction.add(
        createTransferInstruction(
          senderKeypair.publicKey,
          new PublicKey(recipientWallet),
          senderKeypair.publicKey,
          Number(amount) * 10 ** Number(this.inforToken.baseToken.decimals),
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

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

  async getListHolder() {
    try {
      const tokenMint = new PublicKey(this.address);
      const accounts = await this.solana?.connection.getParsedProgramAccounts(
        new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // SPL Token Program ID
        {
          filters: [
            {
              dataSize: 165, // SPL Token Account size
            },
            {
              memcmp: {
                offset: 0, // Mint address is at offset 0
                bytes: tokenMint.toBase58(),
              },
            },
          ],
        }
      );

      const holders = accounts?.map((account) => ({
        address: (account?.account?.data as any)?.parsed?.info.owner,
        balance: (account?.account?.data as any)?.parsed?.info.tokenAmount
          .uiAmount,
      }));
      const sortedHolders = holders?.sort((a, b) => b.balance - a.balance);

      return sortedHolders?.slice(0, 150);
    } catch (e: any) {
      console.log(e.message);
    }
  }

  async buyToken(privateKey: string, amountIn: number) {
    try {
    } catch (e: any) {
      console.log(e);
      throw new Error(e);
    }
  }

  async sellToken(privateKey: string, amountIn: number) {
    try {
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async calculateAmountOut(
    connection: Connection,
    poolKeys: any,
    amountIn: number
  ) {
    try {
      const { baseVault, quoteVault } = poolKeys[0];
      const baseBalance = await connection.getTokenAccountBalance(baseVault);
      const quoteBalance = await connection.getTokenAccountBalance(quoteVault);

      const reserveIn = parseInt(baseBalance.value.amount) / LAMPORTS_PER_SOL;
      const reserveOut =
        parseInt(quoteBalance.value.amount) /
        10 ** this.inforToken.baseToken.decimals;

      const amountOut = (reserveIn * amountIn) / reserveOut;
      return amountOut;
    } catch (e: any) {
      console.log(e.message);
    }
  }

  async getPriceTokenRaydium() {
    try {
      if (!this.POOL_KEYS || this.POOL_KEYS.length == 0) return;
      const { baseVault, quoteVault } = this.POOL_KEYS[0];
      const baseBalance = (await this.solana?.connection.getTokenAccountBalance(
        baseVault
      )) as any;
      const quoteBalance =
        (await this.solana?.connection.getTokenAccountBalance(
          quoteVault
        )) as any;

      const reserveIn = parseInt(baseBalance?.value.amount) / LAMPORTS_PER_SOL;
      const reserveOut =
        parseInt(quoteBalance.value.amount) /
        10 ** this.inforToken.baseToken.decimals;

      const priceToken = reserveIn / reserveOut;
      return priceToken;
    } catch (e: any) {
      console.log("get price => ", e.message);
    }
  }
}
