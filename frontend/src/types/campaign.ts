export interface Campaign {
  address?: string;
  title: string;
  goal: number;
  startDate?: Date;
  endDate: Date;
  totalFunds?: number,
  owner?: string;
  is_successful?: boolean;

  ipfsData: IPFSCampaignData
}

export interface Milestone {
  description: string;
  target: number;
}

export interface IPFSCampaignData {
  logo?: string;
  banner?: string;
  subtitle: string;
  description: string;
  milestones: Milestone[];
}