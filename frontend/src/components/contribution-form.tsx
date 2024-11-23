"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMutationNewContribution } from "@/hooks/mutations/solfund";
import { useQueryClient } from "@tanstack/react-query";

export function ContributionForm({ campaignId }: { campaignId: string }) {
  const [amount, setAmount] = useState("");
  const useNewContribution = useMutationNewContribution();
  const { connected, connect } = useWallet();
  const queryClient = useQueryClient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    useNewContribution.mutateAsync(
      {
        campaign: campaignId,
        amount: parseFloat(amount),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ["campaign", campaignId]});
          queryClient.invalidateQueries({queryKey: ["contribution"]});
        },
      }
    );
    // Here you would implement the logic to send the contribution
    console.log(`Contributing ${amount} SOL to campaign ${campaignId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="number"
          placeholder="Amount in SOL"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.000000001"
          step="0.000000001"
          required
        />
      </div>
      {connected ? (
        <Button
          type="submit"
          className="w-full"
          disabled={useNewContribution.isPending}
        >
          Contribute
        </Button>
      ) : (
        <Button type="button" onClick={connect} className="w-full">
          Connect Wallet
        </Button>
      )}
    </form>
  );
}
