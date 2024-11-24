# SolFund

**SolFund** is a Solana program that allows users to create and manage funding campaigns. This program enables the creation of proposals, the addition of milestones, and the facilitation of contributions, making it a versatile tool for crowdfunding projects.

The contract is current deployed on DEVNET with the address:

- `DqajaMsDVX9DiXt3Ld2p6C8QghNCRqkfcZBzkMF7PSQ7`

A FE is available at:

- https://solfund.jhelison.com/

## Features

- **Create Campaigns**: Start a new funding campaign with a title, goal, end date, and metadata URI.
- **Claim Campaign Funds**: Enable campaign owners to claim funds after meeting campaign conditions.
- **Contributions Management**:
  - Add new contributions to campaigns.
  - Remove contributions if needed.
- **Update Campaign Metadata**: Update the metadata URI associated with a campaign.

---

## TODOs

Planned improvements include:

1. **Update Contributions**: Add functionality to modify existing contributions.
2. **Update Campaign Owner**: Allow transferring ownership of campaigns to a new user.
3. **Update Metadata URI**: Improve the metadata update functionality.

---

## Getting Started

### Prerequisites

- [Anchor Framework](https://www.anchor-lang.com/)
- Solana CLI and a local/testnet/mainnet Solana cluster.

### Build and Deploy

1. Clone the repository.
2. Install dependencies with Anchor:
   ```bash
   anchor build
   ```
3. Deploy the program:
   ```bash
   anchor deploy
   ```

### Test

This app was tested using anchor. To run the tests use:

```bash
anchor test
```

### Program ID

The program is deployed on **DEVNET** with the ID:

```
DqajaMsDVX9DiXt3Ld2p6C8QghNCRqkfcZBzkMF7PSQ7
```

---

## Usage

### Instructions

Below are the main instructions available in the **SolFund** program:

1. **Create Campaign**

   - Method: `new_campaign`
   - Parameters:
     - `title: String`: Campaign title.
     - `goal: u64`: Funding goal in lamports.
     - `end_ts: i64`: End timestamp for the campaign.
     - `metadata_uri: String`: URI for campaign metadata.
       - IPFS can be used for the data

2. **Claim Campaign**

   - Method: `claim_campaign`
   - Parameters: None.

3. **Add Contribution**

   - Method: `new_contribution`
   - Parameters:
     - `amount: u64`: Amount contributed in lamports.

4. **Remove Contribution**

   - Method: `remove_contribution`
   - Parameters: None.

5. **Update Campaign Metadata URI**
   - Method: `update_campaign_uri`
   - Parameters:
     - `metadata_uri: String`: Updated URI for campaign metadata.

---

## Code Structure

- **`program`**: Entry point for the program, containing all major instructions.
- **`instructions`**: Module defining all instruction handlers.
- **`states`**: Module for managing program state.
- **`error`**: Module defining custom error types.

---

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request for any enhancements, bug fixes, or documentation improvements.

---

## License

This project is licensed under the [MIT License](../LICENSE).
