import { CampaignCard } from "@/components/campaign-card";
import { useFetchAllCampaigns } from "@/hooks/queries/solFund";

export default function CampaignList() {
  const { data: campaigns, isLoading, error } = useFetchAllCampaigns();

  if (isLoading) {
    return <div>Loading campaigns...</div>;
  }

  if (error) {
    return <div>Error loading campaigns: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.address} campaign={campaign} />
      ))}
    </div>
  );
}
