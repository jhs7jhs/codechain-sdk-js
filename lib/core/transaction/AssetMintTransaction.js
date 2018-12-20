"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("buffer");
var codechain_primitives_1 = require("codechain-primitives");
var utils_1 = require("../../utils");
var Asset_1 = require("../Asset");
var AssetScheme_1 = require("../AssetScheme");
var H256_1 = require("../H256");
var AssetMintOutput_1 = require("./AssetMintOutput");
var RLP = require("rlp");
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
var AssetMintTransaction = /** @class */ (function () {
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
    function AssetMintTransaction(data) {
        this.type = "assetMint";
        var networkId = data.networkId, shardId = data.shardId, metadata = data.metadata, output = data.output, approver = data.approver, administrator = data.administrator;
        this.networkId = networkId;
        this.shardId = shardId;
        this.metadata = metadata;
        this.output = output;
        this.approver = approver;
        this.administrator = administrator;
    }
    /**
     * Create an AssetMintTransaction from an AssetMintTransaction JSON object.
     * @param data An AssetMintTransaction JSON object.
     * @returns An AssetMintTransaction.
     */
    AssetMintTransaction.fromJSON = function (data) {
        var _a = data.data, networkId = _a.networkId, shardId = _a.shardId, metadata = _a.metadata, output = _a.output, approver = _a.approver, administrator = _a.administrator;
        return new this({
            networkId: networkId,
            shardId: shardId,
            metadata: metadata,
            output: AssetMintOutput_1.AssetMintOutput.fromJSON(output),
            approver: approver === null ? null : codechain_primitives_1.PlatformAddress.fromString(approver),
            administrator: administrator === null
                ? null
                : codechain_primitives_1.PlatformAddress.fromString(administrator)
        });
    };
    /**
     * Convert to an AssetMintTransaction JSON object.
     * @returns An AssetMintTransaction JSON object.
     */
    AssetMintTransaction.prototype.toJSON = function () {
        var _a = this, networkId = _a.networkId, shardId = _a.shardId, metadata = _a.metadata, output = _a.output, approver = _a.approver, administrator = _a.administrator;
        return {
            type: this.type,
            data: {
                networkId: networkId,
                shardId: shardId,
                metadata: metadata,
                output: output.toJSON(),
                approver: approver === null ? null : approver.toString(),
                administrator: administrator === null ? null : administrator.toString()
            }
        };
    };
    /**
     * Convert to an object for RLP encoding.
     */
    AssetMintTransaction.prototype.toEncodeObject = function () {
        var _a = this, networkId = _a.networkId, shardId = _a.shardId, metadata = _a.metadata, _b = _a.output, lockScriptHash = _b.lockScriptHash, parameters = _b.parameters, amount = _b.amount, approver = _a.approver, administrator = _a.administrator;
        return [
            3,
            networkId,
            shardId,
            metadata,
            lockScriptHash.toEncodeObject(),
            parameters.map(function (parameter) { return buffer_1.Buffer.from(parameter); }),
            amount != null ? [amount.toEncodeObject()] : [],
            approver ? [approver.getAccountId().toEncodeObject()] : [],
            administrator ? [administrator.getAccountId().toEncodeObject()] : []
        ];
    };
    /**
     * Convert to RLP bytes.
     */
    AssetMintTransaction.prototype.rlpBytes = function () {
        return RLP.encode(this.toEncodeObject());
    };
    /**
     * Get the hash of an AssetMintTransaction.
     * @returns A transaction hash.
     */
    AssetMintTransaction.prototype.hash = function () {
        return new H256_1.H256(utils_1.blake256(this.rlpBytes()));
    };
    /**
     * Get the output of this transaction.
     * @returns An Asset.
     */
    AssetMintTransaction.prototype.getMintedAsset = function () {
        var _a = this.output, lockScriptHash = _a.lockScriptHash, parameters = _a.parameters, amount = _a.amount;
        if (amount == null) {
            throw Error("not implemented");
        }
        return new Asset_1.Asset({
            assetType: this.getAssetSchemeAddress(),
            lockScriptHash: lockScriptHash,
            parameters: parameters,
            amount: amount,
            transactionHash: this.hash(),
            transactionOutputIndex: 0
        });
    };
    /**
     * Get the asset scheme of this transaction.
     * @return An AssetScheme.
     */
    AssetMintTransaction.prototype.getAssetScheme = function () {
        var _a = this, networkId = _a.networkId, shardId = _a.shardId, metadata = _a.metadata, amount = _a.output.amount, approver = _a.approver, administrator = _a.administrator;
        if (amount == null) {
            throw Error("not implemented");
        }
        return new AssetScheme_1.AssetScheme({
            networkId: networkId,
            shardId: shardId,
            metadata: metadata,
            amount: amount,
            approver: approver,
            administrator: administrator,
            pool: []
        });
    };
    /**
     * Get the address of the asset scheme. An asset scheme address equals to an
     * asset type value.
     * @returns An asset scheme address which is H256.
     */
    AssetMintTransaction.prototype.getAssetSchemeAddress = function () {
        var shardId = this.shardId;
        var blake = utils_1.blake256WithKey(this.hash().value, new Uint8Array([
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
        ]));
        var shardPrefix = convertU16toHex(shardId);
        var prefix = "5300" + shardPrefix;
        return new H256_1.H256(blake.replace(new RegExp("^.{" + prefix.length + "}"), prefix));
    };
    /**
     * Get the asset address of the output.
     * @returns An asset address which is H256.
     */
    AssetMintTransaction.prototype.getAssetAddress = function () {
        var shardId = this.shardId;
        var blake = utils_1.blake256WithKey(this.hash().value, new Uint8Array([
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
        ]));
        var shardPrefix = convertU16toHex(shardId);
        var prefix = "4100" + shardPrefix;
        return new H256_1.H256(blake.replace(new RegExp("^.{" + prefix.length + "}"), prefix));
    };
    return AssetMintTransaction;
}());
exports.AssetMintTransaction = AssetMintTransaction;
function convertU16toHex(id) {
    var hi = ("0" + ((id >> 8) & 0xff).toString(16)).slice(-2);
    var lo = ("0" + (id & 0xff).toString(16)).slice(-2);
    return hi + lo;
}
