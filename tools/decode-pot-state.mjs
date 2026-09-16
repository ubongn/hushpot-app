// Decode the live HushPot contract state from the Preprod indexer.
import { ContractState } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { ledger } from '../managed/hushpot/contract/index.js';

const ADDR = 'b14415c2f686ea1ab2dee103876cc3c2012830bc6a5e56a48d87f013c6f4abb4';
const GQL = 'https://indexer.preprod.midnight.network/api/v4/graphql';

const fromHex = (hex) => {
  if (hex.startsWith('0x')) hex = hex.slice(2);
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
};

const res = await fetch(GQL, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    query: 'query($addr: HexEncoded!) { contractAction(address: $addr) { state } }',
    variables: { addr: ADDR },
  }),
});
const json = await res.json();
const hex = json.data?.contractAction?.state;
if (!hex) throw new Error('no state: ' + JSON.stringify(json.errors ?? json));

const cs = ContractState.deserialize(fromHex(hex));
const L = ledger(cs.data);
console.log('state       :', L.state);
console.log('capacity    :', L.capacity.toString());
console.log('memberCount :', L.memberCount.toString());
console.log('pledgeCount :', L.pledgeCount.toString());
console.log('claimCount  :', L.claimCount.toString());
console.log('claimTotal  :', L.claimTotal.toString());
console.log('minPledge   :', L.minPledge.toString());
