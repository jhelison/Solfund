"use client";

import { Button } from "@/components/ui/button";
import { useMutationRemoveContribution } from "@/hooks/mutations/solfund";
import { Campaign } from "@/types/campaign";
import { useQueryClient } from "@tanstack/react-query";

export function ManageCampaignForm({
  campaign,
}: {
  campaign: Campaign
}) {
  const useRemoveContribution = useMutationRemoveContribution();
  const queryClient = useQueryClient();

  const hasEnded = campaign.endDate < new Date()

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

  const getButtonText = (): string => {
    if (!hasEnded) {
        return "The campaign must expire first"
    }
    if (!campaign.is_successful) {
        return "The campaign was not successful"
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h5>Collect the campaign</h5>
        <h5>To collect, the campaign must make the goal and have ended</h5>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={useRemoveContribution.isPending || !hasEnded || !campaign.is_successful}
      >
        {getButtonText()}
      </Button>
    </form>
  );
}
