import { Progress } from "@/components/ui/progress"

interface Milestone {
  name: string
  target: number
  progress: number
}

interface Campaign {
  id: string
  name: string
  subtitle: string
  image: string
  progress: number
  deadline: Date
  raisedAmount: number
  goalAmount: number
  creatorWallet: string
}

export function CampaignDetails({ campaign }: { campaign: Campaign }) {
  const daysLeft = Math.ceil((campaign.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-6">
      <img src={campaign.image} alt={campaign.name} className="w-full h-64 object-cover rounded-lg" />
      <div>
        <h1 className="text-3xl font-bold mb-2">{campaign.name}</h1>
        <p className="text-xl text-gray-600 mb-4">{campaign.subtitle}</p>
        <Progress value={campaign.progress} className="mb-2" />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{campaign.raisedAmount} SOL raised of {campaign.goalAmount} SOL goal</span>
          <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Created by: {campaign.creatorWallet.slice(0, 6)}...{campaign.creatorWallet.slice(-4)}
        </p>
      </div>
    </div>
  )
}

