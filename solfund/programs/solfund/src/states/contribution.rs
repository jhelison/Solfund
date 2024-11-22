use anchor_lang::prelude::*;

/// Represents a contribution
#[account]
#[derive(Default, Debug)]
pub struct Contribution {
    /// The owner of the contribution
    pub contributor: Pubkey,
    /// The amount of the contribution
    pub amount: u64,
}

impl Contribution {
    /// The length of the data structure
    pub const LEN: usize = 8 + std::mem::size_of::<Contribution>();
}
