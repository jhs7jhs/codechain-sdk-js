"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("codechain-primitives/lib");
var utils_1 = require("../../utils");
var RLP = require("rlp");
/**
 * Change asset scheme
 */
var AssetSchemeChangeTransaction = /** @class */ (function () {
    /**
     * @param params.networkId A network ID of the transaction.
     * @param params.assetType A asset type that this transaction changes.
     * @param params.metadata A changed metadata of the asset.
     * @param params.approver A changed approver of the asset.
     * @param params.administrator A changed administrator of the asset.
     */
    function AssetSchemeChangeTransaction(params) {
        this.type = "assetSchemeChange";
        var networkId = params.networkId, assetType = params.assetType, metadata = params.metadata, approver = params.approver, administrator = params.administrator;
        this.networkId = networkId;
        this.assetType = assetType;
        this.metadata = metadata;
        this.approver =
            approver === null ? null : lib_1.PlatformAddress.ensure(approver);
        this.administrator =
            administrator === null
                ? null
                : lib_1.PlatformAddress.ensure(administrator);
    }
    AssetSchemeChangeTransaction.fromJSON = function (obj) {
        var _a = obj.data, networkId = _a.networkId, assetType = _a.assetType, metadata = _a.metadata, approver = _a.approver, administrator = _a.administrator;
        return new this({
            networkId: networkId,
            assetType: new lib_1.H256(assetType),
            metadata: metadata,
            approver: approver == null ? null : lib_1.PlatformAddress.ensure(approver),
            administrator: administrator == null
                ? null
                : lib_1.PlatformAddress.ensure(administrator)
        });
    };
    /**
     * Convert to an AssetSchemeChangeTransaction JSON object.
     * @returns An AssetSchemeChangeTransaction JSON object.
     */
    AssetSchemeChangeTransaction.prototype.toJSON = function () {
        return {
            type: this.type,
            data: {
                networkId: this.networkId,
                assetType: this.assetType.toEncodeObject(),
                metadata: this.metadata,
                approver: this.approver == null ? null : this.approver.toString(),
                administrator: this.administrator == null
                    ? null
                    : this.administrator.toString()
            }
        };
    };
    /**
     * Convert to an object for RLP encoding.
     */
    AssetSchemeChangeTransaction.prototype.toEncodeObject = function () {
        var _a = this, networkId = _a.networkId, assetType = _a.assetType, metadata = _a.metadata, approver = _a.approver, administrator = _a.administrator;
        return [
            5,
            networkId,
            assetType,
            metadata,
            approver ? [approver.getAccountId().toEncodeObject()] : [],
            administrator ? [administrator.getAccountId().toEncodeObject()] : []
        ];
    };
    /**
     * Convert to RLP bytes.
     */
    AssetSchemeChangeTransaction.prototype.rlpBytes = function () {
        return RLP.encode(this.toEncodeObject());
    };
    /**
     * Get the hash of an AssetMintTransaction.
     * @returns A transaction hash.
     */
    AssetSchemeChangeTransaction.prototype.hash = function () {
        return new lib_1.H256(utils_1.blake256(this.rlpBytes()));
    };
    return AssetSchemeChangeTransaction;
}());
exports.AssetSchemeChangeTransaction = AssetSchemeChangeTransaction;
