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

  describe("New campaign", async () => {
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
      await checkCampaign(program, campaign_pda, {
        bump: campaign_bump,
        end_ts: default_end_ts,
        goal: default_goal,
        is_successful: false,
        is_withdrawn: false,
        metadata_uri: default_URI,
        owner: deployer.publicKey,
        title: default_title,
        total_funds: 0,
      });
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
      } catch (error) {
        assert.strictEqual(
          error.toString(),
          "TypeError: Max seed length exceeded"
        );
      }
    });
  });
  describe("New contribution", async () => {
    let default_campaign_pda: anchor.web3.PublicKey;
    let total_contributed: number;

    before(async () => {
      // Airdrop tokens for the deployment
      let deployer = await fundNewKey(provider.connection);

      // Initialize the campaign
      let _bump: any;
      [default_campaign_pda, _bump] = await createAndInitializeCampaignAccount(
        program,
        deployer,
        default_title,
        default_goal,
        default_end_ts,
        default_URI
      );
    });

    it("Contribute correctly", async () => {
      // Create the contributor
      const contributor = await fundNewKey(provider.connection);

      // Get the balance for the testing accounts
      const campaign_balance = await provider.connection.getBalance(
        default_campaign_pda
      );
      const contributor_balance = await provider.connection.getBalance(
        contributor.publicKey
      );

      // Try to do a contribution
      const contribution_amount = 100000000;
      const contribution_pda = await createAndInitializeContribution(
        program,
        contributor,
        default_campaign_pda,
        contribution_amount
      );

      // Check the account
      await checkContribution(program, contribution_pda, {
        contributor: contributor.publicKey,
        amount: contribution_amount,
      });

      // Balances should have been updated
      const campaign_balance_new = await provider.connection.getBalance(
        default_campaign_pda
      );
      const contributor_balance_new = await provider.connection.getBalance(
        contributor.publicKey
      );

      // The campaign now should have a new balance
      assert.strictEqual(
        campaign_balance_new,
        campaign_balance + contribution_amount
      );
      // The contributor should have lost balance
      assert.isTrue(contributor_balance_new < contributor_balance);

      // Check the campaign total
      total_contributed += contribution_amount;
      await checkCampaign(program, default_campaign_pda, {
        total_funds: total_contributed,
      });
    });

    it("Do multiple contributions", async () => {
      // Check the campaign balance
      const campaign_balance = await provider.connection.getBalance(
        default_campaign_pda
      );

      // Track the total
      let total_curr_contributed = 0;
      for (let i = 1; i < 4; i++) {
        // Create the contributor
        const contributor = await fundNewKey(provider.connection);

        // Do contributions based on the index
        const contribution_amount = 10000000 * i;
        await createAndInitializeContribution(
          program,
          contributor,
          default_campaign_pda,
          contribution_amount
        );
        total_curr_contributed += contribution_amount;
      }

      // Check the campaign balance
      const campaign_balance_new = await provider.connection.getBalance(
        default_campaign_pda
      );

      // The campaign now should have a new balance
      assert.strictEqual(
        campaign_balance_new,
        campaign_balance + total_curr_contributed
      );

      // Check the campaign total
      total_contributed += total_curr_contributed;
      await checkCampaign(program, default_campaign_pda, {
        total_funds: total_contributed,
      });
    });
    it("Should not contribute with zero balance", async () => {
      // Create the contributor with low balance
      const contributor = await fundNewKey(provider.connection, 10000000);

      // Try to do a contribution
      const contribution_amount = 100000000;
      try {
        await createAndInitializeContribution(
          program,
          contributor,
          default_campaign_pda,
          contribution_amount
        );
        // The code must fail
        assert.isTrue(false);
      } catch (error) {
        // The code must reach here
        assert.isTrue(true);
      }
    });
    it("Should not contribute zero", async () => {
      // Create the contributor
      const contributor = await fundNewKey(provider.connection);

      // Try to do a contribution with zero balance
      try {
        const contribution_amount = 0;
        await createAndInitializeContribution(
          program,
          contributor,
          default_campaign_pda,
          contribution_amount
        );
      } catch (error) {
        assert.strictEqual(error.error.errorCode.code, "ZeroContribution");
      }
    });
    it("Should not contribute with campaign expired", async () => {
      // We create a new campaign deployment, with one second into the future
      const curr_timestamp = Math.floor(Date.now() / 1000);
      let [new_campaign_pda, _bump] = await createAndInitializeCampaignAccount(
        program,
        await fundNewKey(provider.connection),
        default_title,
        default_goal,
        curr_timestamp + 1, // One second into the future
        default_URI
      );

      // Sleep for one second and a half
      await sleep(1500);

      // Now try to contribute
      try {
        // Create the contributor
        const contributor = await fundNewKey(provider.connection);

        // Try to contribute
        const contribution_amount = 1000000;
        await createAndInitializeContribution(
          program,
          contributor,
          new_campaign_pda,
          contribution_amount
        );
      } catch (error) {
        assert.isTrue(true);
      }
    });
  });
  describe("Remove contribution", async () => {
    let default_campaign_pda: anchor.web3.PublicKey;

    before(async () => {
      // Airdrop tokens for the deployment
      let deployer = await fundNewKey(provider.connection);

      // Initialize the campaign
      let _bump: any;
      [default_campaign_pda, _bump] = await createAndInitializeCampaignAccount(
        program,
        deployer,
        default_title,
        default_goal,
        default_end_ts,
        default_URI
      );
    });
    it("Withdraw correctly", async () => {
      // Create two contributors
      const contributor1 = await fundNewKey(provider.connection);
      const contributor2 = await fundNewKey(provider.connection);

      // Do two contributions
      const contribution_amount1 = 100000000;
      const contribution_pda1 = await createAndInitializeContribution(
        program,
        contributor1,
        default_campaign_pda,
        contribution_amount1
      );
      const contribution_amount2 = 150000000;
      await createAndInitializeContribution(
        program,
        contributor2,
        default_campaign_pda,
        contribution_amount2
      );

      // Now we do a single withdraw
      await program.methods
        .removeContribution()
        .accounts({
          campaign: default_campaign_pda,
          contribution: contribution_pda1,
          contributor: contributor1.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .signers([contributor1])
        .rpc();

      // Check the balance of the campaign
      const campaign_balance = await provider.connection.getBalance(
        default_campaign_pda
      );

      // The campaign now should have the balance from account two
      assert.strictEqual(
        campaign_balance,
        contribution_amount2 + 2115840 // Extra value for the account rent
      );

      // The account now must hold only share from user 2
      await checkCampaign(program, default_campaign_pda, {
        total_funds: contribution_amount2,
      });
    });
    it("Can withdraw on a closed and lost campaign", async () => {
      // We create a new campaign deployment, with one second into the future
      const curr_timestamp = Math.floor(Date.now() / 1000);
      let [new_campaign_pda, _bump] = await createAndInitializeCampaignAccount(
        program,
        await fundNewKey(provider.connection),
        default_title,
        default_goal,
        curr_timestamp + 1, // One second into the future
        default_URI
      );

      // Create contributor
      const contributor = await fundNewKey(
        provider.connection,
        default_goal * 2
      );

      // Do a contribution
      const contribution_amount = default_goal / 2; // Half the value to win
      const contribution_pda = await createAndInitializeContribution(
        program,
        contributor,
        new_campaign_pda,
        contribution_amount
      );

      // Sleep
      await sleep(1500);

      // Check the campaign
      await checkCampaign(program, new_campaign_pda, { is_successful: false });

      // The withdraw works perfectly
      await program.methods
        .removeContribution()
        .accounts({
          campaign: new_campaign_pda,
          contribution: contribution_pda,
          contributor: contributor.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .signers([contributor])
        .rpc();
    });
    it("Can't withdraw on a closed and won campaign", async () => {
      // We create a new campaign deployment, with one second into the future
      const curr_timestamp = Math.floor(Date.now() / 1000);
      let [new_campaign_pda, _bump] = await createAndInitializeCampaignAccount(
        program,
        await fundNewKey(provider.connection),
        default_title,
        default_goal,
        curr_timestamp + 1, // One second into the future
        default_URI
      );

      // Create contributor
      const contributor = await fundNewKey(
        provider.connection,
        default_goal * 2
      );

      // Do a contribution
      const contribution_amount = default_goal; // Win the campaign
      const contribution_pda = await createAndInitializeContribution(
        program,
        contributor,
        new_campaign_pda,
        contribution_amount
      );

      // Sleep
      await sleep(1500);

      // Check the campaign
      await checkCampaign(program, new_campaign_pda, { is_successful: true });

      // Now we try to withdraw
      try {
        // Now we do a single withdraw
        await program.methods
          .removeContribution()
          .accounts({
            campaign: new_campaign_pda,
            contribution: contribution_pda,
            contributor: contributor.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          } as any)
          .signers([contributor])
          .rpc();
      } catch (error) {
        assert.strictEqual(
          error.error.errorCode.code,
          "InteractionWithClosedCampaign"
        );
      }
    });
  });
  describe("Claim campaign", async () => {
    it("Claim correctly", async () => {
      // Airdrop tokens for the deployment
      let deployer = await fundNewKey(provider.connection);

      // Initialize the campaign
      const curr_timestamp = Math.floor(Date.now() / 1000);
      let [campaign_pda, _bump] = await createAndInitializeCampaignAccount(
        program,
        deployer,
        default_title,
        default_goal,
        curr_timestamp + 1, // Expire in one sec
        default_URI
      );

      // Do a contribution big enough
      // Create contributor
      const contributor = await fundNewKey(
        provider.connection,
        default_goal * 2
      );
      const contributor2 = await fundNewKey(
        provider.connection,
        default_goal * 2
      );

      // Do two contributions
      const contribution_amount = default_goal / 2; // Win the campaign
      await createAndInitializeContribution(
        program,
        contributor,
        campaign_pda,
        contribution_amount
      );
      const contribution_amount2 = default_goal; // Win the campaign
      await createAndInitializeContribution(
        program,
        contributor2,
        campaign_pda,
        contribution_amount2
      );

      // Sleep
      await sleep(1500);

      const deployer_balance = await provider.connection.getBalance(
        deployer.publicKey
      );

      // Try to claim the campaign
      await program.methods
        .claimCampaign()
        .accounts({
          campaign: campaign_pda,
          owner: deployer.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .signers([deployer])
        .rpc();

      // Check for balances
      const new_campaign_balance = await provider.connection.getBalance(
        campaign_pda
      );
      const new_deployer_balance = await provider.connection.getBalance(
        deployer.publicKey
      );
      // The campaign balance must now be zero (ony the rent)
      assert.strictEqual(
        new_campaign_balance,
        2115840 // Only the rent
      );

      // The deployer must now have the value from other users
      assert.strictEqual(
        new_deployer_balance,
        deployer_balance + contribution_amount + contribution_amount2
      );

      // The status is now claimed
      await checkCampaign(program, campaign_pda, {
        is_successful: true,
        is_withdrawn: true,
      });
    });
    it("Should not claim with closed campaign", async () => {
      // Airdrop tokens for the deployment
      let deployer = await fundNewKey(provider.connection);

      // Initialize the campaign
      const curr_timestamp = Math.floor(Date.now() / 1000);
      let [campaign_pda, _bump] = await createAndInitializeCampaignAccount(
        program,
        deployer,
        default_title,
        default_goal,
        curr_timestamp + 60, // Expire in one sec
        default_URI
      );

      // Try to close
      try {
        await program.methods
          .claimCampaign()
          .accounts({
            campaign: campaign_pda,
            owner: deployer.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          } as any)
          .signers([deployer])
          .rpc();
      } catch (error) {
        assert.strictEqual(error.error.errorCode.code, "ClaimOpenCampaign");
      }
    });
    it("Should not claim with not successful campaign", async () => {
      // Airdrop tokens for the deployment
      let deployer = await fundNewKey(provider.connection);

      // Initialize the campaign
      const curr_timestamp = Math.floor(Date.now() / 1000);
      let [campaign_pda, _bump] = await createAndInitializeCampaignAccount(
        program,
        deployer,
        default_title,
        default_goal,
        curr_timestamp + 1, // Expire in one sec
        default_URI
      );

      // Sleep
      await sleep(1500);

      // Try to close, no one has voted
      try {
        await program.methods
          .claimCampaign()
          .accounts({
            campaign: campaign_pda,
            owner: deployer.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          } as any)
          .signers([deployer])
          .rpc();
      } catch (error) {
        assert.strictEqual(
          error.error.errorCode.code,
          "ClaimNotSuccessCampaign"
        );
      }
    });
    it("Should not claim twice", async () => {
      // Airdrop tokens for the deployment
      let deployer = await fundNewKey(provider.connection);

      // Initialize the campaign
      const curr_timestamp = Math.floor(Date.now() / 1000);
      let [campaign_pda, _bump] = await createAndInitializeCampaignAccount(
        program,
        deployer,
        default_title,
        default_goal,
        curr_timestamp + 1, // Expire in one sec
        default_URI
      );

      // Do a contribution big enough
      const contributor = await fundNewKey(
        provider.connection,
        default_goal * 2
      );

      // Do two contributions
      const contribution_amount = default_goal; // Win the campaign
      await createAndInitializeContribution(
        program,
        contributor,
        campaign_pda,
        contribution_amount
      );

      // Sleep
      await sleep(1500);

      // Try to claim the campaign
      await program.methods
        .claimCampaign()
        .accounts({
          campaign: campaign_pda,
          owner: deployer.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .signers([deployer])
        .rpc();

      // Try to claim again
      try {
        await program.methods
          .claimCampaign()
          .accounts({
            campaign: campaign_pda,
            owner: deployer.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          } as any)
          .signers([deployer])
          .rpc();
      } catch (error) {
        assert.strictEqual(error.error.errorCode.code, "ClaimWithWithdraw");
      }
    });
  });
  it("Have the correct is_successful", async () => {
    // Airdrop tokens for the deployment
    let deployer = await fundNewKey(provider.connection);

    // Initialize the campaign
    const curr_timestamp = Math.floor(Date.now() / 1000);
    let [campaign_pda, _bump] = await createAndInitializeCampaignAccount(
      program,
      deployer,
      default_title,
      default_goal,
      curr_timestamp + 60, // Expire in one sec
      default_URI
    );

    // The status starts as false
    await checkCampaign(program, campaign_pda, {
      is_successful: false,
    });

    // Do a contribution big enough
    const contributor = await fundNewKey(provider.connection, default_goal * 2);
    const contribution_pda = await createAndInitializeContribution(
      program,
      contributor,
      campaign_pda,
      default_goal
    );

    // The status starts is now true
    await checkCampaign(program, campaign_pda, {
      is_successful: true,
    });

    // Do a new contribution, less than the target
    const contributor2 = await fundNewKey(
      provider.connection,
      default_goal * 2
    );
    await createAndInitializeContribution(
      program,
      contributor2,
      campaign_pda,
      default_goal / 2
    );

    // The status is still true
    await checkCampaign(program, campaign_pda, {
      is_successful: true,
    });

    // Now the one withdraw
    await program.methods
      .removeContribution()
      .accounts({
        campaign: campaign_pda,
        contribution: contribution_pda,
        contributor: contributor.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .signers([contributor])
      .rpc();

    // The status is now false
    await checkCampaign(program, campaign_pda, {
      is_successful: false,
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
    } as any) // Cast as any because TS is crazy
    .signers([owner])
    .rpc();

  return [campaign_pda, campaign_bump];
}

// Create a new contribution
async function createAndInitializeContribution(
  program: anchor.Program<Solfund>,
  contributor: anchor.web3.Keypair,
  campaign: anchor.web3.PublicKey,
  amount: number
): Promise<anchor.web3.PublicKey> {
  // Generate the PDA for the account
  const [contribution_pda, _] = getContributionPDA(
    contributor.publicKey,
    campaign,
    program.programId
  );

  // Do the contribution
  await program.methods
    .newContribution(new anchor.BN(amount))
    .accounts({
      campaign: campaign,
      contribution: contribution_pda,
      contributor: contributor.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    } as any) // Cast as any because TS is crazy
    .signers([contributor])
    .rpc(); // Need to skip pre-flight for timing errors

  return contribution_pda;
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
      anchor.utils.bytes.utf8.encode(title),
    ],
    program_id
  );
}

// Get the PDA for a contribution
function getContributionPDA(
  contributor: anchor.web3.PublicKey,
  campaign: anchor.web3.PublicKey,
  program_id: anchor.web3.PublicKey
) {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("Contribution"),
      contributor.toBuffer(),
      campaign.toBuffer(),
    ],
    program_id
  );
}

// Check the campaign
async function checkCampaign(
  program: anchor.Program<Solfund>,
  campaign: anchor.web3.PublicKey,
  expected: {
    bump?: number;
    owner?: anchor.web3.PublicKey;
    goal?: number;
    title?: string;
    end_ts?: number;
    metadata_uri?: string;
    total_funds?: number;
    is_successful?: boolean;
    is_withdrawn?: boolean;
  }
) {
  // Fetch the data
  let campaign_data = await program.account.campaign.fetch(campaign);

  // Start the checks
  if (expected.bump) {
    assert.strictEqual(campaign_data.bump.toString(), expected.bump.toString());
  }
  if (expected.owner) {
    assert.strictEqual(
      campaign_data.owner.toString(),
      expected.owner.toString()
    );
  }
  if (expected.goal) {
    assert.strictEqual(campaign_data.goal.toString(), expected.goal.toString());
  }
  if (expected.title) {
    const title_from_data = convertByteToString(
      campaign_data.title,
      campaign_data.titleLength
    );
    assert.strictEqual(title_from_data, expected.title);
  }
  if (expected.end_ts) {
    assert.strictEqual(
      campaign_data.endTs.toString(),
      expected.end_ts.toString()
    );
  }
  if (expected.metadata_uri) {
    const uri_from_data = convertByteToString(
      campaign_data.metadataUri,
      campaign_data.metadataUriLength
    );
    assert.strictEqual(uri_from_data, expected.metadata_uri);
  }
  if (expected.total_funds) {
    assert.strictEqual(
      campaign_data.totalFunds.toString(),
      expected.total_funds.toString()
    );
  }
  if (expected.is_successful) {
    assert.strictEqual(
      campaign_data.isSuccessful.toString(),
      expected.is_successful.toString()
    );
  }
  if (expected.is_withdrawn) {
    assert.strictEqual(
      campaign_data.isWithdrawn.toString(),
      expected.is_withdrawn.toString()
    );
  }
}

// Check a contribution
async function checkContribution(
  program: anchor.Program<Solfund>,
  contribution: anchor.web3.PublicKey,
  expected: {
    contributor?: anchor.web3.PublicKey;
    amount?: number;
  }
) {
  // Fetch the data
  let contribution_data = await program.account.contribution.fetch(
    contribution
  );

  // Check the data
  if (expected.contributor) {
    assert.strictEqual(
      contribution_data.contributor.toString(),
      expected.contributor.toString()
    );
  }
  if (expected.amount) {
    assert.strictEqual(
      contribution_data.amount.toString(),
      expected.amount.toString()
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

// Make the system sleep, good for timing tests
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
