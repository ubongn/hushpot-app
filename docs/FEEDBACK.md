# HushPot — User Feedback Log

This document tracks user feedback collected via the [Google Form](https://forms.gle/uyisPb6ucVZiwdeW7) and the changes made in response.

**Feedback Sheet:** [Google Sheet (public)](https://docs.google.com/spreadsheets/d/1SiTdk2xr20rUbVqMZus1Bz4uZzLTgTtKvuOBbyaL96g/edit?usp=sharing)

---

## What We Heard

*Feedback themes collected from Preprod testers. Updated as responses come in.*

| Theme | Count | Source |
|---|---|---|
| Privacy works as designed (pledge hidden on-chain) | 1 | Blingz Kim |
| Wallet connect + prove flow smooth, no major bugs | 1 | Blingz Kim |
| Want pledge history / transaction dashboard | 1 | Blingz Kim |
| Want clearer status indicators during prove step | 1 | Blingz Kim |

### Raw Feedback — User #1

- **Name:** Blingz Kim
- **Date:** 2026-09-29
- **Rating:** 4/5
- **Best feature:** "The privacy — my pledge amount stays hidden on-chain, which is the whole point of HushPot."
- **Bugs:** "No major bugs. The wallet connect and prove flow worked smoothly on Preprod."
- **Would recommend:** Yes
- **Improvement:** "Add a pledge history dashboard and clearer status indicators during the prove step."
- **Missing feature:** "A transaction/pledge history view so testers can see past pledges and their status."

---

## What We Changed

*Improvements made based on user feedback. Each entry links to the relevant commit.*

| Feedback | Improvement | Commit | Date |
|---|---|---|---|
| Pledge history dashboard (Blingz Kim) | *(Planned)* | — | — |
| Clearer status indicators during prove (Blingz Kim) | *(Planned)* | — | — |

---

## How Feedback Is Collected

1. **Google Form** — testers submit wallet address, name, email, product rating, and open-ended feedback
2. **Google Sheet** — all responses exported and linked publicly in README
3. **This document** — summarizes themes and maps each to a code change with commit ID
4. **README tables** — Users Onboarded + Feedback Implementation tables mirror this data

## Feedback Cycle

1. Tester uses HushPot on Preprod (connect wallet → join pot → pledge → prove)
2. Tester fills Google Form with feedback
3. Team reviews feedback weekly
4. Prioritized changes are implemented and committed
5. FEEDBACK.md and README tables are updated with the change + commit link