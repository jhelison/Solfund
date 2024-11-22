import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Solfund } from "../target/types/solfund";
import { assert } from "chai";
import { createHash } from "crypto";

// Constants
const SECONDS_PER_DAY = 60 * 60 * 24;

describe("solfund", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // The program
  const program = anchor.workspace.Solfund as Program<Solfund>;

  // Default campaign data
  const default_title = "Campaign Title";
  const curr_timestamp = Math.floor(Date.now() / 1000);
  const default_end_ts = curr_timestamp + SECONDS_PER_DAY + SECONDS_PER_DAY; // One hour and one day in the future
  const default_goal = 1_000_000_000; // 1 sol
  const default_URI = "ipfs://example_metadata_uri";

  describe("Initialize the program", async () => {
    it("Initialize correctly", async () => {
      // Airdrop tokens for the deployment
      const deployer = await fundNewKey(provider.connection);

      // Try to initialize the account
      const [campaign_pda, campaign_bump] =
        await createAndInitializeCampaignAccount(
          program,
          deployer,
          default_title,
          default_goal,
          default_end_ts,
          default_URI
        );

      // Check the final result
      await checkCampaign(
        program,
        campaign_pda,
        campaign_bump,
        deployer.publicKey,
        default_goal,
        default_title,
        default_end_ts,
        default_URI,
        0,
        false,
        false
      );
    });
    it("Fail with timestamp under the 1 day constraint", async () => {
      // Airdrop tokens for the deployment
      const deployer = await fundNewKey(provider.connection);

      // Try to initialize a new campaign
      try {
        await createAndInitializeCampaignAccount(
          program,
          deployer,
          default_title,
          default_goal,
          curr_timestamp + SECONDS_PER_DAY - 60, // 60 seconds in the past after one day
          default_URI
        );
      } catch (error) {
        assert.strictEqual(
          error.error.errorCode.code,
          "CampaignTsNotBigEnough"
        );
      }
    });
    it("Fail with goal zero", async () => {
      // Airdrop tokens for the deployment
      const deployer = await fundNewKey(provider.connection);

      // Try to initialize a new campaign
      try {
        await createAndInitializeCampaignAccount(
          program,
          deployer,
          default_title,
          0, // Zero
          default_end_ts,
          default_URI
        );
      } catch (error) {
        assert.strictEqual(error.error.errorCode.code, "CampaignZeroGoal");
      }
    });
    it("Fail with URI empty", async () => {
      // Airdrop tokens for the deployment
      const deployer = await fundNewKey(provider.connection);

      // Try to initialize a new campaign
      try {
        await createAndInitializeCampaignAccount(
          program,
          deployer,
          default_title,
          default_goal,
          default_end_ts,
          "    " // Empty URI
        );
      } catch (error) {
        assert.strictEqual(error.error.errorCode.code, "CampaignURIEmpty");
      }
    });
    it("Fail with URI too big", async () => {
      // Airdrop tokens for the deployment
      const deployer = await fundNewKey(provider.connection);

      // Try to initialize a new campaign
      try {
        await createAndInitializeCampaignAccount(
          program,
          deployer,
          default_title,
          default_goal,
          default_end_ts,
          "https://stackoverflow.com/questions/52856496/typescript-object-keys-return-string" // Huge URI
        );
      } catch (error) {
        assert.strictEqual(error.error.errorCode.code, "CampaignURITooBig");
      }
    });
    it("Fail with title empty", async () => {
      // Airdrop tokens for the deployment
      const deployer = await fundNewKey(provider.connection);

      // Try to initialize a new campaign
      try {
        await createAndInitializeCampaignAccount(
          program,
          deployer,
          "        ", // Empty title
          default_goal,
          default_end_ts,
          default_URI
        );
      } catch (error) {
        assert.strictEqual(error.error.errorCode.code, "CampaignTitleEmpty");
      }
    });
    it("Fail with title too big", async () => {
      // Airdrop tokens for the deployment
      const deployer = await fundNewKey(provider.connection);

      // Try to initialize a new campaign
      try {
        const [campaign_pda, campaign_bump] =
          await createAndInitializeCampaignAccount(
            program,
            deployer,
            "This is a title with one over 32b", // Big title
            default_goal,
            default_end_ts,
            default_URI
          );

        await checkCampaign(
          program,
          campaign_pda,
          campaign_bump,
          null,
          null,
          "asd"
        );
      } catch (error) {
        assert.strictEqual(error.toString(), "TypeError: Max seed length exceeded");
      }
    });
  });
});

// Create a new campaign account
async function createAndInitializeCampaignAccount(
  program: anchor.Program<Solfund>,
  owner: anchor.web3.Keypair,
  title: string,
  goal: number,
  end_ts: number,
  uri: string
): Promise<[anchor.web3.PublicKey, number]> {
  // Generate the PDA for the account
  const [campaign_pda, campaign_bump] = getCampaignPDA(
    owner.publicKey,
    title,
    program.programId
  );

  // Initialize a new campaign
  await program.methods
    .newCampaign(title, new anchor.BN(goal), new anchor.BN(end_ts), uri)
    .accounts({
      campaign: campaign_pda,
      owner: owner.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([owner])
    .rpc();

  return [campaign_pda, campaign_bump];
}

// Get the PDA for a campaign
function getCampaignPDA(
  owner: anchor.web3.PublicKey,
  title: string,
  program_id: anchor.web3.PublicKey
) {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("Campaign"),
      owner.toBuffer(),
      anchor.utils.bytes.utf8.encode(title)
    ],
    program_id
  );
}

// Check the campaign
async function checkCampaign(
  program: anchor.Program<Solfund>,
  campaign: anchor.web3.PublicKey,
  bump?: number,
  owner?: anchor.web3.PublicKey,
  goal?: number,
  title?: string,
  end_ts?: number,
  metadata_uri?: string,
  total_funds?: number,
  is_successful?: boolean,
  is_withdrawn?: boolean
) {
  // Fetch the data
  let campaign_data = await program.account.campaign.fetch(campaign);

  // Start the checks
  if (bump) {
    assert.strictEqual(campaign_data.bump.toString(), bump.toString());
  }
  if (owner) {
    assert.strictEqual(campaign_data.owner.toString(), owner.toString());
  }
  if (goal) {
    assert.strictEqual(campaign_data.goal.toString(), goal.toString());
  }
  if (title) {
    const title_from_data = convertByteToString(
      campaign_data.title,
      campaign_data.titleLength
    );
    assert.strictEqual(title_from_data, title);
  }
  if (end_ts) {
    assert.strictEqual(campaign_data.endTs.toString(), end_ts.toString());
  }
  if (metadata_uri) {
    const uri_from_data = convertByteToString(
      campaign_data.metadataUri,
      campaign_data.metadataUriLength
    );
    assert.strictEqual(uri_from_data, metadata_uri);
  }
  if (total_funds) {
    assert.strictEqual(
      campaign_data.totalFunds.toString(),
      total_funds.toString()
    );
  }
  if (is_successful) {
    assert.strictEqual(
      campaign_data.isSuccessful.toString(),
      is_successful.toString()
    );
  }
  if (is_withdrawn) {
    assert.strictEqual(
      campaign_data.isWithdrawn.toString(),
      is_withdrawn.toString()
    );
  }
}

// Airdrop tokens to a pubkey
async function airdrop(
  connection: anchor.web3.Connection,
  address: anchor.web3.PublicKey,
  amount = 1000000000
) {
  // Get the signature
  const signature = await connection.requestAirdrop(address, amount);

  // Get the latest blockhash
  const latestBlockhash = await connection.getLatestBlockhash();

  // Confirm the tx
  await connection.confirmTransaction(
    {
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    },
    "confirmed"
  );
}

// Fund and airdrop a new key
async function fundNewKey(
  connection: anchor.web3.Connection,
  amount = 1000000000
) {
  // New account
  const new_account = anchor.web3.Keypair.generate();

  // Airdrop the new account
  await airdrop(connection, new_account.publicKey, amount);

  // Return the new account
  return new_account;
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
