import {
  Keypair,
  Connection,
  Commitment,
  clusterApiUrl,
} from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import base58 from "bs58";
import { PRIVATE_KEY } from "../env";

const keypair = Keypair.fromSecretKey(base58.decode(PRIVATE_KEY));

const commitment: Commitment = "confirmed";
const connection = new Connection(clusterApiUrl("devnet"), commitment);

(async () => {
  try {
    const mint = await createMint(
      connection,
      keypair,
      keypair.publicKey,
      keypair.publicKey,
      6
    );

    console.log(mint.toString());
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
