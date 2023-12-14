import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} from "@solana/spl-token";
import {
  CONNECTION,
  TOKEN_METADATA_PROGRAM_ID,
  UMI,
  UMI_SIGNER_KEYPAIR,
  WBA_KEYPAIR,
} from "../config";
import {
  createGenericFile,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { PublicKey } from "@solana/web3.js";
import {
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
  createMetadataAccountV3,
} from "@metaplex-foundation/mpl-token-metadata";
import bs58 from "bs58";
import { createBundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr";
import { readFile } from "fs/promises";

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

    UMI.use(signerIdentity(UMI_SIGNER_KEYPAIR));

    const bundlrUploader = createBundlrUploader(UMI);

    const image = await readFile("./images/generug.png");
    const file = createGenericFile(image, "generug", {
      contentType: "image/png",
    });
    const [myUri] = await bundlrUploader.upload([file]);

    console.log("Your image URI: ", myUri);

    const metadata = {
      name: "Sample",
      symbol: "SMPL",
      description: "A sample decription",
      image: myUri,
      attributes: [{ trait_type: "Sample", value: "value" }],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image,
          },
        ],
      },
      creators: [],
    };

    const metadataURI = await bundlrUploader.uploadJson(metadata);

    console.log("Your metadata URI: ", metadataURI);

    const metadata_seeds = [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ];

    const [metadata_pda, _bump] = PublicKey.findProgramAddressSync(
      metadata_seeds,
      TOKEN_METADATA_PROGRAM_ID
    );

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
      uri: metadataURI,
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

    const to = new PublicKey("9ZruUseERe35uyhg8ypdd3QS9T4Ydt3YkwBnmNgzkseb");

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

    const tx1 = await transfer(
      CONNECTION,
      WBA_KEYPAIR,
      fromATA.address,
      toATA.address,
      WBA_KEYPAIR.publicKey,
      1
    );

    console.log(tx1);
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
