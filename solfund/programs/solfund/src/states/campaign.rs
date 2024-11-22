use anchor_lang::prelude::*;

/// The max size for the metadata URI
pub const METADATA_URI_LENGTH: usize = 64;

/// Represents a funding campaign on the system
#[account]
#[derive(Debug)]
pub struct Campaign {
    /// The bump seed for the account
    pub bump: u8,
    /// The owner of the campaign
    pub owner: Pubkey,
    /// The goal of the campaign (in lamports)
    pub goal: u64,
    /// When the campaign has started (unix timestamp)
    pub start_ts: i64,
    /// When the campaign will end (unix timestamp)
    pub end_ts: i64,
    /// The metadata for the campaign as IPFS hash
    pub metadata_uri: [u8; METADATA_URI_LENGTH],
    /// The final size of the metadata URI
    pub metadata_uri_length: u16,
    /// The total funds on the account
    pub total_funds: u64,
    /// If the campaign has been successful
    pub is_successful: bool,
    /// If the owner has withdrawn the funds
    pub is_withdrawn: bool,
}

impl Campaign {
    /// The length of the data structure
    pub const LEN: usize = 8 + std::mem::size_of::<Campaign>();
}
