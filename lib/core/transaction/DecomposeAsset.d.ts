import { Asset, AssetTransferInput, AssetTransferOutput, H256 } from "../classes";
import { AssetTransaction, Transaction } from "../Transaction";
import { AssetTransferOutputValue, NetworkId } from "../types";
export declare class DecomposeAsset extends Transaction implements AssetTransaction {
    private readonly _transaction;
    private readonly approvals;
    constructor(input: {
        input: AssetTransferInput;
        outputs: AssetTransferOutput[];
        networkId: NetworkId;
        approvals: string[];
    });
    /**
     * Get the tracker of an AssetDecomposeTransaction.
     * @returns A transaction tracker.
     */
    tracker(): H256;
    /**
     * Get a hash of the transaction that doesn't contain the scripts. The hash
     * is used as a message to create a signature for a transaction.
     * @returns A hash.
     */
    hashWithoutScript(): H256;
    input(_index: number): AssetTransferInput | null;
    /**
     * Add AssetTransferOutputs to create.
     * @param outputs An array of either an AssetTransferOutput or an object
     * containing quantity, asset type, and recipient.
     */
    addOutputs(outputs: AssetTransferOutputValue | Array<AssetTransferOutputValue>, ...rest: Array<AssetTransferOutputValue>): void;
    /**
     * Get the output of the given index, of this transaction.
     * @param index An index indicating an output.
     * @returns An Asset.
     */
    getTransferredAsset(index: number): Asset;
    /**
     * Get the outputs of this transaction.
     * @returns An array of an Asset.
     */
    getTransferredAssets(): Asset[];
    /**
     * Get the asset address of an output.
     * @param index An index indicating the output.
     * @returns An asset address which is H256.
     */
    getAssetAddress(index: number): H256;
    type(): string;
    protected actionToEncodeObject(): any[];
    protected actionToJSON(): any;
}
