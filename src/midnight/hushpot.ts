// HushPot contract wiring for the browser.
//
// Mirrors deploy/contract/hushpot.ts but for the web build: the managed tree
// (managed/hushpot) supplies the contract type; the witnesses are pure and
// browser-safe; the compiled-contract assets (zkir/prover/verifier keys) are
// bundled as URLs and fetched lazily by src/midnight/zkAssets.ts.

import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import type { WitnessContext } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { Contract, type Ledger } from '../../managed/hushpot/contract/index.js';

/** The deployed HushPot contract on Preprod (see README "Contract Address"). */
export const HUSHPOT_ADDRESS =
  'b6709e66086cfa77d4bd88b1b918d03e1c1dde2c4584cc4dda005389a95914a9';

/** Target network for the dapp. */
export const TARGET_NETWORK_ID = 'preprod' as const;

export type CircuitId = 'join' | 'pledge' | 'provePledgeAtLeast' | 'closeEntries' | 'claim';

export type HushpotPrivateState = {
  /** Member secret key — identity, never crosses the circuit boundary. */
  readonly sk: Uint8Array;
  /** The pledge amount — crosses only as a salted commitment. */
  readonly amount: bigint;
};

export const createHushpotPrivateState = (
  sk: Uint8Array,
  amount: bigint,
): HushpotPrivateState => ({ sk, amount });

export const hushpotWitnesses = {
  localSk: ({
    privateState,
  }: WitnessContext<Ledger, HushpotPrivateState>): [HushpotPrivateState, Uint8Array] => [
    privateState,
    privateState.sk,
  ],
  localPledgeAmount: ({
    privateState,
  }: WitnessContext<Ledger, HushpotPrivateState>): [HushpotPrivateState, bigint] => [
    privateState,
    privateState.amount,
  ],
};

export { Contract };
export type { Ledger };

/** Compiled HushPot contract with witnesses attached (browser flavor). */
export const CompiledHushpotContract = CompiledContract.make<Contract<HushpotPrivateState>>(
  'Hushpot',
  Contract<HushpotPrivateState>,
).pipe(CompiledContract.withWitnesses(hushpotWitnesses));
