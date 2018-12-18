"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DevelRpc = /** @class */ (function () {
    /**
     * @hidden
     */
    function DevelRpc(rpc) {
        this.rpc = rpc;
    }
    /**
     * Starts and Enable sealing parcels.
     * @returns null
     */
    DevelRpc.prototype.startSealing = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("devel_startSealing", [])
                .then(function (result) {
                if (result === null) {
                    return resolve(null);
                }
                reject(Error("Expected devel_startSealing to return null but it returned " + result));
            })
                .catch(reject);
        });
    };
    /**
     * Stops and Disable sealing parcels.
     * @returns null
     */
    DevelRpc.prototype.stopSealing = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("devel_stopSealing", [])
                .then(function (result) {
                if (result === null) {
                    return resolve(null);
                }
                reject(Error("Expected devel_stopSealing to return null but it returned " + result));
            })
                .catch(reject);
        });
    };
    return DevelRpc;
}());
exports.DevelRpc = DevelRpc;
