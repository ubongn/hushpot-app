# Security Policy

## Threat model

HushPot's security boundary is the disclosure boundary of its Compact circuits.

| Asset | Where it lives | Exposure |
|---|---|---|
| Member secret key (`localSk`) | Member's browser session (in-memory) | Never persisted, never transmitted, never on-chain |
| Pledge amount (`localPledgeAmount`) | Member's browser session | Crosses the chain **only** as a salted commitment |
| Membership identity | On-chain as a commitment anchor | Addresses are never stored by the contract |
| Deployer seed | `deploy/.env.preprod` (gitignored) | Local file only; never committed — verified by CI green history |

## What the ZK circuits guarantee

- `provePledgeAtLeast` is a **pure predicate**: it mutates no ledger state. A successful proof attests "committed pledge ≥ threshold" and discloses nothing else — not the amount, not the threshold.
- `claim` settlement is **nullifier-guarded** — double claims are impossible.
- `closeEntries` is **host-gated** — the one public rule check, by design.
- Compiled artifacts (`managed/`) are version-pinned: compactc 0.31.1 ↔ compact-runtime 0.16.0 ↔ midnight-js 4.1.1 ↔ ledger/proof-server 8.1.0. A mismatched toolchain is a build failure, not a runtime surprise.

## In-browser proving

ZK proofs run client-side via the zkir-v2 WASM prover. No proving request, witness, or secret ever leaves the member's browser. BLS parameters are served from our own origin (no third-party fetch at proof time).

## Known limitations (testnet scope)

- Preprod only; contract and dApp are unaudited. Do not move real value.
- Wallet UX depends on Lace/1AM extension behavior (MV3 service-worker suspension is mitigated with keep-alive pings + retry).
- The privacy surface is regression-tested (`test/privacy-surface.test.ts`) but is not a formal audit.

## Reporting

Open a GitHub issue with reproduction steps. Do not open issues containing seeds or private keys.
