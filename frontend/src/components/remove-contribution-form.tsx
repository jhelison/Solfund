"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMutationRemoveContribution } from "@/hooks/mutations/solfund";
import { useQueryClient } from "@tanstack/react-query";

export function RemoveContribution({
  campaignId,
  contributionAmount,
}: {
  campaignId: string;
  contributionAmount: number;
}) {
  const useRemoveContribution = useMutationRemoveContribution();
  const queryClient = useQueryClient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    useRemoveContribution.mutateAsync(
      {
        campaign: campaignId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
          queryClient.invalidateQueries({ queryKey: ["contribution"] });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h5>{contributionAmount} SOL</h5>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={useRemoveContribution.isPending}
      >
        Remove contribution
      </Button>
    </form>
  );
}
