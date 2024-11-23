use anchor_lang::prelude::*;

use crate::error::ErrorCode;
use crate::states::campaign::Campaign;
use crate::states::contribution::*;

/// Accounts for a remove contribution
#[derive(Accounts)]
pub struct RemoveContribution<'info> {
    /// The [Campaign]
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,

    /// The [Contribution]
    #[account(
        // Start the account as mutable
        mut,
        // The seeds are the string Contribution, the contributor key and the campaign key
        seeds = [
            b"Contribution".as_ref(),
            contributor.key().to_bytes().as_ref(), // This also checks for ownership
            campaign.key().to_bytes().as_ref(),
        ],
        // The bump of the account
        bump,
        // We close the account at the end, return the lamports
        close = contributor,
    )]
    pub contribution: Account<'info, Contribution>,

    /// The contributor for the campaign
    /// This is receiver of the closed account and must be the owner
    #[account(mut)]
    pub contributor: Signer<'info>,

    /// The [System] program.
    pub system_program: Program<'info, System>,
}

/// Handle a removal of a distribution
/// The following is done:
/// - We check if the campaign is still online
/// - We send the funds back to the user
/// - We update the campaign
pub fn handle_remove_contribution(ctx: Context<RemoveContribution>) -> Result<()> {
    // Select the accounts
    let contribution = &ctx.accounts.contribution;
    let campaign = &mut ctx.accounts.campaign;
    let contributor = &mut ctx.accounts.contributor;

    // Get the current timestamp for validations
    let curr_timestamp = Clock::get()?.unix_timestamp;

    // The campaign must be open
    require!(
        campaign.end_ts >= curr_timestamp,
        ErrorCode::InteractionWithClosedCampaign,
    );

    // Transfer the amounts
    **campaign.to_account_info().try_borrow_mut_lamports()? -= contribution.amount;
    **contributor.to_account_info().try_borrow_mut_lamports()? += contribution.amount;

    // Update the campaign
    campaign.total_funds -= contribution.amount;

    // Log a message
    msg! {
        "A contribution was removed campaign = {}, contribution = {}, contributor = {}, amount = {}",
        campaign.key(),
        contribution.key(),
        contribution.contributor,
        contribution.amount,
    }

    Ok(())
}
