"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMutationRemoveContribution } from "@/hooks/mutations/solfund";
import { useQueryClient } from "@tanstack/react-query";
import { Campaign } from "@/types/campaign";

export function RemoveContribution({
  campaign,
  contributionAmount,
}: {
  campaign: Campaign;
  contributionAmount: number;
}) {
  const useRemoveContribution = useMutationRemoveContribution();
  const queryClient = useQueryClient();

  const hasEnded = campaign?.endDate < new Date()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    useRemoveContribution.mutateAsync(
      {
        campaign: campaign.address,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["campaign", campaign.address] });
          queryClient.invalidateQueries({ queryKey: ["contribution"] });
        },
      }
    );
  };

  const getButtonText = () => {
    if (hasEnded) {
      return "This campaign has ended"
    }
    return "Remove contribution"
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h5>{contributionAmount} SOL</h5>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={useRemoveContribution.isPending || hasEnded}
      >
        {getButtonText()}
      </Button>
    </form>
  );
}
