import { CampaignCard } from "@/components/campaign-card";

const mockCampaigns = [
  {
    id: "1",
    name: "Save the Oceans",
    subtitle: "Help us clean up the world's oceans",
    progress: 75,
    deadline: new Date("2023-12-31"),
    raisedAmount: 75,
    goalAmount: 100,
    creatorWallet: "7X3cVjkL8qPvN6ZnF9tG",
  },
  {
    id: "2",
    name: "Build a School",
    subtitle: "Education for underprivileged children",
    progress: 40,
    deadline: new Date("2023-11-30"),
    raisedAmount: 40,
    goalAmount: 100,
    creatorWallet: "9Y4dWmNp2RqS7TxH5vB",
  },
  {
    id: "3",
    name: "Reforestation Project",
    subtitle: "Plant trees to combat climate change",
    progress: 100,
    deadline: new Date("2023-06-30"),
    raisedAmount: 50,
    goalAmount: 50,
    creatorWallet: "3Z5eXkLr8qMvP7YnT9G",
  },
];

export default function CampaignList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockCampaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
