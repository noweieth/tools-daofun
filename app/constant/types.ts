export type TOKEN = {
  chainId?: string;
  dexId?: string;
  url?: string;
  pairAddress?: string;
  labels?: string[];
  priceNative?: string;
  priceUsd?: string;
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
  baseToken?: {
    address?: string;
    name?: string;
    symbol?: string;
    decimals?: string;
    supply?: string;
  };
  quoteToken?: {
    address?: string;
    name?: string;
    symbol?: string;
  };
  info?: {
    imageUrl?: string;
    websites?: { label: string; url: string }[];
    socials?: { type: string; url: string }[];
  };
  priceChange?: any;
  volume?: any;
};

export interface Transaction {
  txHash: string;
  amount: string;
  token: string;
  timestamp: Date;
  type: "BUY" | "SELL";
}

export type WALLET = {
  index?: number;
  walletName?: string;
  address: string;
  privateKey: string;
  balanceNative?: number;
  balanceToken?: number;
  txHistory?: Transaction[];
  allowance?: string;
  amountBuy?: number;
};

export type USER = {
  name?: string;
  telegramId?: string;
  telegramUsername?: string;
  authCode?: string;
};

export type HOLDER = {
  address: string;
  balance: number;
};

export type LOG = {
  time?: number;
  walletName?: string;
  address?: string;
  txHash?: string;
  type?: "BUY" | "SELL" | "TRANSFER";
  amount?: string;
  status?: boolean;
};
