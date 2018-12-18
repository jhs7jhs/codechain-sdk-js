"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var codechain_primitives_1 = require("codechain-primitives");
var AssetMintOutput_1 = require("./transaction/AssetMintOutput");
var AssetMintTransaction_1 = require("./transaction/AssetMintTransaction");
var U64_1 = require("./U64");
/**
 * Object that contains information about the Asset when performing AssetMintTransaction.
 */
var AssetScheme = /** @class */ (function () {
    function AssetScheme(data) {
        this.networkId = data.networkId;
        this.shardId = data.shardId;
        this.metadata = data.metadata;
        this.approver = data.approver;
        this.administrator = data.administrator;
        this.amount = data.amount;
        this.pool = data.pool;
    }
    AssetScheme.fromJSON = function (data) {
        var metadata = data.metadata, amount = data.amount, approver = data.approver, administrator = data.administrator, pool = data.pool;
        return new AssetScheme({
            metadata: metadata,
            amount: U64_1.U64.ensure(amount),
            approver: approver === null ? null : codechain_primitives_1.PlatformAddress.ensure(approver),
            administrator: administrator === null
                ? null
                : codechain_primitives_1.PlatformAddress.ensure(administrator),
            pool: pool.map(function (_a) {
                var assetType = _a.assetType, assetAmount = _a.amount;
                return ({
                    assetType: codechain_primitives_1.H256.ensure(assetType),
                    amount: U64_1.U64.ensure(assetAmount)
                });
            })
        });
    };
    AssetScheme.prototype.toJSON = function () {
        var _a = this, metadata = _a.metadata, amount = _a.amount, approver = _a.approver, administrator = _a.administrator, pool = _a.pool;
        return {
            metadata: metadata,
            amount: "0x" + amount.toString(16),
            approver: approver === null ? null : approver.toString(),
            administrator: administrator === null ? null : administrator.toString(),
            pool: pool.map(function (a) { return ({
                assetType: a.assetType.value,
                amount: "0x" + a.amount.toString(16)
            }); })
        };
    };
    AssetScheme.prototype.createMintTransaction = function (params) {
        var recipient = params.recipient;
        var _a = this, networkId = _a.networkId, shardId = _a.shardId, metadata = _a.metadata, amount = _a.amount, approver = _a.approver, administrator = _a.administrator;
        if (networkId === undefined) {
            throw Error("networkId is undefined");
        }
        if (shardId === undefined) {
            throw Error("shardId is undefined");
        }
        return new AssetMintTransaction_1.AssetMintTransaction({
            networkId: networkId,
            shardId: shardId,
            metadata: metadata,
            output: new AssetMintOutput_1.AssetMintOutput({
                amount: amount,
                recipient: codechain_primitives_1.AssetTransferAddress.ensure(recipient)
            }),
            approver: approver,
            administrator: administrator
        });
    };
    return AssetScheme;
}());
exports.AssetScheme = AssetScheme;
