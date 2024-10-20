import { useProgramMethods } from '@/components/vaquinha/vaquinha-data-access';
import { GroupPeriod, GroupResponseDTO } from '@/types';
import { BN } from '@coral-xyz/anchor';
import { useCallback } from 'react';

const USDC_DECIMALS = 1000000;

const convertFrequencyToTimestamp = (period: GroupPeriod): BN => {
  const SECONDS_PER_DAY = 86400; // 24 hours * 60 minutes * 60 seconds
  const frequencyInDays = period === 'weekly' ? 7 : 30;
  const frequencyInSeconds = frequencyInDays * SECONDS_PER_DAY;
  // Return as BN (Big Number) which is commonly used for large integers in Solana
  return new BN(frequencyInSeconds);
};

export const useVaquinhaDeposit = () => {
  const { initializeRound, addPlayer, payTurn } = useProgramMethods();

  const depositCollateralAndCreate = useCallback(
    async (
      group: GroupResponseDTO
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      const paymentAmount = group.amount * USDC_DECIMALS;
      const numberOfPlayers = group.totalMembers;
      const frequencyOfTurns = convertFrequencyToTimestamp(group.period);
      const tokenMintAddress = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'; // Circle USDC
      const { tx, error } = await initializeRound(
        group.id,
        paymentAmount,
        numberOfPlayers,
        frequencyOfTurns,
        tokenMintAddress,
        group.myPosition
      );

      return { tx: tx || '', error, success: !!tx && !error };
    },
    [initializeRound]
  );

  const depositCollateralAndJoin = useCallback(
    async (
      group: GroupResponseDTO
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      const tokenMintAddress = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';
      const { tx, error } = await addPlayer(
        group.id,
        tokenMintAddress,
        group.myPosition
      );

      return { tx: tx || '', error, success: !!tx && !error };
    },
    [addPlayer]
  );

  const depositRoundPayment = useCallback(
    async (
      group: GroupResponseDTO,
      turn: number
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      const tokenMintAddress = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';
      const { tx, error } = await payTurn(group.id, tokenMintAddress, turn);

      return { tx: tx || '', error, success: !!tx && !error };
    },
    [payTurn]
  );

  return {
    depositCollateralAndCreate,
    depositCollateralAndJoin,
    depositRoundPayment,
  };
};
