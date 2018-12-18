import { PlatformAddress } from "codechain-primitives";
export interface TextJSON {
    content: string;
    certifier: string;
}
/**
 * Object created as an AssetMintTransaction or AssetTransferTransaction.
 */
export declare class Text {
    static fromJSON(data: TextJSON): Text;
    readonly content: string;
    readonly certifier: PlatformAddress;
    constructor(data: {
        content: string;
        certifier: PlatformAddress;
    });
    toJSON(): TextJSON;
}
