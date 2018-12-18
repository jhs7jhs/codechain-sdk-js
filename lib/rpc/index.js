"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = require("node-fetch");
var account_1 = require("./account");
var chain_1 = require("./chain");
var devel_1 = require("./devel");
var network_1 = require("./network");
var node_1 = require("./node");
/**
 * @hidden
 */
var jaysonBrowserClient = require("jayson/lib/client/browser");
var Rpc = /** @class */ (function () {
    /**
     * @param params.server HTTP RPC server address.
     * @param params.options.parcelSigner The default account to sign the parcel
     * @param params.options.parcelFee The default amount for the parcel fee
     */
    function Rpc(params) {
        var _this = this;
        this.sendRpcRequest = function (name, params) {
            return new Promise(function (resolve, reject) {
                _this.client.request(name, params, function (err, res) {
                    if (err) {
                        return reject(Error("An error occurred while " + name + ": " + err));
                    }
                    else if (res.error) {
                        // FIXME: Throw Error with a description
                        return reject(res.error);
                    }
                    resolve(res.result);
                });
            });
        };
        var server = params.server, _a = params.options, options = _a === void 0 ? {} : _a;
        this.client = jaysonBrowserClient(function (request, callback) {
            node_fetch_1.default(server, {
                method: "POST",
                body: request,
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(function (res) {
                return res.text();
            })
                .then(function (text) {
                return callback(null, text);
            })
                .catch(function (err) {
                return callback(err);
            });
        });
        this.node = new node_1.NodeRpc(this);
        this.chain = new chain_1.ChainRpc(this, options);
        this.network = new network_1.NetworkRpc(this);
        this.account = new account_1.AccountRpc(this, options);
        this.devel = new devel_1.DevelRpc(this);
    }
    return Rpc;
}());
exports.Rpc = Rpc;
