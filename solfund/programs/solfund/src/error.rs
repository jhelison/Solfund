use anchor_lang::error_code;

/// Error codes for the program
#[error_code]
pub enum ErrorCode {
    #[msg("Campaign end timestamp must be in the future and have at least 24 hours")]
    CampaignTsNotBigEnough,
    #[msg("Campaign goal must be bigger than zero")]
    CampaignZeroGoal,
    #[msg("Campaign Metadata URI must be provided")]
    CampaignURIEmpty,
    #[msg("Campaign Metadata URI is too big")]
    CampaignURITooBig,
}
