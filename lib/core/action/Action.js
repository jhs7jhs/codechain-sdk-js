"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var codechain_primitives_1 = require("codechain-primitives");
var H160_1 = require("../H160");
var H256_1 = require("../H256");
var H512_1 = require("../H512");
var Transaction_1 = require("../transaction/Transaction");
var U64_1 = require("../U64");
var AssetTransaction_1 = require("./AssetTransaction");
var CreateShard_1 = require("./CreateShard");
var Payment_1 = require("./Payment");
var Remove_1 = require("./Remove");
var SetRegularKey_1 = require("./SetRegularKey");
var SetShardOwners_1 = require("./SetShardOwners");
var SetShardUsers_1 = require("./SetShardUsers");
var Store_1 = require("./Store");
var WrapCCC_1 = require("./WrapCCC");
function getActionFromJSON(json) {
    var action = json.action;
    switch (action) {
        case "assetTransaction": {
            var transaction = json.transaction, approvals = json.approvals;
            return new AssetTransaction_1.AssetTransaction({
                transaction: Transaction_1.getTransactionFromJSON(transaction),
                approvals: approvals
            });
        }
        case "payment": {
            var receiver = json.receiver, amount = json.amount;
            return new Payment_1.Payment(codechain_primitives_1.PlatformAddress.ensure(receiver), new U64_1.U64(amount));
        }
        case "setRegularKey": {
            var key = json.key;
            return new SetRegularKey_1.SetRegularKey(new H512_1.H512(key));
        }
        case "createShard":
            return new CreateShard_1.CreateShard();
        case "setShardOwners": {
            var shardId = json.shardId, owners = json.owners;
            return new SetShardOwners_1.SetShardOwners({
                shardId: shardId,
                owners: owners.map(codechain_primitives_1.PlatformAddress.ensure)
            });
        }
        case "setShardUsers": {
            var shardId = json.shardId, users = json.users;
            return new SetShardUsers_1.SetShardUsers({
                shardId: shardId,
                users: users.map(codechain_primitives_1.PlatformAddress.ensure)
            });
        }
        case "wrapCCC": {
            var shardId = json.shardId, lockScriptHash = json.lockScriptHash, parameters = json.parameters, amount = json.amount;
            return new WrapCCC_1.WrapCCC({
                shardId: shardId,
                lockScriptHash: H160_1.H160.ensure(lockScriptHash),
                parameters: parameters.map(function (p) {
                    return Buffer.from(p);
                }),
                amount: U64_1.U64.ensure(amount)
            });
        }
        case "store": {
            var content = json.content, certifier = json.certifier, signature = json.signature;
            return new Store_1.Store({
                content: content,
                certifier: codechain_primitives_1.PlatformAddress.ensure(certifier),
                signature: signature
            });
        }
        case "remove": {
            var hash = json.hash, signature = json.signature;
            return new Remove_1.Remove({
                hash: H256_1.H256.ensure(hash),
                signature: signature
            });
        }
        default:
            throw Error("Unexpected parcel action: " + action);
    }
}
exports.getActionFromJSON = getActionFromJSON;
