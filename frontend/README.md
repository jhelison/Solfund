# SolFund Frontend

This repository contains the **frontend** for the **SolFund** Solana smart contract, built with **Next.js** and **React Query**.

The contract is current deployed on DEVNET with the address:

- `DqajaMsDVX9DiXt3Ld2p6C8QghNCRqkfcZBzkMF7PSQ7`

A FE is available at:

- https://solfund.jhelison.com/

---

## Features

- **Campaign Management**:

  - Create new campaigns with a title, goal, end date, and metadata URI.
  - View active and completed campaigns.
  - Claim funds from successful campaigns.

- **Contributions**:

  - Add contributions to campaigns.
  - View contribution details.
  - Remove contributions when applicable.

---

### TODO

The following are open improvements to the project:

1. Edit campaign

- Users may be able to edit a campaign
- The UI must be built for this

2. Mobile

- This app must be adapted for multiple screens
- Responsiveness must be added

## Getting Started

### Prerequisites

- **Node.js** (v16 or later)
- **Yarn** or **npm**
- Wallet setup (e.g., [Phantom](https://phantom.app/)) for Solana transactions.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd solfund-frontend
   ```

2. Install dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

3. Start the development server:

   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. Open the app in your browser at [http://localhost:3000](http://localhost:3000).

---

## Key Technologies

- **Next.js**: Framework for server-rendered and static web applications.
- **React Query**: Data fetching, caching, and synchronization for API and blockchain calls.
- **Solana Web3.js**: Library for interacting with the Solana blockchain.
- **Tailwind CSS**: Utility-first styling for a responsive design.
- **IPFS**: IPFS is used as storage for data

---

## Project Structure

```plaintext
├── components       # Reusable UI components
├── hooks            # Custom hooks for blockchain and query logic
├── pages            # Next.js routes (e.g., Home, Campaigns)
├── public           # Static assets
├── services         # API and blockchain service functions
├── styles           # Global and module-specific styles
└── utils            # Utility functions (e.g., formatting, error handling)
```

---

## Usage

### Creating a Campaign

1. Connect your wallet using the **Connect Wallet** button.
2. Navigate to the **Create Campaign** page.
3. Fill in the details (title, goal, end date, metadata URI).
4. Submit the form and approve the transaction in your wallet.

### Contributing to a Campaign

1. Select an active campaign from the **Campaigns** page.
2. Enter the contribution amount and confirm.
3. Approve the transaction in your wallet.

### Claiming Funds

1. Campaign owners can navigate to their campaign's details page.
2. Click the **Claim Funds** button to retrieve funds.

---

## Contributing

Contributions are welcome! If you encounter any bugs or have feature suggestions, please open an issue or submit a pull request.

---

## License

This project is licensed under the [MIT License](../LICENSE).
