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
    #[msg("Campaign title must be provided")]
    CampaignTitleEmpty,
    #[msg("Can't interact with a expired campaign")]
    InteractionWithClosedCampaign,
    #[msg("Contribution can't be zero")]
    ZeroContribution,
    #[msg("Account is not authorized to execute this instruction")]
    Unauthorized,
    #[msg("Arithmetic Error (overflow/underflow)")]
    ArithmeticError,
    #[msg("Can't claim on open campaign")]
    ClaimOpenCampaign,
    #[msg("Can't claim on a not successful campaign")]
    ClaimNotSuccessCampaign,
    #[msg("Can't claim on a already withdrawn campaign")]
    ClaimWithWithdraw,
}
