import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Program, BN } from "@coral-xyz/anchor";
import { WbaVault, WbaVaultID, WbaVaultIDL } from "../programs/vault";
import { ANCHOR_PROVIDER, WBA_KEYPAIR } from "../config";

const program = new Program<WbaVault>(WbaVaultIDL, WbaVaultID, ANCHOR_PROVIDER);

const vaultState = new PublicKey(
  "8uJR4uBP5dwjpH2Qjy3Z5fSh1RdSV9wmQDoPsJ8woFV9"
);

const vaultAuth = [Buffer.from("auth"), vaultState.toBuffer()];
const [vaultAuthKey, _bump] = PublicKey.findProgramAddressSync(
  vaultAuth,
  program.programId
);

const vault = [Buffer.from("vault"), vaultAuthKey.toBuffer()];
const [vaultKey, _bump2] = PublicKey.findProgramAddressSync(
  vault,
  program.programId
);

(async () => {
  try {
    const signature = await program.methods
      .deposit(new BN(LAMPORTS_PER_SOL / 1))
      .accounts({
        owner: WBA_KEYPAIR.publicKey,
        vault: vaultKey,
        vaultState: vaultState,
        vaultAuth: vaultAuthKey,
        systemProgram: PublicKey.default,
      })
      .signers([WBA_KEYPAIR])
      .rpc();
    console.log(
      `Deposit success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
