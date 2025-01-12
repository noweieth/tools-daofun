import { searcherClient as jitoSearcherClient } from "jito-ts/dist/sdk/block-engine/searcher.js";

const searcherClients: any[] = [];

const BLOCK_ENGINE_URLS = [
  "https://tokyo.mainnet.block-engine.jito.wtf/api/v1/bundles",
];

for (const url of BLOCK_ENGINE_URLS) {
  const client = jitoSearcherClient(url, undefined);
  searcherClients.push(client);
}

const searcherClient = searcherClients[0];
export { searcherClient, searcherClients };
