"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock } from 'lucide-react'
import { cn } from "@/lib/utils"
import { RichTextEditor } from "@/components/rich-text-editor"
import { MilestoneManager, Milestone } from "@/components/milestone-manager"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CampaignData {
  id?: string
  logo: File | null
  banner: File | null
  title: string
  subtitle: string
  description: string
  target: string
  endDate: Date | null
  endTime: string
  milestones: Milestone[]
}

export default function CreateCampaign() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get('id')
  const [campaignData, setCampaignData] = useState<CampaignData>({
    logo: null,
    banner: null,
    title: "",
    subtitle: "",
    description: "",
    target: "",
    endDate: null,
    endTime: "23:59",
    milestones: [],
  })

  useEffect(() => {
    if (campaignId) {
      // Fetch campaign data if editing an existing campaign
      // This is a mock fetch, replace with actual API call
      const fetchCampaignData = async () => {
        // Simulating API call
        const response = await new Promise<CampaignData>((resolve) => 
          setTimeout(() => resolve({
            id: campaignId,
            logo: null,
            banner: null,
            title: "Existing Campaign",
            subtitle: "Edit this campaign",
            description: "<p>This is an existing campaign description.</p>",
            target: "100",
            endDate: new Date(2023, 11, 31, 23, 59),
            endTime: "23:59",
            milestones: [],
          }), 500)
        )
        setCampaignData(response)
      }
      fetchCampaignData()
    }
  }, [campaignId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCampaignData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files.length > 0) {
      setCampaignData((prev) => ({ ...prev, [name]: files[0] }))
    }
  }

  const handleDescriptionChange = (content: string) => {
    setCampaignData((prev) => ({ ...prev, description: content }))
  }

  const handleMilestonesChange = (milestones: Milestone[]) => {
    setCampaignData((prev) => ({ ...prev, milestones }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Combine date and time
    const combinedDateTime = campaignData.endDate
      ? new Date(
          campaignData.endDate.getFullYear(),
          campaignData.endDate.getMonth(),
          campaignData.endDate.getDate(),
          parseInt(campaignData.endTime.split(':')[0]),
          parseInt(campaignData.endTime.split(':')[1])
        )
      : null

    // Convert File objects to file names for JSON output
    const jsonOutput = {
      ...campaignData,
      logo: campaignData.logo ? campaignData.logo.name : null,
      banner: campaignData.banner ? campaignData.banner.name : null,
      endDate: combinedDateTime,
    }
    console.log("Campaign Data:", JSON.stringify(jsonOutput, null, 2))
    // Redirect to the campaign page (you'd use the actual campaign ID in a real app)
    // router.push("/campaign/new-campaign-id")
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">{campaignId ? 'Edit Campaign' : 'Create a New Campaign'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="logo">Logo (400/200 px)</Label>
          <Input id="logo" name="logo" type="file" onChange={handleFileChange} accept="image/*" />
        </div>
        <div>
          <Label htmlFor="banner">Banner (800/400 px)</Label>
          <Input id="banner" name="banner" type="file" onChange={handleFileChange} accept="image/*" />
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={campaignData.title} onChange={handleInputChange} required maxLength={32} />
        </div>
        <div>
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input id="subtitle" name="subtitle" value={campaignData.subtitle} onChange={handleInputChange} required maxLength={64} />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <RichTextEditor content={campaignData.description} onChange={handleDescriptionChange} />
        </div>
        <div>
          <Label htmlFor="target">Target Amount (SOL)</Label>
          <Input
            id="target"
            name="target"
            type="number"
            value={campaignData.target}
            onChange={handleInputChange}
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
                  {campaignData.endDate ? format(campaignData.endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={campaignData.endDate}
                  onSelect={(date) => setCampaignData((prev) => ({ ...prev, endDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Select
              value={campaignData.endTime}
              onValueChange={(value) => setCampaignData((prev) => ({ ...prev, endTime: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 * 4 }).map((_, index) => {
                  const hours = Math.floor(index / 4);
                  const minutes = (index % 4) * 15;
                  const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                  return (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <MilestoneManager
          milestones={campaignData.milestones}
          onChange={handleMilestonesChange}
        />
        <Button type="submit" className="w-full">{campaignId ? 'Update Campaign' : 'Create Campaign'}</Button>
      </form>
    </div>
  )
}

