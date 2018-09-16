export class Destination {
    /**
     * @param id 8-byte (64-bit) id
     * @param weight Relative weight
     */
    constructor(readonly id: Uint8Array, readonly weight: number = 1) {
    }
}

function xorUint8Array(a: Uint8Array, b: Uint8Array): Uint8Array {
    return a.map((byte, index) => {
        return byte ^ b[index];
    });
}

function rightShiftUint8Array(a: Uint8Array, bits: number): Uint8Array {
    const length = a.length;
    const result = new Uint8Array(length);
    result.set(a.subarray(0, length - bits));
    return result;
}

/**
 * Multiply 2 64-bit unsigned integers
 *
 * @param a 64-bit unsigned integer
 * @param b 64-bit unsigned integer
 */
function multiply64BitUint8Array(a: Uint8Array, b: Uint8Array): Uint8Array {
    const length = a.length;
    const result = new Uint8Array(length);
    let acc = 0;
    let tmpResult;
    for (let i = 0; i < length; ++i) {
        tmpResult = a[i] * b[i] + acc;
        result.set([tmpResult % 256], i);
        // `| 1` is for quick rounding
        acc = tmpResult / 256 | 1;
    }
    return result;
}

/**
 * MurmurHash3 64-bit finalizer
 *
 * @param a 64-bit unsigned integer
 * @param b 64-bit unsigned integer
 */
function mergeHashes(a: Uint8Array, b: Uint8Array): Uint8Array {
    // acc = a ^ b
    let acc = xorUint8Array(a, b);
    // acc ^= acc >> 33
    acc = xorUint8Array(acc, rightShiftUint8Array(acc, 33));
    // acc = (acc * 0xff51afd7ed558ccd) % 2 ** 64;
    acc = multiply64BitUint8Array(acc, Uint8Array.of(0xff, 0x51, 0xaf, 0xd7, 0xed, 0x55, 0x8c, 0xcd));
    // acc ^= acc >> 33
    acc = xorUint8Array(acc, rightShiftUint8Array(acc, 33));
    // acc = (acc * 0xc4ceb9fe1a85ec53) % 2 ** 64;
    acc = multiply64BitUint8Array(acc, Uint8Array.of(0xc4, 0xce, 0xb9, 0xfe, 0x1a, 0x85, 0xec, 0x53));
    // acc ^= acc >> 33
    acc = xorUint8Array(acc, rightShiftUint8Array(acc, 33));
    return acc;
}

/**
 * @todo Proper division should be added here with result being Uint8Array, otherwise JavaScript will lose precision
 *
 * @param hashValue 64-bit unsigned integer
 * @param weight Relative weight
 */
function score(hashValue: Uint8Array, weight: number): number {
    const hashValue32 = new Uint32Array(hashValue.buffer, hashValue.byteOffset, hashValue.byteLength / Uint32Array.BYTES_PER_ELEMENT);
    const value = hashValue32[0] + hashValue32[1] * 0xFFFFFFFF;
    return -weight / Math.log(value / 0xFFFFFFFFFFFFFFFF);
}

/**
 * @param keyHash 8-byte (64-bit) key hash
 * @param destinations
 * @param k Integer number of destinations to return
 */
export function pickDestinations(keyHash: Uint8Array, destinations: Destination[], k: number = 1): Uint8Array[] {
    const result: Array<{id: Uint8Array, score: number}> = [];
    for (const destination of destinations) {
        result.push({
            id: destination.id,
            score: score(mergeHashes(keyHash, destination.id), destination.weight),
        });
    }
    return result
        .sort((a, b) => {
            return b.score - a.score;
        })
        .slice(0, k)
        .map((destination) => destination.id);
}
