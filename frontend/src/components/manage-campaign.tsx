"use client";

import { Button } from "@/components/ui/button";
import { useMutationClaimCampaign } from "@/hooks/mutations/solfund";
import { Campaign } from "@/types/campaign";
import { useQueryClient } from "@tanstack/react-query";

export function ManageCampaignForm({
  campaign,
}: {
  campaign: Campaign
}) {
  const useClaimCampaign = useMutationClaimCampaign();
  const queryClient = useQueryClient();

  const hasEnded = campaign.endDate < new Date()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    useClaimCampaign.mutateAsync(
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
    return "Claim campaign"
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
        disabled={useClaimCampaign.isPending || !hasEnded || !campaign.is_successful}
      >
        {getButtonText()}
      </Button>
    </form>
  );
}
