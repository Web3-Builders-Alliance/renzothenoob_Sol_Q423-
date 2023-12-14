import {
  Cluster,
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import { CLUSTER, PRIVATE_KEY } from "../env";
import base58 from "bs58";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Umi, createSignerFromKeypair } from "@metaplex-foundation/umi";

const COMMITMENT: Commitment = "finalized";

export const CLUSTER_API_URL: string = clusterApiUrl(CLUSTER as Cluster);

export const CONNECTION: Connection = new Connection(
  CLUSTER_API_URL,
  COMMITMENT
);

export const DECODED_KEYPAIR: Uint8Array = base58.decode(PRIVATE_KEY);

export const WBA_KEYPAIR: Keypair = Keypair.fromSecretKey(DECODED_KEYPAIR);

export const UMI: Umi = createUmi(CLUSTER_API_URL);

export const UMI_KEYPAIR =
  UMI.eddsa.createKeypairFromSecretKey(DECODED_KEYPAIR);

export const UMI_SIGNER_KEYPAIR = createSignerFromKeypair(UMI, UMI_KEYPAIR);

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
