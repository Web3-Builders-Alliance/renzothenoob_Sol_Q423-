import { createMint } from "@solana/spl-token";
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
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
