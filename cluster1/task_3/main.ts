import {
  createGenericFile,
  generateSigner,
  percentAmount,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { createBundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr";
import { readFile } from "fs/promises";
import { UMI, UMI_SIGNER_KEYPAIR } from "../config";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import bs58 from "bs58";

const bundlrUploader = createBundlrUploader(UMI);
UMI.use(signerIdentity(UMI_SIGNER_KEYPAIR));
UMI.use(mplTokenMetadata());
(async () => {
  try {
    const imageFile = await readFile("./images/generug.png");
    const file = createGenericFile(imageFile, "generug", {
      contentType: "image/png",
    });
    const [imageUri] = await bundlrUploader.upload([file]);
    console.log("Your image URI: ", imageUri);

    const metadata = {
      name: "Sample",
      symbol: "SMPL",
      description: "A sample decription",
      image: imageUri,
      attributes: [{ trait_type: "Sample", value: "value" }],
      properties: {
        files: [
          {
            type: "image/png",
            uri: imageUri,
          },
        ],
      },
      creators: [],
    };
    const myUri = await bundlrUploader.uploadJson(metadata);

    console.log("Your metadata URI: ", myUri);

    const mint = generateSigner(UMI);

    let tx = await createNft(UMI, {
      mint,
      name: "RUGGING PULL",
      uri: "https://arweave.net/aL1UQLXkrDpoBCreOTwg0XHqZrBaC_94w1CLjlyzLbE",
      sellerFeeBasisPoints: percentAmount(20),
      symbol: "RUGPULL",
    });
    let result = await tx.sendAndConfirm(UMI);
    const signature = bs58.encode(result.signature);

    console.log(
      `Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
    console.log("Mint Address: ", mint.publicKey);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
