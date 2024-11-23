import Link from "next/link";
import dynamic from 'next/dynamic';
import React from "react";

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const AppBar: React.FC = () => {
  return (
    <header className="bg-white shadow">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900">
        Solana Fundraiser
      </h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/create-campaign"
              className="text-gray-600 hover:text-gray-900"
            >
              Create Campaign
            </Link>
          </li>
          <li>
            <Link
              href="/my-contributions"
              className="text-gray-600 hover:text-gray-900"
            >
              My Contributions
            </Link>
          </li>
        </ul>
      </nav>
      <WalletMultiButtonDynamic className="btn-ghost btn-sm rounded-btn text-lg mr-6 " />
    </div>
  </header>
  );
};
