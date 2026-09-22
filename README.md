# HushPot

[![CI](https://github.com/ubongn/hushpot-app/actions/workflows/ci.yml/badge.svg)](https://github.com/ubongn/hushpot-app/actions/workflows/ci.yml)

> Private group savings pots on Midnight — pledge amounts stay secret; the pot only proves you've met the minimum.

**X (product):** https://x.com/hushpotapp · **Builder:** https://x.com/ubong_dev

## What This Is

HushPot is a group savings pot in the esusu / ajo tradition, rebuilt so that money is nobody's business but your own:

- A **host** opens a pot with a fixed number of seats and a minimum pledge.
- **Members** join and pledge while entries are open. The pledge amount exists only in the member's wallet and crosses the chain solely as a salted commitment.
- Each member can **prove** "my pledge is at least the threshold" (`provePledgeAtLeast`) without ever revealing the number.
- At settlement, valid members **claim** from the pot — pot-level totals are public, individual amounts are not.

This is the **Private Payroll / Splits** pattern: distribute and pool funds without exposing amounts.

## Contract Address

| Network | Address | Deploy Tx | Block |
|---------|---------|-----------|-------|
| Preprod | `b6709e66086cfa77d4bd88b1b918d03e1c1dde2c4584cc4dda005389a95914a9` | `00f5ae4fcb7f063f9498d04a117a6f440849bbda94f63fa7c09ca6ddb875e001de` | 2,573,582 |

## Live Demo

> **URL:** https://hushpot-app.vercel.app — connect Lace or 1AM on Preprod, view live pot state, join a pot, pledge, and prove the pledge meets the minimum without revealing it.

Run locally:
```bash
npm install
npm run dev
```

## Privacy Model

- **PUBLIC (on-chain):** pot open/closed state, capacity, minPledge threshold, membership anchors (never addresses), proof validity, pot-level counters/totals at settlement.
- **PRIVATE (witness, never on-chain):** `localPledgeAmount` and `localSk` live only in the member's wallet; the chain sees salted commitments at most.
- **PROVES without revealing:** `provePledgeAtLeast` proves a committed pledge ≥ a threshold without disclosing the amount (or the threshold). The circuit writes nothing to the ledger; a successful proof *is* the statement.

## Privacy Claim

**An on-chain observer sees:** pot state, capacity, minimum-pledge parameter, that a commitment joined (an anchor — never an address), that a salted commitment was published, that a verified "pledge ≥ threshold" statement passed, pot-level counters.

**An on-chain observer cannot see:** pledge amounts, wallet balances, member identities/keys, or the threshold inside a proof.

## Tech Stack

- Midnight network (Preprod) · Compact `compactc` 0.31.1 · midnight-js 4.1.1
- Web: React 18 + Vite 5 + TypeScript; Lace/1AM via dapp-connector API
- ZK proving fully in-browser: zkir-v2 WASM prover, BLS params bundled locally (no CORS dependency)
- Node.js 22 · Vitest (51 tests) · GitHub Actions CI · Docker proof server (deploy path)

## Setup

```bash
# 1. Install
npm install

# 2. Compile the contract (contracts/hushpot.compact -> managed/hushpot)
npm run compile        # Windows: drives compactc through WSL automatically

# 3. Proof server (port 6300, required for testnet deploys)
docker run -d -p 6300:6300 midnightntwrk/proof-server:latest

# 4. Deployer seed (gitignored)
cd deploy && cp .env.preprod.example .env.preprod   # set MIDNIGHT_PREPROD_SEED

# 5. Deploy to Preprod
npm run hushpot:address   # print unshielded address -> fund via faucet
npm run hushpot:deploy    # supervised deploy (timeout guard + auto-retry)
```

See [docs/USAGE.md](docs/USAGE.md) for the full user guide (wallet, faucet, joining, proving).

## Tests & CI

```bash
npm test
```

51 tests: circuit semantics (19), compiled privacy surface (10), wallet-state persistence (22). CI runs install + build + tests on every push and PR.

## User Feedback

Live feedback from Preprod testers: [Google Sheet](https://docs.google.com/spreadsheets/d/1SiTdk2xr20rUbVqMZus1Bz4uZzLTgTtKvuOBbyaL96g/edit?usp=sharing)

Submit your wallet address and feedback: [Join Form](https://forms.gle/B3wnhV4PgnZD2W9S6)

## License

Apache-2.0
