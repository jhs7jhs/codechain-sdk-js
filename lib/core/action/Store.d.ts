import { PlatformAddress } from "codechain-primitives";
import { H256 } from "../H256";
import { Text } from "../Text";
import { NetworkId } from "../types";
export declare class Store {
    content: string;
    certifier: PlatformAddress;
    signature: string;
    constructor(params: {
        content: string;
        certifier: PlatformAddress;
        signature: string;
    } | {
        content: string;
        secret: H256;
        networkId: NetworkId;
    });
    toEncodeObject(): any[];
    toJSON(): {
        action: string;
        content: string;
        certifier: string;
        signature: string;
    };
    getText(): Text;
}
