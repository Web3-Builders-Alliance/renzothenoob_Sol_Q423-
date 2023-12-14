import { signerIdentity } from "@metaplex-foundation/umi";
import { createBundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr";
import { UMI, UMI_SIGNER_KEYPAIR } from "../config";

const bundlrUploader = createBundlrUploader(UMI);
UMI.use(signerIdentity(UMI_SIGNER_KEYPAIR));

(async () => {
  try {
    const image =
      "https://arweave.net/v1Jtah0WrBcCAYIP-NhZidtQFc0zJ4oB-ywi-mVf1Ro";
    const metadata = {
      name: "Sample",
      symbol: "SMPL",
      description: "A sample decription",
      image,
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
    const myUri = await bundlrUploader.uploadJson(metadata);

    console.log("Your metadata URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
