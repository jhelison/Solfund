import { useWallet } from "@solana/wallet-adapter-react";
import { useSolfundProgram } from "../useSolfund";
import { useMutation } from "@tanstack/react-query";
import { Transaction } from "@solana/web3.js";
import { BN, utils, web3 } from "@coral-xyz/anchor";
import { Campaign } from "@/types/campaign";
import { useApiMutation } from "../useQueryContext";
import { solToLamports } from "@/utils/conversion";

export function useMutationNewCampaign() {
  const program = useSolfundProgram();
  const { publicKey } = useWallet();

  return useApiMutation(
    async (data: {
      title: string;
      goal: number;
      end: Date;
      metadata: string;
    }) => {
      // Convert to lamports
      const goalLamport = solToLamports(data.goal);

      // Start a tx
      const tx = new Transaction();
      const [campaignPda] = web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("Campaign"),
          publicKey.toBuffer(),
          utils.bytes.utf8.encode(data.title.trim()),
        ],
        program.programId
      );

      var unixtime = data.end.getTime() / 1000;
      const newCampaignInstruction = program.instruction.newCampaign(
        data.title.trim(),
        new BN(goalLamport),
        new BN(unixtime),
        data.metadata,
        {
          accounts: {
            campaign: campaignPda,
            owner: publicKey,
            systemProgram: web3.SystemProgram.programId,
          },
        }
      );

      tx.add(newCampaignInstruction);

      try {
        const txHash = await program.provider.sendAndConfirm(tx);
        console.log("Campaign created, transaction:", txHash);
      } catch (error) {
        console.error("Error creating campaign:", error);
      }
    }
  );
}

export function useMutationNewContribution() {
  const program = useSolfundProgram();
  const { publicKey } = useWallet();

  return useApiMutation(async (data: { campaign: string; amount: number }) => {
    // Start a tx
    const tx = new Transaction();

    // Convert the amount
    const amountLamport = solToLamports(data.amount);

    // Get the campaign as pubkey
    const campaignPubkey = new web3.PublicKey(data.campaign);
    const [contributionPDA] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("Contribution"),
        publicKey.toBuffer(),
        campaignPubkey.toBuffer(),
      ],
      program.programId
    );

    const newContributionInstruction = program.instruction.newContribution(
      new BN(amountLamport),
      {
        accounts: {
          campaign: campaignPubkey,
          contribution: contributionPDA,
          contributor: publicKey,
          systemProgram: web3.SystemProgram.programId,
        },
      }
    );

    tx.add(newContributionInstruction);

    try {
      const txHash = await program.provider.sendAndConfirm(tx);
      console.log("Campaign created, transaction:", txHash);
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  });
}

export function useMutationRemoveContribution() {
  const program = useSolfundProgram();
  const { publicKey } = useWallet();

  return useApiMutation(async (data: { campaign: string }) => {
    // Start a tx
    const tx = new Transaction();

    // Get the campaign as pubkey
    const campaignPubkey = new web3.PublicKey(data.campaign);
    const [contributionPDA] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("Contribution"),
        publicKey.toBuffer(),
        campaignPubkey.toBuffer(),
      ],
      program.programId
    );

    const removeContributionInstruction =
      program.instruction.removeContribution({
        accounts: {
          campaign: campaignPubkey,
          contribution: contributionPDA,
          contributor: publicKey,
          systemProgram: web3.SystemProgram.programId,
        },
      });

    tx.add(removeContributionInstruction);

    try {
      const txHash = await program.provider.sendAndConfirm(tx);
      console.log("Campaign created, transaction:", txHash);
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  });
}
