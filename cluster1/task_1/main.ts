import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import { CONNECTION, WBA_KEYPAIR } from "../config";

(async () => {
  try {
    const mint = await createMint(
      CONNECTION,
      WBA_KEYPAIR,
      WBA_KEYPAIR.publicKey,
      WBA_KEYPAIR.publicKey,
      6
    );

    console.log(mint.toString());

    const ata = await getOrCreateAssociatedTokenAccount(
      CONNECTION,
      WBA_KEYPAIR,
      mint,
      WBA_KEYPAIR.publicKey
    );

    console.log(`Your ata is: ${ata.address.toBase58()}`);

    const mintTx = await mintTo(
      CONNECTION,
      WBA_KEYPAIR,
      mint,
      ata.address,
      WBA_KEYPAIR.publicKey,
      1
    );
    console.log(`Your mint txid: ${mintTx}`);
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
