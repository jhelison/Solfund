import { CampaignDetails } from "@/components/campaign-details";
import { ContributionForm } from "@/components/contribution-form";
import { Leaderboard } from "@/components/leaderboard";
import { ShareButton } from "@/components/share-button";
import { useRouter } from "next/router";

export default function CampaignPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = router.query; // Extract the dynamic 'id'

  // In a real app, you would fetch the campaign data here based on the ID
  const campaign = {
    id: id[0],
    name: "Save the Oceans",
    subtitle: "Help us clean up the oceans and protect marine life",
    description:
      "<p>Our oceans are facing unprecedented challenges due to pollution, overfishing, and climate change. This campaign aims to fund crucial initiatives to clean up our oceans, protect marine life, and promote sustainable practices.</p><p>Your contribution will directly support:</p><ul><li>Beach and ocean cleanup efforts</li><li>Marine life conservation programs</li><li>Education and awareness campaigns</li><li>Research into sustainable fishing practices</li></ul><p>Together, we can make a significant impact and ensure a healthier future for our oceans and the planet.</p>",
    image: `https://picsum.photos/800/400?random=random`,
    progress: 75,
    deadline: new Date("2023-12-31"),
    raisedAmount: 75,
    goalAmount: 100,
    creatorWallet: "7X3cVjkL8qPvN6ZnF9tG",
    milestones: [
      { name: "Beach Cleanup", target: 25, progress: 100 },
      { name: "Coral Reef Restoration", target: 50, progress: 100 },
      { name: "Marine Life Protection", target: 75, progress: 100 },
      { name: "Ocean Research", target: 100, progress: 75 },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        <ShareButton campaignId={id[0]} />
        <CampaignDetails campaign={campaign} />
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: campaign.description }}
        />
        <div>
          <h2 className="text-2xl font-semibold mb-4">Top Contributors</h2>
          <Leaderboard campaignId={id[0]} />
        </div>
        <div className="flex justify-center"></div>
      </div>
      <div className="space-y-8">
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Milestones</h2>
          <div className="space-y-4">
            {campaign.milestones.map((milestone, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{milestone.name}</span>
                  <span className="text-sm font-medium">
                    {milestone.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${milestone.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Contribute</h2>
          <ContributionForm campaignId={id[0]} />
        </div>
      </div>
    </div>
  );
}
