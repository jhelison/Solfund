import { Progress } from "@/components/ui/progress";
import { Campaign } from "@/types/campaign";

export function CampaignDetails({ campaign }: { campaign: Campaign }) {
  const daysLeft = Math.ceil(
    (campaign.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  let progress = (campaign.totalFunds / campaign.goal) * 100;
  if (progress > 100) {
    progress = 100
  }

  return (
    <div className="space-y-6">
      <img
        src={campaign.ipfsData.banner}
        alt={campaign.ipfsData.banner}
        className="w-full h-64 object-cover rounded-lg"
      />
      <div>
        <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
        <p className="text-xl text-gray-600 mb-4">
          {campaign.ipfsData.subtitle}
        </p>
        <Progress value={progress} className="mb-2" />
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            {campaign.totalFunds.toLocaleString("en-US", {
              maximumFractionDigits: 20,
            })}{" "}
            SOL raised of{" "}
            {campaign.goal.toLocaleString("en-US", {
              maximumFractionDigits: 20,
            })}{" "}
            SOL goal
          </span>
          <span>{daysLeft > 0 ? `${daysLeft} days left` : "Ended"}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Created by: {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}
        </p>
      </div>
    </div>
  );
}
