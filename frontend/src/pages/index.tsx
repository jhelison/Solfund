import CampaignList from "@/components/campaign-list";
// import { CampaignFilters } from "@/components/campaign-filters";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* <CampaignFilters /> */}
      <CampaignList />
    </div>
  );
}
