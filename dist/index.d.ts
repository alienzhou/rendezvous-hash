export declare type IHashFunction = (input: Uint8Array) => Uint8Array;
export declare class Destination {
    readonly id: Uint8Array;
    readonly weight: number;
    /**
     * @param id 8-byte (64-bit) id
     * @param weight Relative weight
     */
    constructor(id: Uint8Array, weight?: number);
}
/**
 * @param hashFunction Accepts 8-byte (64-bit) Uint8Array  and returns 8-byte (64-bit) Uint8Array
 * @param key 8-byte (64-bit) key
 * @param destinations
 * @param k Number of destinations to return
 */
export declare function pickDestinations(hashFunction: IHashFunction, key: Uint8Array, destinations: Destination[], k?: number): Uint8Array[];
