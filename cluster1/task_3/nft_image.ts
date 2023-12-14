import { createGenericFile, signerIdentity } from "@metaplex-foundation/umi";
import { createBundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr";
import { readFile } from "fs/promises";
import { UMI, UMI_SIGNER_KEYPAIR } from "../config";

const bundlrUploader = createBundlrUploader(UMI);
UMI.use(signerIdentity(UMI_SIGNER_KEYPAIR));

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
