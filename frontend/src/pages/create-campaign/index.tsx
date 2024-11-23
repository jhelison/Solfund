"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "@/components/rich-text-editor";
import { MilestoneManager } from "@/components/milestone-manager";
import { Loader2 } from "lucide-react";
import { useSolfundProgram } from "@/hooks/useSolfund";
import { useWallet } from "@solana/wallet-adapter-react";
import { Campaign, Milestone } from "@/types/campaign";
import { useMutationNewCampaignWithIPFS } from "@/hooks/mutations/newCampaign";

export default function CreateCampaign() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const program = useSolfundProgram();
  const { publicKey, signMessage, connected } = useWallet();
  const useNewCampaign = useMutationNewCampaignWithIPFS();
  const [logo, setLogo] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);

  const [campaignData, setCampaignData] = useState<Campaign>({
    title: "",
    goal: 0,
    endDate: new Date(),
    ipfsData: {
      logo: null,
      banner: null,
      subtitle: "",
      description: "",
      milestones: [],
    },
  });

  useEffect(() => {
    if (campaignId) {
      // Fetch campaign data if editing an existing campaign
      // This is a mock fetch, replace with actual API call
      const fetchCampaignData = async () => {
        // Simulating API call
        const response = await new Promise<Campaign>((resolve) =>
          setTimeout(
            () =>
              resolve({
                address: campaignId,
                title: "Existing Campaign",
                goal: 100,
                endDate: new Date(2023, 11, 31, 23, 59),
                totalFunds: 10,
                owner: publicKey.toBase58(),
                ipfsData: {
                  logo: null,
                  banner: null,
                  subtitle: "Edit this campaign",
                  description:
                    "<p>This is an existing campaign description.</p>",
                  milestones: [],
                },
              }),
            500
          )
        );
        setCampaignData(response);
      };
      fetchCampaignData();
    }
  }, [campaignId]);

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCampaignData((prev) => ({ ...prev, title: value }));
  };

  const handleSubtitleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCampaignData((prev) => ({
      ...prev,
      ipfsData: { ...prev.ipfsData, subtitle: value },
    }));
  };

  const handleGoalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCampaignData((prev) => ({ ...prev, goal: parseFloat(value) }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setLogo((prev) => files[0]);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setBanner((prev) => files[0]);
    }
  };

  const handleDescriptionChange = (content: string) => {
    setCampaignData((prev) => ({
      ...prev,
      ipfsData: { ...prev.ipfsData, description: content },
    }));
  };

  const handleMilestonesChange = (milestones: Milestone[]) => {
    setCampaignData((prev) => ({
      ...prev,
      ipfsData: { ...prev.ipfsData, milestones: milestones },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!program) {
      console.error("Program is not initialized");
      return;
    }

    useNewCampaign.mutate({ campaign: campaignData, logo, banner });
    // Redirect to the campaign page (you'd use the actual campaign ID in a real app)
    router.push("/")
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">
        {campaignId ? "Edit Campaign" : "Create a New Campaign"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="logo">Logo (400/200 px)</Label>
          <Input
            id="logo"
            name="logo"
            type="file"
            onChange={handleLogoChange}
            accept="image/*"
            // required // TODO: TURN ME ON
          />
        </div>
        <div>
          <Label htmlFor="banner">Banner (800/400 px)</Label>
          <Input
            id="banner"
            name="banner"
            type="file"
            onChange={handleBannerChange}
            accept="image/*"
            // required // TODO: TURN ME ON
          />
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={campaignData.title}
            onChange={handleTitleChange}
            required
            maxLength={32}
          />
        </div>
        <div>
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            name="subtitle"
            value={campaignData.ipfsData.subtitle}
            onChange={handleSubtitleChange}
            required
            maxLength={64}
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <RichTextEditor
            content={campaignData.ipfsData.description}
            onChange={handleDescriptionChange}
          />
        </div>
        <div>
          <Label htmlFor="target">Target Amount (SOL)</Label>
          <Input
            id="target"
            name="target"
            type="number"
            value={campaignData.goal}
            onChange={handleGoalChange}
            min="0.000000001"
            step="0.000000001"
            required
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <Label htmlFor="endDate">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !campaignData.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {campaignData.endDate ? (
                    format(campaignData.endDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={campaignData.endDate}
                  onSelect={(date) =>
                    setCampaignData((prev) => ({ ...prev, endDate: date }))
                  }
                  initialFocus
                  required
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <MilestoneManager
          milestones={campaignData.ipfsData.milestones}
          onChange={handleMilestonesChange}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={!connected || useNewCampaign.isPending}
        >
          {useNewCampaign.isPending ? (
            <Loader2 className="animate-spin">This can take some time!</Loader2>
          ) : campaignId ? (
            "Update Campaign"
          ) : (
            "Create Campaign (This takes some time!)"
          )}
        </Button>
      </form>
    </div>
  );
}
