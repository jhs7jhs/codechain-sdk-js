"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SetShardUsers = /** @class */ (function () {
    function SetShardUsers(params) {
        var shardId = params.shardId, users = params.users;
        this.shardId = shardId;
        this.users = users;
    }
    SetShardUsers.prototype.toEncodeObject = function () {
        var _a = this, shardId = _a.shardId, users = _a.users;
        return [
            6,
            shardId,
            users.map(function (user) { return user.getAccountId().toEncodeObject(); })
        ];
    };
    SetShardUsers.prototype.toJSON = function () {
        var _a = this, shardId = _a.shardId, users = _a.users;
        return {
            action: "setShardUsers",
            shardId: shardId,
            users: users.map(function (user) { return user.value; })
        };
    };
    return SetShardUsers;
}());
exports.SetShardUsers = SetShardUsers;
