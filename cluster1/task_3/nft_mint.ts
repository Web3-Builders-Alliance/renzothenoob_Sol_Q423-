import {
  signerIdentity,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import bs58 from "bs58";
import { UMI, UMI_SIGNER_KEYPAIR } from "../config";

UMI.use(signerIdentity(UMI_SIGNER_KEYPAIR));
UMI.use(mplTokenMetadata());

const mint = generateSigner(UMI);

(async () => {
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
})();
