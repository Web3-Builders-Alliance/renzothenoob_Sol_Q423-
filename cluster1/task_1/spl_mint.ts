import { PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { CONNECTION, WBA_KEYPAIR } from "../config";

const mint = new PublicKey("3pmrtQL44upDqDhjZCkW7nkLrc4ihaiZTA3GohNsTeKJ");

(async () => {
  try {
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
