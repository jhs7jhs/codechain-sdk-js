"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SetShardOwners = /** @class */ (function () {
    function SetShardOwners(params) {
        var shardId = params.shardId, owners = params.owners;
        this.shardId = shardId;
        this.owners = owners;
    }
    SetShardOwners.prototype.toEncodeObject = function () {
        var _a = this, shardId = _a.shardId, owners = _a.owners;
        return [
            5,
            shardId,
            owners.map(function (owner) { return owner.getAccountId().toEncodeObject(); })
        ];
    };
    SetShardOwners.prototype.toJSON = function () {
        var _a = this, shardId = _a.shardId, owners = _a.owners;
        return {
            action: "setShardOwners",
            shardId: shardId,
            owners: owners.map(function (owner) { return owner.value; })
        };
    };
    return SetShardOwners;
}());
exports.SetShardOwners = SetShardOwners;
