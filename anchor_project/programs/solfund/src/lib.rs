use anchor_lang::prelude::*;

declare_id!("DqajaMsDVX9DiXt3Ld2p6C8QghNCRqkfcZBzkMF7PSQ7");

#[program]
pub mod solfund {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
