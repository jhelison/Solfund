/// A program to create funding campaigns
/// This has a basic implementation that encompass:
/// 1. Proposal creation
/// 2. Adding new milestones
/// 3. Create new contributions

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("DqajaMsDVX9DiXt3Ld2p6C8QghNCRqkfcZBzkMF7PSQ7");

pub mod error;
pub mod instructions;
pub mod states;

#[program]
pub mod solfund {
    use super::*;

    pub fn new_campaign(
        ctx: Context<NewCampaign>,
        goal: u64,
        end_ts: i64,
        metadata_uri: String,
    ) -> Result<()> {
        handle_new_campaign(ctx, goal, end_ts, metadata_uri)
    }
}
