import { Keypair, PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { WbaVault, WbaVaultID, WbaVaultIDL } from "../programs/vault";
import { ANCHOR_PROVIDER, WBA_KEYPAIR } from "../config";

const program = new Program<WbaVault>(WbaVaultIDL, WbaVaultID, ANCHOR_PROVIDER);

const vaultState = Keypair.generate();
console.log(`Vault public key: ${vaultState.publicKey.toBase58()}`);

// Create the PDA for our enrollment account
// Seeds are "auth", vaultState
const vaultAuth = [Buffer.from("auth"), vaultState.publicKey.toBuffer()];
const [vaultAuthKey, _bump] = PublicKey.findProgramAddressSync(
  vaultAuth,
  program.programId
);

// Create the vault key
// Seeds are "vault", vaultAuth
const vault = [Buffer.from("vault"), vaultAuthKey.toBuffer()];
const [vaultKey, _bump2] = PublicKey.findProgramAddressSync(
  vault,
  program.programId
);

// Execute our enrollment transaction
(async () => {
  try {
    const signature = await program.methods
      .initialize()
      .accounts({
        owner: WBA_KEYPAIR.publicKey,
        vault: vaultKey,
        vaultState: vaultState.publicKey,
        vaultAuth: vaultAuthKey,
        systemProgram: PublicKey.default,
      })
      .signers([WBA_KEYPAIR, vaultState])
      .rpc();

    console.log(
      `Init success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
