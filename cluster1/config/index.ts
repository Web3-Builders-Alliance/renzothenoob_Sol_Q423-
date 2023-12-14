import {
  Cluster,
  Commitment,
  Connection,
  Keypair,
  clusterApiUrl,
} from "@solana/web3.js";
import { CLUSTER, PRIVATE_KEY } from "../env";
import base58 from "bs58";

const COMMITMENT: Commitment = "confirmed";

export const CONNECTION: Connection = new Connection(
  clusterApiUrl(CLUSTER as Cluster),
  COMMITMENT
);

export const DECODED_KEYPAIR: Uint8Array = base58.decode(PRIVATE_KEY);

export const WBA_KEYPAIR: Keypair = Keypair.fromSecretKey(DECODED_KEYPAIR);
