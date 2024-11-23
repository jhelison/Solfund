import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const solToLamports = (sol: number): number => {
  return sol * LAMPORTS_PER_SOL;
};

export const lamportsToSol = (lamports: number): number => {
  return lamports / LAMPORTS_PER_SOL;
};
