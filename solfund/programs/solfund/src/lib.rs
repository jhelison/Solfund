/// A program to create funding campaigns
/// This has a basic implementation that encompass:
/// 1. Proposal creation
/// 2. Adding new milestones
/// 3. Create new contributions
///
/// TODO:
/// - Add a update contribution

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("DqajaMsDVX9DiXt3Ld2p6C8QghNCRqkfcZBzkMF7PSQ7");

pub mod error;
pub mod instructions;
pub mod states;

/// This is main entrypoint for the program
#[program]
pub mod solfund {
    use super::*;

    /// Creates a new campaign
    pub fn new_campaign(
        ctx: Context<NewCampaign>,
        title: String,
        goal: u64,
        end_ts: i64,
        metadata_uri: String,
    ) -> Result<()> {
        handle_new_campaign(ctx, title, goal, end_ts, metadata_uri)
    }

    /// Creates a new contribution
    pub fn new_contribution(
        ctx: Context<NewContribution>,
        amount: u64,
    ) -> Result<()> {
        handle_new_contribution(ctx, amount)
    }

    /// Remove a contribution
    pub fn remove_contribution(
        ctx: Context<RemoveContribution>,
    ) -> Result<()> {
        handle_remove_contribution(ctx)
    }
}
