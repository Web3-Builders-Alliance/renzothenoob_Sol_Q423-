import { PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { WbaVault, WbaVaultID, WbaVaultIDL } from "../programs/vault";
import { ANCHOR_PROVIDER, WBA_KEYPAIR } from "../config";

const program = new Program<WbaVault>(WbaVaultIDL, WbaVaultID, ANCHOR_PROVIDER);

const vaultState = new PublicKey(
  "8uJR4uBP5dwjpH2Qjy3Z5fSh1RdSV9wmQDoPsJ8woFV9"
);

(async () => {
  try {
    const signature = await program.methods
      .closeAccount()
      .accounts({
        owner: WBA_KEYPAIR.publicKey,
        vaultState: vaultState,
        closeVaultState: vaultState,
        systemProgram: PublicKey.default,
      })
      .signers([WBA_KEYPAIR])
      .rpc();

    console.log(
      `Init success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
