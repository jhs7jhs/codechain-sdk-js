import { PlatformAddress } from "codechain-primitives";
import { U64 } from "../U64";
export declare class Payment {
    receiver: PlatformAddress;
    amount: U64;
    constructor(receiver: PlatformAddress, amount: U64);
    toEncodeObject(): any[];
    toJSON(): {
        action: string;
        receiver: string;
        amount: string | number;
    };
}
