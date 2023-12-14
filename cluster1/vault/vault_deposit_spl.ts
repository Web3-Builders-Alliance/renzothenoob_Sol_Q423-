import { SystemProgram, PublicKey } from "@solana/web3.js";
import { Program, BN } from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { WbaVault, WbaVaultID, WbaVaultIDL } from "../programs/vault";
import {
  ANCHOR_PROVIDER,
  COMMITMENT,
  CONNECTION,
  WBA_KEYPAIR,
} from "../config";

const program = new Program<WbaVault>(WbaVaultIDL, WbaVaultID, ANCHOR_PROVIDER);

// Create a random keypair
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

const token_decimals = 1_000_000n;

const mint = new PublicKey("5WdcAyw57G3QEWR7BQEmkKYiLgtM8Zoa5VLhEnwDkchg");

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const ownerAta = await getOrCreateAssociatedTokenAccount(
      CONNECTION,
      WBA_KEYPAIR,
      mint,
      WBA_KEYPAIR.publicKey,
      false,
      COMMITMENT
    );

    // Get the token account of the fromWallet address, and if it does not exist, create it
    const vaultAta = await getOrCreateAssociatedTokenAccount(
      CONNECTION,
      WBA_KEYPAIR,
      mint,
      vaultAuthKey,
      true,
      COMMITMENT
    );
    const signature = await program.methods
      .depositSpl(new BN(0.0000001))
      .accounts({
        owner: WBA_KEYPAIR.publicKey,
        vaultState,
        vaultAuth: vaultAuthKey,
        systemProgram: SystemProgram.programId,
        ownerAta: ownerAta.address,
        vaultAta: vaultAta.address,
        tokenMint: mint,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
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
