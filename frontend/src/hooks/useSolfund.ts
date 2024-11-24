"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import { Idl } from "@coral-xyz/anchor";
import idl from "@/types/solfund.json";
import { useMemo } from "react";
import { Solfund } from "@/types/solfund";

const solfundIdl = idl as unknown as Idl;

export function useSolfundProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = useMemo(() => {
    if (!wallet || !wallet.publicKey) return null;
    console.log(connection.rpcEndpoint)
    return new AnchorProvider(connection, wallet, {
      preflightCommitment: "confirmed",
    });
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    try {
      return new Program(solfundIdl, provider) as unknown as Program<Solfund>;
    } catch (error) {
      console.error("Failed to initialize Solfund program:", error);
      return null;
    }
  }, [provider]);

  return program;
}
