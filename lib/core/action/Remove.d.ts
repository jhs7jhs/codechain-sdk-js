import { H256 } from "../H256";
export declare class Remove {
    hash: H256;
    signature: string;
    constructor(params: {
        hash: H256;
        signature: string;
    } | {
        hash: H256;
        secret: H256;
    });
    toEncodeObject(): any[];
    toJSON(): {
        action: string;
        hash: string;
        signature: string;
    };
}
