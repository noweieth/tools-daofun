// lib/GrpcClient.ts
import { credentials } from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "@grpc/grpc-js";

const GRPC_SERVER = "solana-yellowstone-grpc.publicnode.com:443";

export class GrpcClient {
  public client: any;

  constructor() {
    const packageDef = protoLoader.loadSync("./solana.proto", {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const proto = protoLoader.loadFileDescriptorSetFromObject(
      packageDef
    ) as any;
    this.client = new proto.SolanaService(GRPC_SERVER, credentials.createSsl());
  }

  async getBalance(address: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.GetBalance(
        { address },
        (error: Error | null, response: any) => {
          if (error) return reject(error);
          resolve(response.balance);
        }
      );
    });
  }

  async getTokenBalance(address: string, tokenMint: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.GetTokenBalance(
        { address, tokenMint },
        (error: Error | null, response: any) => {
          if (error) return reject(error);
          resolve(response.balance);
        }
      );
    });
  }
}
