import { Campaign } from "@/types/campaign";
import { useApiMutation } from "../useQueryContext";
import { useMutationNewCampaign } from "./solfund";
import { PinataSDK } from "pinata-web3";
import { create } from "@web3-storage/w3up-client";
import { solToLamports } from "@/utils/conversion";

export function useMutationNewCampaignWithIPFS() {
  const useNewCampaign = useMutationNewCampaign();

  return useApiMutation(
    async (data: { campaign: Campaign; logo: File; banner: File }) => {
      console.log("Starting the update");
      const client = await create();
      await client.login("jhelisong@gmail.com"); // I should hide this, but I'm lazy!
      await client.setCurrentSpace(
        "did:key:z6Mku8tzaunAJ4EnWVszLCeNimjeyZmJxn6utupYEi7jTZAD" // I should hide this, but I'm lazy!
      );
      // Upload to IPFS
      const logoData = await client.uploadFile(data.logo);
      const bannerData = await client.uploadFile(data.banner);

      // Update the logo and banner
      let ipfsData = data.campaign.ipfsData;
      ipfsData.logo = `https://ipfs.io/ipfs/${logoData.toString()}`;
      ipfsData.banner = `https://ipfs.io/ipfs/${bannerData.toString()}`;

      // Update the milestones to lamports
      data.campaign.ipfsData.milestones.forEach((milestone) => {
        milestone.target = solToLamports(milestone.target);
      });

      // Upload the updated IPFS data as JSON
      // Convert JSON data to Blob for file upload
      const jsonBlob = new Blob([JSON.stringify(ipfsData)], {
        type: "application/json",
      });
      const jsonFile = new File([jsonBlob], "campaign-data.json", {
        type: "application/json",
      });

      const jsonResult = await client.uploadFile(jsonFile);
      const metadata = jsonResult.toString();

      const creationData = {
        title: data.campaign.title,
        goal: data.campaign.goal,
        end: data.campaign.endDate,
        metadata: metadata,
      };

      console.log("Creating a new campaign with: ", creationData);

      await useNewCampaign.mutateAsync(creationData);
    }
  );
}
