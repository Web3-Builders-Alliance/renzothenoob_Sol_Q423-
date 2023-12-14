import { PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { CONNECTION, WBA_KEYPAIR } from "../config";

const mint = new PublicKey("FugUWkAdEo8ZBX5DsN8UA7EF5UyE9N566hANWt7bw8X5");

const to = new PublicKey("9ZruUseERe35uyhg8ypdd3QS9T4Ydt3YkwBnmNgzkseb");

(async () => {
  try {
    const fromATA = await getOrCreateAssociatedTokenAccount(
      CONNECTION,
      WBA_KEYPAIR,
      mint,
      WBA_KEYPAIR.publicKey
    );

    const toATA = await getOrCreateAssociatedTokenAccount(
      CONNECTION,
      WBA_KEYPAIR,
      mint,
      to
    );

    const tx = await transfer(
      CONNECTION,
      WBA_KEYPAIR,
      fromATA.address,
      toATA.address,
      WBA_KEYPAIR.publicKey,
      1
    );

    console.log(tx);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
