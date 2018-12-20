/// <reference types="node" />
import { AssetTransferAddress, H160 } from "codechain-primitives/lib";
import { U64 } from "../U64";
export interface AssetMintOutputJSON {
    lockScriptHash: string;
    parameters: number[][];
    amount?: string | null;
}
export declare class AssetMintOutput {
    /**
     * Create an AssetMintOutput from an AssetMintOutput JSON object.
     * @param data An AssetMintOutput JSON object.
     * @returns An AssetMintOutput.
     */
    static fromJSON(data: AssetMintOutputJSON): AssetMintOutput;
    readonly lockScriptHash: H160;
    readonly parameters: Buffer[];
    readonly amount?: U64 | null;
    /**
     * @param data.lockScriptHash A lock script hash of the output.
     * @param data.parameters Parameters of the output.
     * @param data.amount Asset amount of the output.
     */
    constructor(data: {
        lockScriptHash: H160;
        parameters: Buffer[];
        amount?: U64 | null;
    } | {
        recipient: AssetTransferAddress;
        amount?: U64 | null;
    });
    /**
     * Convert to an AssetMintOutput JSON object.
     * @returns An AssetMintOutput JSON object.
     */
    toJSON(): AssetMintOutputJSON;
}
