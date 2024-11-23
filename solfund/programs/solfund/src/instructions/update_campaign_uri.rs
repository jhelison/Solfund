use anchor_lang::prelude::*;

use crate::error::ErrorCode;
use crate::states::campaign::*;

/// Accounts for the update_campaign_uri
#[derive(Accounts)]
pub struct UpdateCampaignURI<'info> {
    /// The [Campaign]
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,

    /// Owner for the campaign
    #[account(mut, address = campaign.owner @ ErrorCode::Unauthorized)]
    pub owner: Signer<'info>,
}

/// Update a campaign URI
/// This does the following checks:
/// 1. The campaign must be open
pub fn handle_update_campaign_uri(
    ctx: Context<UpdateCampaignURI>,
    metadata_uri: String,
) -> Result<()> {
    // Take the accounts
    let campaign = &mut ctx.accounts.campaign;

    // Get the current timestamp for validations
    let curr_timestamp = Clock::get()?.unix_timestamp;

    // The campaign must be open
    require!(
        campaign.end_ts >= curr_timestamp,
        ErrorCode::InteractionWithClosedCampaign,
    );

    // The IPFS metadata must be valid
    // TODO: Improve me, for now we check if it's empty and if it's whiting the max size
    let trimmed_uri = metadata_uri.trim();
    require!(!trimmed_uri.is_empty(), ErrorCode::CampaignURIEmpty,);
    require!(
        trimmed_uri.as_bytes().len() <= METADATA_URI_LENGTH,
        ErrorCode::CampaignURITooBig,
    );

    // Update the IPFS
    let mut ipfs_metadata_data = [0u8; METADATA_URI_LENGTH];
    ipfs_metadata_data[..trimmed_uri.as_bytes().len()].copy_from_slice(trimmed_uri.as_bytes());
    campaign.metadata_uri = ipfs_metadata_data;
    campaign.metadata_uri_length = trimmed_uri.as_bytes().len() as u16;

    Ok(())
}
