# SolFund Monorepo

![Solfund UI](./assets/fund-raiser.png)

This monorepo contains both the frontend and Solana smart contract for SolFund, a crowdfunding platform built on the Solana blockchain.

The contract is currently deployed on DEVNET with the address:

- `DqajaMsDVX9DiXt3Ld2p6C8QghNCRqkfcZBzkMF7PSQ7`

The frontend is available at:

- [https://solfund.jhelison.com/](https://solfund.jhelison.com/)

---

## The projects

This monorepo is made by two projects:

- A great smart contract for solana
- A awfully made frontend for the great smart contract (I'm a backend guy)

### [Solfund Solana contract](./solfund/README.md)

The contract is made using anchor and has the following features:

- **Create Campaigns**: Start a new funding campaign with a title, goal, end date, and metadata URI.
- **Claim Campaign Funds**: Enable campaign owners to claim funds after meeting campaign conditions.
- **Contributions Management**:
  - Add new contributions to campaigns.
  - Remove contributions if needed.
- **Update Campaign Metadata**: Update the metadata URI associated with a campaign.

The contract was designed to use IPFS as metadata. The following is the structure of the metadata on the FE:

```json
{
  "logo": "",
  "banner": "",
  "subtitle": "",
  "description": "",
  "milestones": [
    {
      "description": "",
      "target": 0
    }
  ]
}
```

Where:

- `logo` and `banner` are links or IPFS
- `description` is a HTML with the campaign description

## [Solfund Frontend](./frontend/README.md)

This is my awafull implementation of a Frontend for the App.
It creates a UI around most of the features for the contract.

---

## TODOs

### Frontend

1. **Edit Campaign**: Allow users to edit campaign details through the UI.
2. **Mobile Responsiveness**: Adapt the app for multiple screen sizes.

### Smart Contract

1. **Update Contributions**: Add functionality to modify existing contributions.
2. **Update Campaign Owner**: Allow transferring ownership of campaigns to a new user.
3. **Update Metadata URI**: Improve the metadata update functionality.

---

## Getting Started

You can find guides to get start on each of the projects:

- [Solfund Solana Contract](./solfund/README.md)
- [Solfund Frontend](./frontend/README.md)

---

## Contributing

Contributions are welcome! If you encounter any bugs or have feature suggestions, please open an issue or submit a pull request.

---

## License

This project is licensed under the [MIT License](../LICENSE).
