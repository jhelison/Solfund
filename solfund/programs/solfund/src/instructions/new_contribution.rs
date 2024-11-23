use anchor_lang::{prelude::*, solana_program};

use crate::error::ErrorCode;
use crate::states::campaign::Campaign;
use crate::states::contribution::*;

/// Accounts for a new contribution
#[derive(Accounts)]
pub struct NewContribution<'info> {
    /// The [Campaign]
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,

    /// The [Contribution]
    #[account(
        // Initialize the account
        init,
        // The seeds are the string Contribution, the contributor key and the campaign key
        seeds = [
            b"Contribution".as_ref(),
            contributor.key().to_bytes().as_ref(),
            campaign.key().to_bytes().as_ref(),
        ],
        // The bump of the account
        bump,
        // The space of the account
        space = Contribution::LEN,
        // The payer is the contributor
        payer = contributor,
    )]
    pub contribution: Account<'info, Contribution>,

    /// The contributor for the campaign, also the fee payer
    #[account(mut)]
    pub contributor: Signer<'info>,

    /// The [System] program.
    pub system_program: Program<'info, System>,
}

/// Handle the creation of a new contribution
/// The following is done:
/// - We check the if campaign has ended
/// - We remove the contribution from the user account
/// - We update the track on the campaign
pub fn handle_new_contribution(ctx: Context<NewContribution>, amount: u64) -> Result<()> {
    // Select the accounts
    let contributor = &ctx.accounts.contributor;
    let campaign = &mut ctx.accounts.campaign;

    // Get the current timestamp for validations
    let curr_timestamp = Clock::get()?.unix_timestamp;

    // The campaign must be open
    require!(
        campaign.end_ts >= curr_timestamp,
        ErrorCode::InteractionWithClosedCampaign,
    );

    // The value must be bigger than zero
    require!(amount > 0, ErrorCode::ZeroContribution,);

    // Invoke the send instruction
    solana_program::program::invoke(
        &solana_program::system_instruction::transfer(contributor.key, &campaign.key(), amount),
        &[contributor.to_account_info(), campaign.to_account_info()],
    )?;

    // Update the contribution key
    let contribution = &mut ctx.accounts.contribution;
    contribution.amount = amount;
    contribution.contributor = contributor.key();

    // Update the campaign
    campaign.total_funds += contribution.amount;

    // Log a message
    msg! {
        "A new contribution was created campaign = {}, contribution = {}, contributor = {}, amount = {}",
        campaign.key(),
        contribution.key(),
        contribution.contributor,
        contribution.amount,
    }

    Ok(())
}
