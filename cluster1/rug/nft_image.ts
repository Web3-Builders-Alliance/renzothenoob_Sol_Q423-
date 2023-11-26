import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { createBundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr";
import { readFile } from "fs/promises";
import { PRIVATE_KEY } from "../env";
import bs58 from "bs58";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");
const bundlrUploader = createBundlrUploader(umi);
let keypair = umi.eddsa.createKeypairFromSecretKey(bs58.decode(PRIVATE_KEY));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

(async () => {
  try {
    const image = await readFile("./images/generug.png");
    const file = createGenericFile(image, "generug", {
      contentType: "image/png",
    });
    const [myUri] = await bundlrUploader.upload([file]);
    console.log("Your image URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
