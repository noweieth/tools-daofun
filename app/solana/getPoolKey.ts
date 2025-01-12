import { Connection, PublicKey } from "@solana/web3.js";
import {
  Liquidity,
  TokenAmount,
  LIQUIDITY_VERSION_TO_STATE_LAYOUT,
  LIQUIDITY_STATE_LAYOUT_V4,
  MARKET_STATE_LAYOUT_V3,
  getMultipleAccountsInfo,
  Market,
} from "@raydium-io/raydium-sdk";

export async function fetchAllPoolKeysQuote(
  connection: Connection,
  quote: any,
  programId: any,
  config?: any
) {
  try {
    const allPools = (
      await Promise.all(
        Object.entries(LIQUIDITY_VERSION_TO_STATE_LAYOUT).map(
          ([version, layout]) => {
            try {
              return connection
                .getProgramAccounts(programId[Number(version)], {
                  filters: [
                    { dataSize: layout.span },
                    {
                      memcmp: {
                        offset: LIQUIDITY_STATE_LAYOUT_V4.offsetOf("quoteMint"),
                        bytes: quote.toString(),
                      },
                    },
                  ],
                })
                .then((accounts) => {
                  return accounts.map((info) => {
                    return {
                      id: info.pubkey,
                      version: Number(version),
                      programId: programId[Number(version)],
                      ...layout.decode(info.account.data),
                    };
                  });
                });
            } catch (error) {
              if (error instanceof Error) {
                console.log("failed to fetch pool info", {
                  message: error.message,
                });
              }
            }
          }
        )
      )
    ).flat();

    const allMarketIds = allPools.map((i) => i?.marketId);
    let marketsInfo: any = {};
    try {
      const _marketsInfo = await getMultipleAccountsInfo(
        connection,
        allMarketIds as any,
        config
      );
      for (const item of _marketsInfo) {
        if (item === null) continue;

        const _i = {
          programId: item.owner,
          ...MARKET_STATE_LAYOUT_V3.decode(item.data),
        };
        marketsInfo[_i.ownAddress.toString()] = _i;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("failed to fetch markets", {
          message: error.message,
        });
      }
    }

    let authority: any = {};
    for (const [version, _programId] of Object.entries(programId))
      authority[version] = Liquidity.getAssociatedAuthority({
        programId: _programId as any,
      }).publicKey;

    const formatPoolInfos = [];
    for (const pool of allPools) {
      if (pool === undefined) continue;
      if (pool.baseMint.equals(PublicKey.default)) continue;
      const market = marketsInfo[pool.marketId.toString()];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const marketProgramId = market.programId;

      formatPoolInfos.push({
        id: pool.id,
        baseMint: pool.baseMint,
        quoteMint: pool.quoteMint,
        lpMint: pool.lpMint,
        baseDecimals: pool.baseDecimal.toNumber(),
        quoteDecimals: pool.quoteDecimal.toNumber(),
        lpDecimals:
          pool.id.toString() === "6kmMMacvoCKBkBrqssLEdFuEZu2wqtLdNQxh9VjtzfwT"
            ? 5
            : pool.baseDecimal.toNumber(),
        version: pool.version,
        programId: pool.programId,
        authority: authority[pool.version],
        openOrders: pool.openOrders,
        targetOrders: pool.targetOrders,
        baseVault: pool.baseVault,
        quoteVault: pool.quoteVault,
        marketVersion: 3,
        marketProgramId,
        marketId: market.ownAddress,
        marketAuthority: Market.getAssociatedAuthority({
          programId: marketProgramId,
          marketId: market.ownAddress,
        }).publicKey,
        marketBaseVault: market.baseVault,
        marketQuoteVault: market.quoteVault,
        marketBids: market.bids,
        marketAsks: market.asks,
        marketEventQueue: market.eventQueue,
        ...(pool.version === 5
          ? {
              modelDataAccount: (pool as any).modelDataAccount,
              withdrawQueue: PublicKey.default,
              lpVault: PublicKey.default,
            }
          : {
              withdrawQueue: (pool as any).withdrawQueue,
              lpVault: (pool as any).lpVault,
            }),
        lookupTableAccount: PublicKey.default,
      });
    }
    return formatPoolInfos;
  } catch (e: any) {
    console.log(e.message);
    return [];
  }
}

export async function fetchAllPoolKeysBase(
  connection: Connection,
  base: any,
  programId: any,
  config?: any
) {
  try {
    const allPools = (
      await Promise.all(
        Object.entries(LIQUIDITY_VERSION_TO_STATE_LAYOUT).map(
          ([version, layout]) => {
            try {
              return connection
                .getProgramAccounts(programId[Number(version)], {
                  filters: [
                    { dataSize: layout.span },
                    {
                      memcmp: {
                        offset: LIQUIDITY_STATE_LAYOUT_V4.offsetOf("baseMint"),
                        bytes: base.toString(),
                      },
                    },
                  ],
                })
                .then((accounts) => {
                  return accounts.map((info) => {
                    return {
                      id: info.pubkey,
                      version: Number(version),
                      programId: programId[Number(version)],
                      ...layout.decode(info.account.data),
                    };
                  });
                });
            } catch (error) {
              if (error instanceof Error) {
                console.log("failed to fetch pool info", {
                  message: error.message,
                });
              }
            }
          }
        )
      )
    ).flat();

    const allMarketIds = allPools.map((i) => i?.marketId);
    let marketsInfo: any = {};
    try {
      const _marketsInfo = await getMultipleAccountsInfo(
        connection,
        allMarketIds as any,
        config
      );
      for (const item of _marketsInfo) {
        if (item === null) continue;

        const _i = {
          programId: item.owner,
          ...MARKET_STATE_LAYOUT_V3.decode(item.data),
        };
        marketsInfo[_i.ownAddress.toString()] = _i;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("failed to fetch markets", {
          message: error.message,
        });
      }
    }

    const authority: any = {};
    for (const [version, _programId] of Object.entries(programId))
      authority[version] = Liquidity.getAssociatedAuthority({
        programId: _programId as any,
      }).publicKey;

    const formatPoolInfos = [];
    for (const pool of allPools) {
      if (pool === undefined) continue;
      if (pool.baseMint.equals(PublicKey.default)) continue;
      const market = marketsInfo[pool.marketId.toString()];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const marketProgramId = market.programId;

      formatPoolInfos.push({
        id: pool.id,
        baseMint: pool.baseMint,
        quoteMint: pool.quoteMint,
        lpMint: pool.lpMint,
        baseDecimals: pool.baseDecimal.toNumber(),
        quoteDecimals: pool.quoteDecimal.toNumber(),
        lpDecimals:
          pool.id.toString() === "6kmMMacvoCKBkBrqssLEdFuEZu2wqtLdNQxh9VjtzfwT"
            ? 5
            : pool.baseDecimal.toNumber(),
        version: pool.version,
        programId: pool.programId,
        authority: authority[pool.version],
        openOrders: pool.openOrders,
        targetOrders: pool.targetOrders,
        baseVault: pool.baseVault,
        quoteVault: pool.quoteVault,
        marketVersion: 3,
        marketProgramId,
        marketId: market.ownAddress,
        marketAuthority: Market.getAssociatedAuthority({
          programId: marketProgramId,
          marketId: market.ownAddress,
        }).publicKey,
        marketBaseVault: market.baseVault,
        marketQuoteVault: market.quoteVault,
        marketBids: market.bids,
        marketAsks: market.asks,
        marketEventQueue: market.eventQueue,
        ...(pool.version === 5
          ? {
              modelDataAccount: (pool as any).modelDataAccount,
              withdrawQueue: PublicKey.default,
              lpVault: PublicKey.default,
            }
          : {
              withdrawQueue: (pool as any).withdrawQueue,
              lpVault: (pool as any).lpVault,
            }),
        lookupTableAccount: PublicKey.default,
      });
    }
    return formatPoolInfos;
  } catch (e: any) {
    console.log(e.message);
    return [];
  }
}

export async function fetchPoolInfo(
  connection: Connection,
  poolAddress: string
) {
  try {
    const poolPublicKey = new PublicKey(poolAddress);

    // Lấy thông tin tài khoản của pool
    const poolAccountInfo = await connection.getAccountInfo(poolPublicKey);
    if (!poolAccountInfo) {
      throw new Error("Pool not found on the Solana blockchain.");
    }

    const programId = poolAccountInfo.owner;

    // Decode dữ liệu của pool
    const poolState = LIQUIDITY_STATE_LAYOUT_V4.decode(
      poolAccountInfo.data
    ) as any;

    // Lấy thông tin market liên quan
    const marketId = poolState.marketId;
    const marketAccountInfo = await connection.getAccountInfo(marketId);

    if (!marketAccountInfo) {
      throw new Error("Market associated with the pool not found.");
    }

    const marketState = MARKET_STATE_LAYOUT_V3.decode(marketAccountInfo.data);

    // Lấy authority của pool
    const poolAuthority = Liquidity.getAssociatedAuthority({
      programId,
    }).publicKey;

    // Lấy authority của market
    const marketAuthority = Market.getAssociatedAuthority({
      programId: marketAccountInfo.owner,
      marketId: marketState.ownAddress,
    }).publicKey;

    // Định dạng thông tin pool theo yêu cầu
    const poolInfo = {
      id: poolPublicKey,
      baseMint: poolState.baseMint,
      quoteMint: poolState.quoteMint,
      lpMint: poolState.lpMint,
      baseDecimals: poolState.baseDecimal.toNumber(),
      quoteDecimals: poolState.quoteDecimal.toNumber(),
      lpDecimals:
        poolPublicKey.toString() ===
        "6kmMMacvoCKBkBrqssLEdFuEZu2wqtLdNQxh9VjtzfwT"
          ? 5
          : poolState.baseDecimal.toNumber(),
      version: poolState.version,
      programId: programId,
      authority: poolAuthority,
      openOrders: poolState.openOrders,
      targetOrders: poolState.targetOrders,
      baseVault: poolState.baseVault,
      quoteVault: poolState.quoteVault,
      marketVersion: 3,
      marketProgramId: marketAccountInfo.owner,
      marketId: marketState.ownAddress,
      marketAuthority: marketAuthority,
      marketBaseVault: marketState.baseVault,
      marketQuoteVault: marketState.quoteVault,
      marketBids: marketState.bids,
      marketAsks: marketState.asks,
      marketEventQueue: marketState.eventQueue,
      ...(poolState.version === 5
        ? {
            modelDataAccount: poolState.modelDataAccount,
            withdrawQueue: PublicKey.default,
            lpVault: PublicKey.default,
          }
        : {
            withdrawQueue: poolState.withdrawQueue,
            lpVault: poolState.lpVault,
          }),
      lookupTableAccount: PublicKey.default,
    };

    return [poolInfo];
  } catch (error: any) {
    console.error("Error fetching pool info:", error.message);
    return null;
  }
}
