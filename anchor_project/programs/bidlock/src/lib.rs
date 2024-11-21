use anchor_lang::prelude::*;

declare_id!("6nA8jovPtG8i3LCFrbvC9dYt6yLsg15U4z5WfqL3Zaqz");

#[program]
pub mod bidlock {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
