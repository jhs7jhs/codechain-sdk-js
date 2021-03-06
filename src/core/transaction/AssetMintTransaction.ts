import { Buffer } from "buffer";
import { PlatformAddress } from "codechain-primitives";

import { blake256, blake256WithKey } from "../../utils";
import { Asset } from "../Asset";
import { AssetScheme } from "../AssetScheme";
import { H256 } from "../H256";
import { NetworkId } from "../types";
import { AssetMintOutput, AssetMintOutputJSON } from "./AssetMintOutput";

const RLP = require("rlp");

export interface AssetMintTransactionJSON {
    type: "assetMint";
    data: {
        networkId: NetworkId;
        shardId: number;
        metadata: string;
        output: AssetMintOutputJSON;
        approver: string | null;
        administrator: string | null;
    };
}

/**
 * Creates a new asset type and that asset itself.
 *
 * The owner of the new asset created can be assigned by a lock script hash and parameters.
 *  - A metadata is a string that explains the asset's type.
 *  - Amount defines the quantity of asset to be created. If set as null, it
 *  will be set as the maximum value of a 64-bit unsigned integer by default.
 *  - If approver exists, the approver must be the Signer of the Parcel when
 *  sending the created asset through AssetTransferTransaction.
 *  - If administrator exists, the administrator can transfer without unlocking.
 */
export class AssetMintTransaction {
    /**
     * Create an AssetMintTransaction from an AssetMintTransaction JSON object.
     * @param data An AssetMintTransaction JSON object.
     * @returns An AssetMintTransaction.
     */
    public static fromJSON(data: AssetMintTransactionJSON) {
        const {
            data: {
                networkId,
                shardId,
                metadata,
                output,
                approver,
                administrator
            }
        } = data;
        return new this({
            networkId,
            shardId,
            metadata,
            output: AssetMintOutput.fromJSON(output),
            approver:
                approver === null ? null : PlatformAddress.fromString(approver),
            administrator:
                administrator === null
                    ? null
                    : PlatformAddress.fromString(administrator)
        });
    }
    public readonly networkId: NetworkId;
    public readonly shardId: number;
    public readonly metadata: string;
    public readonly output: AssetMintOutput;
    public readonly approver: PlatformAddress | null;
    public readonly administrator: PlatformAddress | null;
    public readonly type = "assetMint";

    /**
     * @param data.networkId A network ID of the transaction.
     * @param data.shardId A shard ID of the transaction.
     * @param data.metadata A metadata of the asset.
     * @param data.output.lockScriptHash A lock script hash of the output.
     * @param data.output.parameters Parameters of the output.
     * @param data.output.amount Asset amount of the output.
     * @param data.approver A approver of the asset.
     * @param data.administrator A administrator of the asset.
     */
    constructor(data: {
        networkId: NetworkId;
        shardId: number;
        metadata: string;
        output: AssetMintOutput;
        approver: PlatformAddress | null;
        administrator: PlatformAddress | null;
    }) {
        const {
            networkId,
            shardId,
            metadata,
            output,
            approver,
            administrator
        } = data;
        this.networkId = networkId;
        this.shardId = shardId;
        this.metadata = metadata;
        this.output = output;
        this.approver = approver;
        this.administrator = administrator;
    }

    /**
     * Convert to an AssetMintTransaction JSON object.
     * @returns An AssetMintTransaction JSON object.
     */
    public toJSON(): AssetMintTransactionJSON {
        const {
            networkId,
            shardId,
            metadata,
            output,
            approver,
            administrator
        } = this;
        return {
            type: this.type,
            data: {
                networkId,
                shardId,
                metadata,
                output: output.toJSON(),
                approver: approver === null ? null : approver.toString(),
                administrator:
                    administrator === null ? null : administrator.toString()
            }
        };
    }

    /**
     * Convert to an object for RLP encoding.
     */
    public toEncodeObject() {
        const {
            networkId,
            shardId,
            metadata,
            output: { lockScriptHash, parameters, amount },
            approver,
            administrator
        } = this;
        return [
            3,
            networkId,
            shardId,
            metadata,
            lockScriptHash.toEncodeObject(),
            parameters.map(parameter => Buffer.from(parameter)),
            amount != null ? [amount.toEncodeObject()] : [],
            approver ? [approver.getAccountId().toEncodeObject()] : [],
            administrator ? [administrator.getAccountId().toEncodeObject()] : []
        ];
    }

    /**
     * Convert to RLP bytes.
     */
    public rlpBytes(): Buffer {
        return RLP.encode(this.toEncodeObject());
    }

    /**
     * Get the hash of an AssetMintTransaction.
     * @returns A transaction hash.
     */
    public hash(): H256 {
        return new H256(blake256(this.rlpBytes()));
    }

    /**
     * Get the output of this transaction.
     * @returns An Asset.
     */
    public getMintedAsset(): Asset {
        const { lockScriptHash, parameters, amount } = this.output;
        if (amount == null) {
            throw Error("not implemented");
        }
        return new Asset({
            assetType: this.getAssetSchemeAddress(),
            lockScriptHash,
            parameters,
            amount,
            transactionHash: this.hash(),
            transactionOutputIndex: 0
        });
    }

    /**
     * Get the asset scheme of this transaction.
     * @return An AssetScheme.
     */
    public getAssetScheme(): AssetScheme {
        const {
            networkId,
            shardId,
            metadata,
            output: { amount },
            approver,
            administrator
        } = this;
        if (amount == null) {
            throw Error("not implemented");
        }
        return new AssetScheme({
            networkId,
            shardId,
            metadata,
            amount,
            approver,
            administrator,
            pool: []
        });
    }

    /**
     * Get the address of the asset scheme. An asset scheme address equals to an
     * asset type value.
     * @returns An asset scheme address which is H256.
     */
    public getAssetSchemeAddress(): H256 {
        const { shardId } = this;
        const blake = blake256WithKey(
            this.hash().value,
            new Uint8Array([
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0xff,
                0xff,
                0xff,
                0xff,
                0xff,
                0xff,
                0xff,
                0xff
            ])
        );
        const shardPrefix = convertU16toHex(shardId);
        const prefix = `5300${shardPrefix}`;
        return new H256(
            blake.replace(new RegExp(`^.{${prefix.length}}`), prefix)
        );
    }

    /**
     * Get the asset address of the output.
     * @returns An asset address which is H256.
     */
    public getAssetAddress(): H256 {
        const { shardId } = this;
        const blake = blake256WithKey(
            this.hash().value,
            new Uint8Array([
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00
            ])
        );
        const shardPrefix = convertU16toHex(shardId);
        const prefix = `4100${shardPrefix}`;
        return new H256(
            blake.replace(new RegExp(`^.{${prefix.length}}`), prefix)
        );
    }
}

function convertU16toHex(id: number) {
    const hi: string = ("0" + ((id >> 8) & 0xff).toString(16)).slice(-2);
    const lo: string = ("0" + (id & 0xff).toString(16)).slice(-2);
    return hi + lo;
}
