# HushPot — User Guide

Everything you need to go from zero to proving a private pledge on Midnight Preprod.

## 1. Install a Midnight wallet

Two options, both work with HushPot:

- **1AM wallet** (recommended — faster Preprod sync, automatic DUST for fees):
  Chrome Web Store → search "1AM" → install.
- **Lace wallet**:
  Chrome Web Store → search "Lace" → install → set network to **Preprod** in wallet settings.

## 2. Get testnet funds

1. Copy your **unshielded address** from the wallet (starts with `mn_addr_preprod...` on Preprod).
2. Open the faucet: https://midnight-tmnight-preprod.nethermind.dev/
3. Paste your address → request funds. You receive **1000 tNIGHT** per request.
4. (1AM only: fees are auto-sponsored — no manual DUST step needed. Lace: use the faucet's "Generate tDUST" once.)

Tip: if the faucet hits an IP cooldown, switch to phone hotspot and retry.

## 3. Use the dApp

1. Open the **Live Demo** URL from the README (or `npm run dev` locally).
2. **Connect wallet** — the button detects Lace or 1AM. Approve the connection in the wallet popup.
3. Your address and NIGHT balance appear (6-decimal convention, like Cardano's lovelace).
4. **Read the pot** — the state panel shows capacity, seats taken, minimum pledge, and counters. This panel is exactly what a chain observer sees; no wallet needed.
5. **Join the pot** — enter a pledge amount (≥ the pot minimum) and click *Join pot*:
   - Your browser generates a 32-byte member secret (never persisted, never sent).
   - The amount crosses the chain only as a salted commitment.
   - The ZK proof runs **in your browser** (~60–90 s on typical laptops — the spinner is normal).
   - On success the field masks to `•••••• NIGHT` and only a tx id is shown.
6. **Pledge** — locks the amount into its on-chain commitment.
7. **Prove without revealing** — proves your pledge ≥ threshold (defaults to the pot minimum). The chain learns *that* you qualify, never *what* you have.

## 4. What the chain sees vs. what it never sees

| Observer sees | Observer never sees |
|---|---|
| Pot open/closed, capacity, min-pledge | Any member's pledge amount |
| A membership anchor joined | Member addresses or identities |
| A salted commitment was published | Wallet balances |
| A "pledge ≥ threshold" proof passed | The threshold inside the proof |

## 5. Troubleshooting

- **"Proving…" for >3 minutes** — refresh and retry; Chrome can suspend the wallet's service worker on low-RAM machines. HushPot pings it alive every 20 s and retries once automatically.
- **Wrong network** — set the wallet to Preprod and reconnect.
- **Join fails "pot is full"** — all seats are taken; wait for the next pot or deploy your own (`npm run hushpot:deploy`).
- **Faucet cooldown** — switch network (hotspot) or retry later.

## 6. Running your own pot (hosts)

```bash
npm run hushpot:deploy     # deploys a fresh pot (capacity + minPledge in deploy/src)
npm run hushpot:lifecycle  # drives a full story on-chain: joins, pledges, proofs, close, claims
```

Deploy needs Docker (proof server) and a funded seed — see README "Setup".
