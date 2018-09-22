# Rendezvous hash implementation
Read https://en.wikipedia.org/wiki/Rendezvous_hashing for details, this package works with 64-bit/8-byte inputs in form of `Uint8Array`s.

## How to install
```
npm install @subspace/rendezvous-hash
```

## How to use
TypeScript:
```typescript
import {randomBytes} from 'crypto';
import {Destination, pickDestinations} from '@subspace/rendezvous-hash';

const destinations: Destination[] = [
    new Destination(randomBytes(8)),
    new Destination(randomBytes(8)),
];
const keys: Uint8Array[] = [
    randomBytes(8),
    randomBytes(8),
    randomBytes(8),
    randomBytes(8),
    randomBytes(8),
];

for (const key of keys) {
    const destination = pickDestinations(key, destinations)[0];
    console.log(destination.id)
}

```

## API
### rendezvousHash.pickDestinations(keyHash: Uint8Array, destinations: Destination[], k: number = 1): Uint8Array[]
Takes a key and an array of potential destinations and returns `k` closest destinations to that key.

* `keyHash` - 8 bytes hash of the key
* `destinations` - an array of destination objects that are potential candidates
* `k` - how many closest destinations for specified key to return

Returns an array of IDs of keys (first argument to `Destination` object below).

### rendezvousHash.Destination(readonly id: Uint8Array, readonly weight: number = 1)
Class that encapsulates information about particular destination.

`id` and `weight` are pubic readonly properties of resulting object
