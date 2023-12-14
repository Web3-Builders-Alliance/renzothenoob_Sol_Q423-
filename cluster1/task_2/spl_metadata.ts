import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
} from "@metaplex-foundation/mpl-token-metadata";
import { signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_METADATA_PROGRAM_ID, UMI, UMI_SIGNER_KEYPAIR } from "../config";
import bs58 from "bs58";

const mint = new PublicKey("FugUWkAdEo8ZBX5DsN8UA7EF5UyE9N566hANWt7bw8X5");

UMI.use(signerIdentity(UMI_SIGNER_KEYPAIR));

const metadata_seeds = [
  Buffer.from("metadata"),
  TOKEN_METADATA_PROGRAM_ID.toBuffer(),
  mint.toBuffer(),
];

const [metadata_pda, _bump] = PublicKey.findProgramAddressSync(
  metadata_seeds,
  TOKEN_METADATA_PROGRAM_ID
);

(async () => {
  try {
    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      metadata: publicKey(metadata_pda.toString()),
      mint: publicKey(mint.toString()),
      mintAuthority: UMI_SIGNER_KEYPAIR,
      payer: UMI_SIGNER_KEYPAIR,
      updateAuthority: UMI_SIGNER_KEYPAIR.publicKey,
    };

    let data: DataV2Args = {
      name: "MyToken",
      symbol: "MT",
      uri: "https://arweave.net/judvAOVJdBnulCCMH-ImLDrUl8DIziEwiONJ-J4Z6M0",
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    };

    let args: CreateMetadataAccountV3InstructionArgs = {
      data,
      isMutable: true,
      collectionDetails: null,
    };

    let tx = createMetadataAccountV3(UMI, {
      ...accounts,
      ...args,
    });

    let result = await tx.sendAndConfirm(UMI);

    console.log(bs58.encode(result.signature));
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
