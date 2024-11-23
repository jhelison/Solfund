import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  name: string;
  subtitle: string;
  progress: number;
  deadline: Date;
  raisedAmount: number;
  goalAmount: number;
  creatorWallet: string;
}

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const daysLeft = Math.ceil(
    (campaign.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isEnded = daysLeft <= 0;

  return (
    <Card className={`overflow-hidden ${isEnded ? "opacity-60" : ""}`}>
      <CardHeader className="p-0">
        <img
          src={`https://picsum.photos/400/200?random=${campaign.creatorWallet}`}
          alt={campaign.name}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-2">
          {campaign.name}
        </CardTitle>
        <p className="text-sm text-gray-600 mb-2">{campaign.subtitle}</p>
        <Progress value={campaign.progress} className="mb-2" />
        <p className="text-sm text-gray-600 mb-1">
          {campaign.raisedAmount} SOL of {campaign.goalAmount} SOL raised
        </p>
        <p
          className={cn(
            "text-sm mb-2",
            isEnded
              ? "text-red-600"
              : daysLeft <= 3
              ? "text-yellow-600"
              : "text-green-600"
          )}
        >
          {isEnded
            ? "Ended"
            : daysLeft <= 3
            ? `Ending soon: ${daysLeft} days left`
            : `${daysLeft} days left`}
        </p>
        <p className="text-xs text-gray-500">
          Created by: {campaign.creatorWallet.slice(0, 6)}...
          {campaign.creatorWallet.slice(-4)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/campaign/${campaign.id}`} className="w-full">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View Campaign
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
}
