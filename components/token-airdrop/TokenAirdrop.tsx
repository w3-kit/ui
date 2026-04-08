"use client";

import React, { useState } from "react";
import { Gift, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AirdropInfo, TokenAirdropProps } from "./types";
import { getAirdropStatus, formatDate, getStatusVariant } from "./utils";

export type { AirdropInfo, TokenAirdropProps };

export const TokenAirdrop: React.FC<TokenAirdropProps> = ({ airdrops, onClaim, className }) => {
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleClaim = async (id: string) => {
    setClaimingId(id);
    try {
      await onClaim(id);
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <Gift className="h-4 w-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Token Airdrops</h3>
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
          {airdrops.length} airdrops
        </span>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {airdrops.map((airdrop) => {
          const status = getAirdropStatus(airdrop);
          return (
            <div key={airdrop.id} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TokenIcon symbol={airdrop.tokenSymbol} logoURI={airdrop.logoURI} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {airdrop.amount} {airdrop.tokenSymbol}
                      </p>
                      <Badge variant={getStatusVariant(status)}>{status}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{airdrop.tokenName}</p>
                  </div>
                </div>
                {status === "active" && (
                  <Button
                    onClick={() => handleClaim(airdrop.id)}
                    disabled={claimingId === airdrop.id}
                    size="sm"
                  >
                    {claimingId === airdrop.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Claim"
                    )}
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Start: {formatDate(airdrop.startTime)}</span>
                <span>End: {formatDate(airdrop.endTime)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TokenAirdrop;
