use anchor_lang::prelude::*;

/// The max size of the milestone description
pub const MILESTONE_DESC_LENGTH: usize = 64;

/// Represents a milestone on a campaign
#[account]
#[derive(Debug)]
pub struct Milestone {
    /// A short description for the milestone
    pub description: [u8; MILESTONE_DESC_LENGTH],
    /// The target for the milestone
    pub target: u64,
}

impl Milestone {
    /// The length of the data structure
    pub const LEN: usize = 8 + std::mem::size_of::<Milestone>();
}
