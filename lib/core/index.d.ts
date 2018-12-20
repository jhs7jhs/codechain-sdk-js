/// <reference types="node" />
import { AssetTransferAddress, PlatformAddress } from "codechain-primitives";
import { AssetTransaction } from "./action/AssetTransaction";
import { CreateShard } from "./action/CreateShard";
import { Payment } from "./action/Payment";
import { Remove } from "./action/Remove";
import { SetRegularKey } from "./action/SetRegularKey";
import { SetShardOwners } from "./action/SetShardOwners";
import { SetShardUsers } from "./action/SetShardUsers";
import { Store } from "./action/Store";
import { WrapCCC } from "./action/WrapCCC";
import { Asset } from "./Asset";
import { AssetScheme } from "./AssetScheme";
import { Block } from "./Block";
import { H128 } from "./H128";
import { H160 } from "./H160";
import { H256 } from "./H256";
import { H512 } from "./H512";
import { Invoice } from "./Invoice";
import { Parcel } from "./Parcel";
import { Script } from "./Script";
import { SignedParcel } from "./SignedParcel";
import { AssetComposeTransaction } from "./transaction/AssetComposeTransaction";
import { AssetDecomposeTransaction } from "./transaction/AssetDecomposeTransaction";
import { AssetMintTransaction } from "./transaction/AssetMintTransaction";
import { AssetOutPoint } from "./transaction/AssetOutPoint";
import { AssetSchemeChangeTransaction } from "./transaction/AssetSchemeChangeTransaction";
import { AssetTransferInput, Timelock } from "./transaction/AssetTransferInput";
import { AssetTransferOutput } from "./transaction/AssetTransferOutput";
import { AssetTransferTransaction } from "./transaction/AssetTransferTransaction";
import { AssetUnwrapCCCTransaction } from "./transaction/AssetUnwrapCCCTransaction";
import { Order } from "./transaction/Order";
import { OrderOnTransfer } from "./transaction/OrderOnTransfer";
import { Transaction } from "./transaction/Transaction";
import { NetworkId } from "./types";
import { U256 } from "./U256";
import { U64 } from "./U64";
export declare class Core {
    static classes: {
        H128: typeof H128;
        H160: typeof H160;
        H256: typeof H256;
        H512: typeof H512;
        U256: typeof U256;
        U64: typeof U64;
        Invoice: typeof Invoice;
        Block: typeof Block;
        Parcel: typeof Parcel;
        SignedParcel: typeof SignedParcel;
        Payment: typeof Payment;
        SetRegularKey: typeof SetRegularKey;
        AssetTransaction: typeof AssetTransaction;
        CreateShard: typeof CreateShard;
        SetShardOwners: typeof SetShardOwners;
        SetShardUsers: typeof SetShardUsers;
        WrapCCC: typeof WrapCCC;
        Store: typeof Store;
        Remove: typeof Remove;
        AssetMintTransaction: typeof AssetMintTransaction;
        AssetSchemeChangeTransaction: typeof AssetSchemeChangeTransaction;
        AssetTransferTransaction: typeof AssetTransferTransaction;
        AssetComposeTransaction: typeof AssetComposeTransaction;
        AssetDecomposeTransaction: typeof AssetDecomposeTransaction;
        AssetUnwrapCCCTransaction: typeof AssetUnwrapCCCTransaction;
        AssetTransferInput: typeof AssetTransferInput;
        AssetTransferOutput: typeof AssetTransferOutput;
        AssetOutPoint: typeof AssetOutPoint;
        Asset: typeof Asset;
        AssetScheme: typeof AssetScheme;
        Script: typeof Script;
        PlatformAddress: typeof PlatformAddress;
        AssetTransferAddress: typeof AssetTransferAddress;
    };
    classes: {
        H128: typeof H128;
        H160: typeof H160;
        H256: typeof H256;
        H512: typeof H512;
        U256: typeof U256;
        U64: typeof U64;
        Invoice: typeof Invoice;
        Block: typeof Block;
        Parcel: typeof Parcel;
        SignedParcel: typeof SignedParcel;
        Payment: typeof Payment;
        SetRegularKey: typeof SetRegularKey;
        AssetTransaction: typeof AssetTransaction;
        CreateShard: typeof CreateShard;
        SetShardOwners: typeof SetShardOwners;
        SetShardUsers: typeof SetShardUsers;
        WrapCCC: typeof WrapCCC;
        Store: typeof Store;
        Remove: typeof Remove;
        AssetMintTransaction: typeof AssetMintTransaction;
        AssetSchemeChangeTransaction: typeof AssetSchemeChangeTransaction;
        AssetTransferTransaction: typeof AssetTransferTransaction;
        AssetComposeTransaction: typeof AssetComposeTransaction;
        AssetDecomposeTransaction: typeof AssetDecomposeTransaction;
        AssetUnwrapCCCTransaction: typeof AssetUnwrapCCCTransaction;
        AssetTransferInput: typeof AssetTransferInput;
        AssetTransferOutput: typeof AssetTransferOutput;
        AssetOutPoint: typeof AssetOutPoint;
        Asset: typeof Asset;
        AssetScheme: typeof AssetScheme;
        Script: typeof Script;
        PlatformAddress: typeof PlatformAddress;
        AssetTransferAddress: typeof AssetTransferAddress;
    };
    private networkId;
    /**
     * @param params.networkId The network id of CodeChain.
     */
    constructor(params: {
        networkId: NetworkId;
    });
    /**
     * Creates Payment action which pays the value amount of CCC(CodeChain Coin)
     * from the parcel signer to the recipient. Who is signing the parcel will pay.
     * @param params.recipient The platform account who receives CCC
     * @param params.amount Amount of CCC to pay
     * @throws Given string for recipient is invalid for converting it to PlatformAddress
     * @throws Given number or string for amount is invalid for converting it to U64
     */
    createPaymentParcel(params: {
        recipient: PlatformAddress | string;
        amount: U64 | number | string;
    }): Parcel;
    /**
     * Creates SetRegularKey action which sets the regular key of the parcel signer.
     * @param params.key The public key of a regular key
     * @throws Given string for key is invalid for converting it to H512
     */
    createSetRegularKeyParcel(params: {
        key: H512 | string;
    }): Parcel;
    /**
     * Creates AssetTransaction action which can mint or transfer assets through
     * AssetMintTransaction or AssetTransferTransaction.
     * @param params.transaction Transaction
     */
    createAssetTransactionParcel(params: {
        transaction: Transaction;
        approvals?: string[];
    }): Parcel;
    /**
     * Creates CreateShard action which can create new shard
     */
    createCreateShardParcel(): Parcel;
    createSetShardOwnersParcel(params: {
        shardId: number;
        owners: Array<PlatformAddress | string>;
    }): Parcel;
    /**
     * Create SetShardUser action which can change shard users
     * @param params.shardId
     * @param params.users
     */
    createSetShardUsersParcel(params: {
        shardId: number;
        users: Array<PlatformAddress | string>;
    }): Parcel;
    /**
     * Creates Wrap CCC action which wraps the value amount of CCC(CodeChain Coin)
     * in a wrapped CCC asset. Who is signing the parcel will pay.
     * @param params.shardId A shard ID of the wrapped CCC asset.
     * @param params.lockScriptHash A lock script hash of the wrapped CCC asset.
     * @param params.parameters Parameters of the wrapped CCC asset.
     * @param params.amount Amount of CCC to pay
     * @throws Given string for a lock script hash is invalid for converting it to H160
     * @throws Given number or string for amount is invalid for converting it to U64
     */
    createWrapCCCParcel(params: {
        shardId: number;
        lockScriptHash: H160 | string;
        parameters: Buffer[];
        amount: U64 | number | string;
    } | {
        shardId: number;
        recipient: AssetTransferAddress | string;
        amount: U64 | number | string;
    }): Parcel;
    /**
     * Creates Store action which store content with certifier on chain.
     * @param params.content Content to store
     * @param params.secret Secret key to sign
     * @param params.certifier Certifier of the text, which is PlatformAddress
     * @param params.signature Signature on the content by the certifier
     * @throws Given string for secret is invalid for converting it to H256
     */
    createStoreParcel(params: {
        content: string;
        certifier: PlatformAddress | string;
        signature: string;
    } | {
        content: string;
        secret: H256 | string;
    }): Parcel;
    /**
     * Creates Remove action which remove the text from the chain.
     * @param params.hash Parcel hash which stored the text
     * @param params.secret Secret key to sign
     * @param params.signature Signature on parcel hash by the certifier of the text
     * @throws Given string for hash or secret is invalid for converting it to H256
     */
    createRemoveParcel(params: {
        hash: H256 | string;
        secret: H256 | string;
    } | {
        hash: H256 | string;
        signature: string;
    }): Parcel;
    /**
     * Creates asset's scheme.
     * @param params.metadata Any string that describing the asset. For example,
     * stringified JSON containing properties.
     * @param params.amount Total amount of this asset
     * @param params.approver Platform account or null. If account is present, the
     * parcel that includes AssetTransferTransaction of this asset must be signed by
     * the approver account.
     * @param params.administrator Platform account or null. The administrator
     * can transfer the asset without unlocking.
     * @throws Given string for approver is invalid for converting it to paltform account
     * @throws Given string for administrator is invalid for converting it to paltform account
     */
    createAssetScheme(params: {
        shardId: number;
        metadata: string;
        amount: U64 | number | string;
        approver?: PlatformAddress | string;
        administrator?: PlatformAddress | string;
        pool?: {
            assetType: H256 | string;
            amount: number;
        }[];
    }): AssetScheme;
    createOrder(params: {
        assetTypeFrom: H256 | string;
        assetTypeTo: H256 | string;
        assetTypeFee?: H256 | string;
        assetAmountFrom: U64 | number | string;
        assetAmountTo: U64 | number | string;
        assetAmountFee?: U64 | number | string;
        originOutputs: AssetOutPoint[] | {
            transactionHash: H256 | string;
            index: number;
            assetType: H256 | string;
            amount: U64 | number | string;
            lockScriptHash?: H256 | string;
            parameters?: Buffer[];
        }[];
        expiration: U64 | number | string;
    } & ({
        lockScriptHashFrom: H160 | string;
        parametersFrom: Buffer[];
    } | {
        recipientFrom: AssetTransferAddress | string;
    }) & ({
        lockScriptHashFee: H160 | string;
        parametersFee: Buffer[];
    } | {
        recipientFee: AssetTransferAddress | string;
    } | {})): Order;
    createOrderOnTransfer(params: {
        order: Order;
        spentAmount: U64 | string | number;
        inputIndices: number[];
        outputIndices: number[];
    }): OrderOnTransfer;
    createAssetMintTransaction(params: {
        scheme: AssetScheme | {
            networkId?: NetworkId;
            shardId: number;
            metadata: string;
            approver?: PlatformAddress | string;
            administrator?: PlatformAddress | string;
            amount?: U64 | number | string | null;
        };
        recipient: AssetTransferAddress | string;
    }): AssetMintTransaction;
    createAssetSchemeChangeTransaction(params: {
        assetType: H256 | string;
        scheme: AssetScheme | {
            networkId?: NetworkId;
            metadata: string;
            approver?: PlatformAddress | string;
            administrator?: PlatformAddress | string;
        };
    }): AssetSchemeChangeTransaction;
    createAssetTransferTransaction(params?: {
        burns?: AssetTransferInput[];
        inputs?: AssetTransferInput[];
        outputs?: AssetTransferOutput[];
        orders?: OrderOnTransfer[];
        networkId?: NetworkId;
    }): AssetTransferTransaction;
    createAssetComposeTransaction(params: {
        scheme: AssetScheme | {
            shardId: number;
            metadata: string;
            amount?: U64 | number | string | null;
            approver?: PlatformAddress | string;
            administrator?: PlatformAddress | string;
            networkId?: NetworkId;
        };
        inputs: AssetTransferInput[];
        recipient: AssetTransferAddress | string;
    }): AssetComposeTransaction;
    createAssetDecomposeTransaction(params: {
        input: AssetTransferInput;
        outputs?: AssetTransferOutput[];
        networkId?: NetworkId;
    }): AssetDecomposeTransaction;
    createAssetUnwrapCCCTransaction(params: {
        burn: AssetTransferInput | Asset;
        networkId?: NetworkId;
    }): AssetUnwrapCCCTransaction;
    createAssetTransferInput(params: {
        assetOutPoint: AssetOutPoint | {
            transactionHash: H256 | string;
            index: number;
            assetType: H256 | string;
            amount: U64 | number | string;
            lockScriptHash?: H256 | string;
            parameters?: Buffer[];
        };
        timelock?: null | Timelock;
        lockScript?: Buffer;
        unlockScript?: Buffer;
    }): AssetTransferInput;
    createAssetOutPoint(params: {
        transactionHash: H256 | string;
        index: number;
        assetType: H256 | string;
        amount: U64 | number | string;
    }): AssetOutPoint;
    createAssetTransferOutput(params: {
        assetType: H256 | string;
        amount: U64 | number | string;
    } & ({
        recipient: AssetTransferAddress | string;
    } | {
        lockScriptHash: H256 | string;
        parameters: Buffer[];
    })): AssetTransferOutput;
    getTransactionFromJSON(json: any): Transaction;
}
