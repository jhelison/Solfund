use anchor_lang::prelude::*;

use crate::error::ErrorCode;
use crate::states::campaign::*;

/// Accounts for the new_campaign
#[derive(Accounts)]
#[instruction(title: String)]
pub struct NewCampaign<'info> {
    /// [Campaign]
    #[account(
        // Initialize the account
        init,
        // The seeds are string campaign, the owner bytes and the title
        seeds = [
            b"Campaign".as_ref(),
            owner.key().to_bytes().as_ref(),
            title.as_bytes(),
        ],
        // The bump of the account
        bump,
        // The space is the len of the campaign data structure
        space = Campaign::LEN,
        // The payer is the owner
        payer = owner,
    )]
    pub campaign: Account<'info, Campaign>,

    /// Owner for the campaign, also the payer for the fees
    #[account(mut)]
    pub owner: Signer<'info>,

    /// The [System] program.
    pub system_program: Program<'info, System>,
}

/// Handle the creation of a new campaign
/// The following is checked for a good campaign:
/// 1. The end date must be in the future and have at least one day
/// 2. The goal must not be zero
/// 3. The IPFS metadata must be valid
pub fn handle_new_campaign(
    ctx: Context<NewCampaign>,
    title: String,
    goal: u64,
    end_ts: i64,
    metadata_uri: String,
) -> Result<()> {
    // Get the current timestamp for validations
    let curr_timestamp = Clock::get()?.unix_timestamp;

    // The campaign must  be at least one day
    require!(end_ts >= curr_timestamp, ErrorCode::CampaignTsNotBigEnough,);

    // The goal must be bigger than zero
    require!(goal > 0, ErrorCode::CampaignZeroGoal,);

    // The IPFS metadata must be valid
    // TODO: Improve me, for now we check if it's empty and if it's whiting the max size
    let trimmed_uri = metadata_uri.trim();
    require!(!trimmed_uri.is_empty(), ErrorCode::CampaignURIEmpty,);
    require!(
        trimmed_uri.as_bytes().len() <= METADATA_URI_LENGTH,
        ErrorCode::CampaignURITooBig,
    );

    // Check the title, since we using as seed the max is already 32 bytes
    let trimmed_title = title.trim();
    require!(!trimmed_title.is_empty(), ErrorCode::CampaignTitleEmpty,);

    // Create the account and update the fields
    let campaign = &mut ctx.accounts.campaign;

    // First the IPFS
    let mut ipfs_metadata_data = [0u8; METADATA_URI_LENGTH];
    ipfs_metadata_data[..trimmed_uri.as_bytes().len()].copy_from_slice(trimmed_uri.as_bytes());
    campaign.metadata_uri = ipfs_metadata_data;
    campaign.metadata_uri_length = trimmed_uri.as_bytes().len() as u16;

    // Second the title
    let mut title_data = [0u8; TITLE_LENGTH];
    title_data[..trimmed_title.as_bytes().len()].copy_from_slice(trimmed_title.as_bytes());
    campaign.title = title_data;
    campaign.title_length = trimmed_title.as_bytes().len() as u16;

    // Store the remaining data
    campaign.bump = ctx.bumps.campaign;
    campaign.owner = ctx.accounts.owner.key();
    campaign.goal = goal;
    campaign.start_ts = curr_timestamp;
    campaign.end_ts = end_ts;
    campaign.total_funds = 0;
    campaign.is_successful = false;
    campaign.is_withdrawn = false;

    // Log a message
    msg! {
        "New campaign created with title = {}, owner = {}, goal = {}, start_ts = {}, end_ts = {}, metadata_uri = {}",
        trimmed_title,
        campaign.owner,
        campaign.goal,
        campaign.start_ts,
        campaign.end_ts,
        trimmed_uri,
    }

    Ok(())
}
