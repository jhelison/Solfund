import { useQuery } from "@tanstack/react-query";
import { useSolfundProgram } from "../useSolfund";
import { Campaign, IPFSCampaignData } from "@/types/campaign";
import { BN, ProgramAccount, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { lamportsToSol } from "@/utils/conversion";

// Hook to fetch all campaigns
export const useFetchAllCampaigns = () => {
  const program = useSolfundProgram();

  return useQuery({
    queryKey: ["allCampaigns"], // Wrap in an array to match the expected QueryKey type
    queryFn: async () => {
      console.log();
      // Fetch all accounts from the program
      const accounts = await program.account.campaign.all();

      // Map over all accounts and convert to Campaign
      const res = await Promise.all(
        accounts.map(async (account) => {
          const account_data = account.account;
          return solCampaignToCampaign(account_data, account.publicKey);
        })
      );

      return res;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Hook to fetch a single campaign by its public key
export const useFetchCampaign = (campaignAddress: string) => {
  const program = useSolfundProgram();

  return useQuery({
    queryKey: ["campaign", campaignAddress], // Unique key based on the address
    queryFn: async () => {
      if (!campaignAddress) {
        throw new Error("Campaign address is required");
      }

      try {
        // Fetch account data for the given address
        const campaignAddressPubkey = new PublicKey(campaignAddress);
        const account = await program.account.campaign.fetch(
          campaignAddressPubkey
        );
        return await solCampaignToCampaign(account, campaignAddressPubkey);
      } catch (error) {
        throw new Error(`Failed to fetch campaign: ${error.message}`);
      }
    },
    enabled: !!campaignAddress, // Only fetch if a campaign address is provided
    staleTime: 1000 * 60 * 5, // Cache the data for 5 minutes
  });
};

// Hook to fetch a single contribution by a campaign and user address
export const useFetchContribution = (campaignAddress: string, contributor: string) => {
  const program = useSolfundProgram();

  return useQuery({
    queryKey: ["contribution", campaignAddress, contributor], // Unique key based on the address
    queryFn: async () => {
      if (!campaignAddress || !contributor) {
        throw new Error("Campaign address and contributor is required");
      }

      try {
        // Get the account PDA
        const campaignPubkey = new web3.PublicKey(campaignAddress);
        const contributorPubkey = new web3.PublicKey(contributor);
        const [contributionPDA] = web3.PublicKey.findProgramAddressSync(
          [
            Buffer.from("Contribution"),
            contributorPubkey.toBuffer(),
            campaignPubkey.toBuffer(),
          ],
          program.programId
        );

        // Fetch account data for the given address
        const account = await program.account.contribution.fetch(
          contributionPDA
        );
        return {hasContribution: true, amount: lamportsToSol(account.amount.toNumber())};
      } catch (error) {
        console.log(error)
        return {hasContribution: false, amount: 0};
      }
    },
    enabled: !!campaignAddress, // Only fetch if a campaign address is provided
    staleTime: 1000 * 60 * 5, // Cache the data for 5 minutes
  });
};

// Convert the type
async function solCampaignToCampaign(
  solCampaign: {
    bump: number;
    owner: PublicKey;
    goal: BN;
    title: number[];
    titleLength: number;
    startTs: BN;
    endTs: BN;
    metadataUri: number[];
    metadataUriLength: number;
    totalFunds: BN;
    isSuccessful: boolean;
    isWithdrawn: boolean;
  },
  address: PublicKey
): Promise<Campaign> {
  // Precalculate the data
  const endTs = new Date(solCampaign.endTs.toNumber() * 1000);
  const startTs = new Date(solCampaign.startTs.toNumber() * 1000);
  const metadata_uri = convertByteToString(
    solCampaign.metadataUri,
    solCampaign.metadataUriLength
  );
  const title = convertByteToString(solCampaign.title, solCampaign.titleLength);

  // Get the IPFS data
  const metadata_link = `https://ipfs.io/ipfs/${metadata_uri}`;
  let ipfsData: IPFSCampaignData | null = null;

  try {
    const response = await axios.get(metadata_link);
    ipfsData = response.data;
  } catch (error) {
    console.error("Error fetching metadata:", error);
    throw new Error(`Failed to fetch metadata from ${metadata_link}`);
  }

  // Update the milestones to lamports
  ipfsData.milestones.forEach((milestone) => {
    milestone.target = lamportsToSol(milestone.target);
  });

  return {
    owner: solCampaign.owner.toBase58(),
    goal: lamportsToSol(solCampaign.goal.toNumber()),
    endDate: endTs,
    title: title,
    address: address.toBase58(),
    startDate: startTs,
    totalFunds: lamportsToSol(solCampaign.totalFunds.toNumber()),
    is_successful: solCampaign.isSuccessful,
    ipfsData,
  };
}

// Convert a byte array to a string with a slice
function convertByteToString(data: number[], size: number) {
  // Slice
  const sliced = data.slice(0, size);

  // Convert to string
  const decoder = new TextDecoder("utf-8");
  const uint8Array = new Uint8Array(sliced);

  // Return the string
  return decoder.decode(uint8Array);
}
