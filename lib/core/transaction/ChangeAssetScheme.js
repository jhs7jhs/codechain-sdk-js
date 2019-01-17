"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var classes_1 = require("../classes");
var Transaction_1 = require("../Transaction");
var RLP = require("rlp");
var ChangeAssetScheme = /** @class */ (function (_super) {
    __extends(ChangeAssetScheme, _super);
    function ChangeAssetScheme(input) {
        var _this = _super.call(this, input.networkId) || this;
        _this._transaction = new AssetSchemeChangeTransaction(input);
        _this.approvals = input.approvals;
        return _this;
    }
    ChangeAssetScheme.prototype.type = function () {
        return "changeAssetScheme";
    };
    ChangeAssetScheme.prototype.actionToEncodeObject = function () {
        var encoded = this._transaction.toEncodeObject();
        encoded.push(this.approvals);
        return encoded;
    };
    ChangeAssetScheme.prototype.actionToJSON = function () {
        var json = this._transaction.toJSON();
        json.approvals = this.approvals;
        return json;
    };
    return ChangeAssetScheme;
}(Transaction_1.Transaction));
exports.ChangeAssetScheme = ChangeAssetScheme;
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
     * @param params.allowedScriptHashes Allowed lock script hashes of the asset.
     */
    function AssetSchemeChangeTransaction(params) {
        var networkId = params.networkId, assetType = params.assetType, metadata = params.metadata, approver = params.approver, administrator = params.administrator, allowedScriptHashes = params.allowedScriptHashes;
        this.networkId = networkId;
        this.assetType = assetType;
        this.metadata = metadata;
        this.approver =
            approver === null ? null : classes_1.PlatformAddress.ensure(approver);
        this.administrator =
            administrator === null
                ? null
                : classes_1.PlatformAddress.ensure(administrator);
        this.allowedScriptHashes = allowedScriptHashes;
    }
    /**
     * Convert to an AssetSchemeChangeTransaction JSON object.
     * @returns An AssetSchemeChangeTransaction JSON object.
     */
    AssetSchemeChangeTransaction.prototype.toJSON = function () {
        return {
            networkId: this.networkId,
            assetType: this.assetType.toEncodeObject(),
            metadata: this.metadata,
            approver: this.approver == null ? null : this.approver.toString(),
            administrator: this.administrator == null
                ? null
                : this.administrator.toString(),
            allowedScriptHashes: this.allowedScriptHashes.map(function (hash) {
                return hash.toJSON();
            })
        };
    };
    /**
     * Convert to an object for RLP encoding.
     */
    AssetSchemeChangeTransaction.prototype.toEncodeObject = function () {
        var _a = this, networkId = _a.networkId, assetType = _a.assetType, metadata = _a.metadata, approver = _a.approver, administrator = _a.administrator, allowedScriptHashes = _a.allowedScriptHashes;
        return [
            0x15,
            networkId,
            assetType,
            metadata,
            approver ? [approver.getAccountId().toEncodeObject()] : [],
            administrator
                ? [administrator.getAccountId().toEncodeObject()]
                : [],
            allowedScriptHashes.map(function (hash) { return hash.toEncodeObject(); })
        ];
    };
    /**
     * Convert to RLP bytes.
     */
    AssetSchemeChangeTransaction.prototype.rlpBytes = function () {
        return RLP.encode(this.toEncodeObject());
    };
    return AssetSchemeChangeTransaction;
}());
