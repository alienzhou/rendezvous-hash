import {createHash} from 'crypto';
import * as test from 'tape';
import {Destination, pickDestinations} from '../src';

function sha256_64(input: Uint8Array): Uint8Array {
    return createHash('sha256')
        .update(input)
        .digest()
        .slice(0, 8);
}

test('Basic test', (t) => {
    const seed: Uint8Array = Buffer.from('05f92188ba7b0b52', 'hex');
    const destinations: Destination[] = [];
    let lastHash = seed;
    for (let i = 0; i < 1000; ++i) {
        lastHash = sha256_64(lastHash);
        destinations.push(new Destination(lastHash));
    }
    const keys: Uint8Array[] = [];
    for (let i = 0; i < 10000; ++i) {
        lastHash = sha256_64(lastHash);
        keys.push(lastHash);
    }

    function run(destinationsCount: number, keysCount: number): void {
        const results = new Map();
        const localDestinations = destinations.slice(0, destinationsCount);
        const localKeys = keys.slice(0, keysCount);
        for (const key of localKeys) {
            const destination = pickDestinations(sha256_64, key, localDestinations)[0];
            let occurrences = results.get(destination) || 0;
            ++occurrences;
            results.set(destination, occurrences);
        }

        let min = keys.length;
        let max = 0;
        results.forEach((value) => {
            if (value > max) {
                max = value;
            }
            if (value < min) {
                min = value;
            }
        });

        t.assert(max > min, `${max} > ${min}`);
        t.assert(min > 0, `No empty destination`);
        t.assert(max < keysCount, `Keys are not all in one destination`);
    }

    run(10, 100);
    run(10, 1000);
    run(10, 10000);
    run(100, 100);
    run(100, 1000);
    run(100, 10000);
    run(1000, 1000);
    run(1000, 10000);

    t.end();
});
