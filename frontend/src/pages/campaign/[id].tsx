import { CampaignDetails } from "@/components/campaign-details";
import { ContributionForm } from "@/components/contribution-form";
import { RemoveContribution } from "@/components/remove-contribution-form";
import { ShareButton } from "@/components/share-button";
import {
  useFetchCampaign,
  useFetchContribution,
} from "@/hooks/queries/solFund";
import { Campaign, Milestone } from "@/types/campaign";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";

export default function CampaignPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = router.query;
  const { publicKey } = useWallet();

  const {
    data: campaign,
    isLoading,
    error,
  } = useFetchCampaign(id ? id.toString() : "");

  const { data: contribution } = useFetchContribution(
    id ? id.toString() : "",
    publicKey ? publicKey.toBase58() : ""
  );

  if (isLoading) {
    return <div>Loading campaign...</div>;
  }

  if (error) {
    return <div>Error loading campaigns: {error.message}</div>;
  }

  const getMilestoneComponent = (milestone: Milestone, index: number) => {
    let milestoneProgress = (campaign.totalFunds / milestone.target) * 100;
    if (milestoneProgress > 100) {
      milestoneProgress = 100;
    }

    return (
      <div key={index}>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">{milestone.description}</span>
          <span className="text-sm font-medium">{milestoneProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${milestoneProgress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const getContributionComponent = () => {
    if (contribution?.hasContribution) {
      return (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Contribution</h2>
          <RemoveContribution campaignId={campaign?.address} contributionAmount={contribution.amount}/>
        </div>
      );
    } else {
      return (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Contribute</h2>
          <ContributionForm campaignId={campaign?.address} />
        </div>
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        <ShareButton campaignId={campaign?.address} />
        <CampaignDetails campaign={campaign} />
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: campaign?.ipfsData.description }}
        />
        <div className="flex justify-center"></div>
      </div>
      <div className="space-y-8">
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Milestones</h2>
          <div className="space-y-4">
            {campaign?.ipfsData.milestones.map((milestone, index) =>
              getMilestoneComponent(milestone, index)
            )}
          </div>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          {getContributionComponent()}
        </div>
      </div>
    </div>
  );
}
