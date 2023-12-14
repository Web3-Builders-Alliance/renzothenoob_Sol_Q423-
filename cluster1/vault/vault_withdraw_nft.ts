import { SystemProgram, PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
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
  TOKEN_METADATA_PROGRAM_ID,
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

const mint = new PublicKey("F6qcnJK2u4G6jnLKLomprkucdbwWTiLMKbGCBft3Txkw");

(async () => {
  try {
    const metadataAccount = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )[0];
    const masterEdition = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )[0];

    // b"metadata", MetadataProgramID.key.as_ref(), mint.key.as_ref() "master"
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const ownerAta = await getOrCreateAssociatedTokenAccount(
      CONNECTION,
      WBA_KEYPAIR,
      mint,
      WBA_KEYPAIR.publicKey
    );

    // // Get the token account of the fromWallet address, and if it does not exist, create it
    const vaultAta = await getOrCreateAssociatedTokenAccount(
      CONNECTION,
      WBA_KEYPAIR,
      mint,
      vaultAuthKey,
      true,
      COMMITMENT
    );

    const signature = await program.methods
      .withdrawNft()
      .accounts({
        owner: WBA_KEYPAIR.publicKey,
        vaultState,
        vaultAuth: vaultAuthKey,
        ownerAta: ownerAta.address,
        vaultAta: vaultAta.address,
        tokenMint: mint,
        metadataProgram: TOKEN_METADATA_PROGRAM_ID,
        nftMetadata: metadataAccount,
        nftMasterEdition: masterEdition,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
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
