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
 * @param keyHash 8-byte (64-bit) key hash
 * @param destinations
 * @param k Integer number of destinations to return
 */
export declare function pickDestinations(keyHash: Uint8Array, destinations: Destination[], k?: number): Uint8Array[];
