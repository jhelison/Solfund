use anchor_lang::prelude::*;

use crate::error::ErrorCode;
use crate::states::campaign::*;

/// Accounts for the claim_campaign
#[derive(Accounts)]
pub struct ClaimCampaign<'info> {
    /// The [Campaign]
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,

    /// Owner for the campaign
    #[account(mut, address = campaign.owner @ ErrorCode::Unauthorized)]
    pub owner: Signer<'info>,
}

/// Claim the reward of a closed campaign
/// This does the following checks:
/// 1. The campaign must be expired
/// 2. The claim must be successful
/// 3. The campaign must not have been claimed before
pub fn handle_claim_campaign(ctx: Context<ClaimCampaign>) -> Result<()> {
    // Get the campaign account
    let campaign = &mut ctx.accounts.campaign;
    let owner = &mut ctx.accounts.owner;

    // Get the current timestamp
    let curr_timestamp = Clock::get()?.unix_timestamp;

    // The campaign must be closed
    require!(
        curr_timestamp >= campaign.end_ts,
        ErrorCode::ClaimOpenCampaign,
    );

    // The campaign must be success
    require!(campaign.is_successful, ErrorCode::ClaimNotSuccessCampaign,);

    // The campaign must not have been withdrawn before
    require!(!campaign.is_withdrawn, ErrorCode::ClaimWithWithdraw);

    // Transfer the amounts
    **campaign.to_account_info().try_borrow_mut_lamports()? -= campaign.total_funds;
    **owner.to_account_info().try_borrow_mut_lamports()? += campaign.total_funds;

    // We flip the claimed flag
    campaign.is_withdrawn = true;

    Ok(())
}
