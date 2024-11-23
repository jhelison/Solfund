import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
export const Footer: FC = () => {
    return (
        <footer className="bg-white shadow mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; 2024 Solana Fundraiser.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.jhelison.com"
                className="text-sm text-gray-500 hover:text-gray-700"
                target="_blank"
              >
                Jhelison Uchoa
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
};
