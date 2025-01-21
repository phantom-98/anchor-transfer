import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import * as Fs from "fs";
import {
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { AnchorTransferProject } from "../target/types/anchor_transfer_project"; // Adjust the path as necessary
import { Connection,PublicKey ,Keypair, Transaction, sendAndConfirmTransaction, clusterApiUrl} from "@solana/web3.js"
import dotenv from "dotenv";
dotenv.config();
  // Configure the client to use the local cluster.
anchor.setProvider(anchor.AnchorProvider.env());

const program = anchor.workspace.AnchorTransferProject as Program<AnchorTransferProject>;

async function transfer() {
  // Set up accounts for the transfer
  const connection = new Connection(clusterApiUrl("devnet"),"confirmed");
  const toWallet = new anchor.web3.PublicKey("B8zqTPwsj8NDgzUfhq5j3Uaa8rGuLBS3ii9Fnd9TZpsL"); // Replace with the actual to token account
  const tokenMint=new PublicKey("rgbru9AHE1kV9cn6QqXbh1fVxT8Yb5dWEnUwDv4UZVw");
  const amount = 100000000000; // Amount to transfer
  const decodedKey = new Uint8Array(
    JSON.parse(Fs.readFileSync("./wallet.json").toString()) as number[]
  );
  const wallet = Keypair.fromSecretKey(decodedKey);

  const [toAta] = PublicKey.findProgramAddressSync(
    [toWallet.toBuffer(), new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb").toBuffer(), tokenMint.toBuffer()],
    new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")
  )
  console.log("toAta", toAta)
  
  const [fromAta] = PublicKey.findProgramAddressSync(
    [wallet.publicKey.toBuffer(), new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb").toBuffer(), tokenMint.toBuffer()],
    new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")
  )
  console.log("fromAta", fromAta)
  const instruction=new Transaction().add(
    createAssociatedTokenAccountInstruction(
      wallet.publicKey,
      toAta,
      toWallet,
      tokenMint,
      new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"),
    )
  )
  console.log("created transaction", instruction)
  try {
    const tx1= await sendAndConfirmTransaction(
      connection,
      instruction,
      [wallet]
    );
    console.log("Creating associated token account...", tx1);
  } catch (e) {
    console.log("error", e);
  }
  const tx2 = await program.methods.transferSplTokens(new anchor.BN(amount)).accounts({
    fromAta: fromAta,
    toAta:toAta,
    mint:tokenMint,
    from: wallet.publicKey,
    tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
  })
  .signers([wallet])
  .rpc();

  console.log("Transfer transaction signature", tx2);
}
transfer();