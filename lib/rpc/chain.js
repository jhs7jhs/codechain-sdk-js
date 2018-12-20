"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var codechain_primitives_1 = require("codechain-primitives");
var Asset_1 = require("../core/Asset");
var AssetScheme_1 = require("../core/AssetScheme");
var Block_1 = require("../core/Block");
var H256_1 = require("../core/H256");
var H512_1 = require("../core/H512");
var Invoice_1 = require("../core/Invoice");
var Parcel_1 = require("../core/Parcel");
var SignedParcel_1 = require("../core/SignedParcel");
var Text_1 = require("../core/Text");
var Transaction_1 = require("../core/transaction/Transaction");
var U64_1 = require("../core/U64");
var ChainRpc = /** @class */ (function () {
    /**
     * @hidden
     */
    function ChainRpc(rpc, options) {
        var parcelSigner = options.parcelSigner, parcelFee = options.parcelFee;
        this.rpc = rpc;
        this.parcelSigner = parcelSigner;
        this.parcelFee = parcelFee;
    }
    /**
     * Sends SignedParcel to CodeChain's network.
     * @param parcel SignedParcel
     * @returns SignedParcel's hash.
     */
    ChainRpc.prototype.sendSignedParcel = function (parcel) {
        var _this = this;
        if (!(parcel instanceof SignedParcel_1.SignedParcel)) {
            throw Error("Expected the first argument of sendSignedParcel to be SignedParcel but found " + parcel);
        }
        return new Promise(function (resolve, reject) {
            var bytes = Array.from(parcel.rlpBytes())
                .map(function (byte) {
                return byte < 0x10
                    ? "0" + byte.toString(16)
                    : byte.toString(16);
            })
                .join("");
            _this.rpc
                .sendRpcRequest("chain_sendSignedParcel", ["0x" + bytes])
                .then(function (result) {
                try {
                    resolve(new H256_1.H256(result));
                }
                catch (e) {
                    reject(Error("Expected sendSignedParcel() to return a value of H256, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Signs a parcel with the given account and sends it to CodeChain's network.
     * @param parcel The parcel to send
     * @param options.account The account to sign the parcel
     * @param options.passphrase The account's passphrase
     * @param options.seq The seq of the parcel
     * @param options.fee The fee of the parcel
     * @returns SignedParcel's hash
     * @throws When the given account cannot afford to pay the fee
     * @throws When the given fee is too low
     * @throws When the given seq does not match
     * @throws When the given account is unknown
     * @throws When the given passphrase does not match
     */
    ChainRpc.prototype.sendParcel = function (parcel, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, account, passphrase, _c, fee, _d, seq, _e, address, sig;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!(parcel instanceof Parcel_1.Parcel)) {
                            throw Error("Expected the first argument of sendParcel to be a Parcel but found " + parcel);
                        }
                        _a = options || { passphrase: undefined }, _b = _a.account, account = _b === void 0 ? this.parcelSigner : _b, passphrase = _a.passphrase, _c = _a.fee, fee = _c === void 0 ? this.parcelFee : _c;
                        if (!account) {
                            throw Error("The account to sign the parcel is not specified");
                        }
                        else if (!codechain_primitives_1.PlatformAddress.check(account)) {
                            throw Error("Expected account param of sendParcel to be a PlatformAddress value but found " + account);
                        }
                        _d = (options || {}).seq;
                        if (!(_d === void 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getSeq(account)];
                    case 1:
                        _e = _f.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _e = _d;
                        _f.label = 3;
                    case 3:
                        seq = _e;
                        parcel.setSeq(seq);
                        if (!fee) {
                            throw Error("The fee of the parcel is not specified");
                        }
                        parcel.setFee(fee);
                        address = codechain_primitives_1.PlatformAddress.ensure(account);
                        return [4 /*yield*/, this.rpc.account.sign(parcel.hash(), address, passphrase)];
                    case 4:
                        sig = _f.sent();
                        return [2 /*return*/, this.sendSignedParcel(new SignedParcel_1.SignedParcel(parcel, sig))];
                }
            });
        });
    };
    /**
     * Gets SignedParcel of given hash. Else returns null.
     * @param hash SignedParcel's hash
     * @returns SignedParcel, or null when SignedParcel was not found.
     */
    ChainRpc.prototype.getParcel = function (hash) {
        var _this = this;
        if (!H256_1.H256.check(hash)) {
            throw Error("Expected the first argument of getParcel to be an H256 value but found " + hash);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getParcel", [
                "0x" + H256_1.H256.ensure(hash).value
            ])
                .then(function (result) {
                try {
                    resolve(result === null
                        ? null
                        : SignedParcel_1.SignedParcel.fromJSON(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getParcel to return either null or JSON of SignedParcel, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets invoices of given parcel.
     * @param parcelHash The parcel hash of which to get the corresponding parcel of.
     * @param options.timeout Indicating milliseconds to wait the parcel to be confirmed.
     * @returns List of invoice, or null when no such parcel exists.
     */
    ChainRpc.prototype.getParcelInvoice = function (parcelHash, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var attemptToGet, timeout, startTime, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!H256_1.H256.check(parcelHash)) {
                            throw Error("Expected the first argument of getParcelInvoice to be an H256 value but found " + parcelHash);
                        }
                        attemptToGet = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, this.rpc.sendRpcRequest("chain_getParcelInvoice", [
                                        "0x" + H256_1.H256.ensure(parcelHash).value
                                    ])];
                            });
                        }); };
                        timeout = options.timeout;
                        if (timeout !== undefined &&
                            (typeof timeout !== "number" || timeout < 0)) {
                            throw Error("Expected timeout param of getParcelInvoice to be non-negative number but found " + timeout);
                        }
                        startTime = Date.now();
                        return [4 /*yield*/, attemptToGet()];
                    case 1:
                        result = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(result === null &&
                            timeout !== undefined &&
                            Date.now() - startTime < timeout)) return [3 /*break*/, 5];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, attemptToGet()];
                    case 4:
                        result = _a.sent();
                        return [3 /*break*/, 2];
                    case 5:
                        if (result === null) {
                            return [2 /*return*/, null];
                        }
                        try {
                            return [2 /*return*/, Invoice_1.Invoice.fromJSON(result)];
                        }
                        catch (e) {
                            throw Error("Expected chain_getParcelInvoice to return either null or JSON of Invoice, but an error occurred: " + e.toString());
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the regular key of an account of given address, recorded in the block of given blockNumber. If blockNumber is not given, then returns the regular key in the most recent block.
     * @param address An account address
     * @param blockNumber The specific block number to get account's regular key at given address.
     * @returns The regular key of account at specified block.
     */
    ChainRpc.prototype.getRegularKey = function (address, blockNumber) {
        var _this = this;
        if (!codechain_primitives_1.PlatformAddress.check(address)) {
            throw Error("Expected the first argument of getRegularKey to be a PlatformAddress value but found " + address);
        }
        if (blockNumber !== undefined && !isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the second argument of getRegularKey to be a number but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getRegularKey", [
                "" + codechain_primitives_1.PlatformAddress.ensure(address).value,
                blockNumber
            ])
                .then(function (result) {
                try {
                    resolve(result === null ? null : new H512_1.H512(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getRegularKey to return either null or a value of H512, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets the owner of a regular key, recorded in the block of given blockNumber.
     * @param regularKey A regular key.
     * @param blockNumber A block number.
     * @return The platform address that can use the regular key at the specified block.
     */
    ChainRpc.prototype.getRegularKeyOwner = function (regularKey, blockNumber) {
        var _this = this;
        if (!H512_1.H512.check(regularKey)) {
            throw Error("Expected the first argument of getRegularKeyOwner to be an H512 value but found " + regularKey);
        }
        if (blockNumber !== undefined && !isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the second argument of getRegularKeyOwner to be a number but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getRegularKeyOwner", [
                "0x" + H512_1.H512.ensure(regularKey).value,
                blockNumber
            ])
                .then(function (result) {
                try {
                    resolve(result === null
                        ? null
                        : codechain_primitives_1.PlatformAddress.fromString(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getRegularKeyOwner to return a PlatformAddress string, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets a transaction of given hash.
     * @param txhash The transaction hash of which to get the corresponding transaction of.
     * @returns A transaction, or null when transaction of given hash not exists.
     */
    ChainRpc.prototype.getTransaction = function (txhash) {
        var _this = this;
        if (!H256_1.H256.check(txhash)) {
            throw Error("Expected the first argument of getTransaction to be an H256 value but found " + txhash);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getTransaction", [
                "0x" + H256_1.H256.ensure(txhash).value
            ])
                .then(function (result) {
                try {
                    resolve(result === null
                        ? null
                        : Transaction_1.getTransactionFromJSON(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getTransaction to return either null or JSON of Transaction, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets invoice of a transaction of given hash.
     * @param txhash The transaction hash of which to get the corresponding transaction of.
     * @param options.timeout Indicating milliseconds to wait the transaction to be confirmed.
     * @returns Invoice, or null when transaction of given hash not exists.
     */
    ChainRpc.prototype.getTransactionInvoices = function (txhash, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var attemptToGet, startTime, timeout, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!H256_1.H256.check(txhash)) {
                            throw Error("Expected the first argument of getTransactionInvoice to be an H256 value but found " + txhash);
                        }
                        attemptToGet = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, this.rpc.sendRpcRequest("chain_getTransactionInvoices", [
                                        "0x" + H256_1.H256.ensure(txhash).value
                                    ])];
                            });
                        }); };
                        startTime = Date.now();
                        timeout = options.timeout;
                        if (timeout !== undefined &&
                            (typeof timeout !== "number" || timeout < 0)) {
                            throw Error("Expected timeout param of getTransactionInvoice to be non-negative number but found " + timeout);
                        }
                        return [4 /*yield*/, attemptToGet()];
                    case 1:
                        result = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(result === null &&
                            timeout !== undefined &&
                            Date.now() - startTime < timeout)) return [3 /*break*/, 5];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, attemptToGet()];
                    case 4:
                        result = _a.sent();
                        return [3 /*break*/, 2];
                    case 5:
                        if (result == null) {
                            return [2 /*return*/, []];
                        }
                        try {
                            return [2 /*return*/, result.map(Invoice_1.Invoice.fromJSON)];
                        }
                        catch (e) {
                            throw Error("Expected chain_getTransactionInvoices to return JSON of Invoice[], but an error occurred: " + e.toString() + ". received: " + JSON.stringify(result));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets balance of an account of given address, recorded in the block of given blockNumber. If blockNumber is not given, then returns balance recorded in the most recent block.
     * @param address An account address
     * @param blockNumber The specific block number to get account's balance at given address.
     * @returns Balance of account at the specified block, or null if no such block exists.
     */
    ChainRpc.prototype.getBalance = function (address, blockNumber) {
        var _this = this;
        if (!codechain_primitives_1.PlatformAddress.check(address)) {
            throw Error("Expected the first argument of getBalance to be a PlatformAddress value but found " + address);
        }
        if (blockNumber !== undefined && !isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the second argument of getBalance to be a number but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getBalance", [
                "" + codechain_primitives_1.PlatformAddress.ensure(address).value,
                blockNumber
            ])
                .then(function (result) {
                try {
                    // FIXME: Need to discuss changing the return type to `U64 | null`. It's a
                    // breaking change.
                    resolve(result === null ? null : new U64_1.U64(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getBalance to return a value of U64, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets seq of an account of given address, recorded in the block of given blockNumber. If blockNumber is not given, then returns seq recorded in the most recent block.
     * @param address An account address
     * @param blockNumber The specific block number to get account's seq at given address.
     * @returns Seq of account at the specified block, or null if no such block exists.
     */
    ChainRpc.prototype.getSeq = function (address, blockNumber) {
        var _this = this;
        if (!codechain_primitives_1.PlatformAddress.check(address)) {
            throw Error("Expected the first argument of getSeq to be a PlatformAddress value but found " + address);
        }
        if (blockNumber !== undefined && !isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the second argument of getSeq to be a number but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getSeq", [
                "" + codechain_primitives_1.PlatformAddress.ensure(address).value,
                blockNumber
            ])
                .then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (result == null) {
                        throw Error("chain_getSeq returns undefined");
                    }
                    resolve(result);
                    return [2 /*return*/];
                });
            }); })
                .catch(reject);
        });
    };
    /**
     * Gets number of the latest block.
     * @returns Number of the latest block.
     */
    ChainRpc.prototype.getBestBlockNumber = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getBestBlockNumber", [])
                .then(function (result) {
                if (typeof result === "number") {
                    return resolve(result);
                }
                reject(Error("Expected chain_getBestBlockNumber to return a number, but it returned " + result));
            })
                .catch(reject);
        });
    };
    /**
     * Gets block hash of given blockNumber.
     * @param blockNumber The block number of which to get the block hash of.
     * @returns BlockHash, if block exists. Else, returns null.
     */
    ChainRpc.prototype.getBlockHash = function (blockNumber) {
        var _this = this;
        if (!isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the first argument of getBlockHash to be a non-negative integer but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getBlockHash", [blockNumber])
                .then(function (result) {
                try {
                    resolve(result === null ? null : new H256_1.H256(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getBlockHash to return either null or a value of H256, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets block of given block hash.
     * @param hashOrNumber The block hash or number of which to get the block of
     * @returns Block, if block exists. Else, returns null.
     */
    ChainRpc.prototype.getBlock = function (hashOrNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(hashOrNumber instanceof H256_1.H256 || typeof hashOrNumber === "string")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.rpc.sendRpcRequest("chain_getBlockByHash", [
                                "0x" + H256_1.H256.ensure(hashOrNumber).value
                            ])];
                    case 1:
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 2:
                        if (!(typeof hashOrNumber === "number")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.rpc.sendRpcRequest("chain_getBlockByNumber", [
                                hashOrNumber
                            ])];
                    case 3:
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 4: throw Error("Expected the first argument of getBlock to be either a number or an H256 value but found " + hashOrNumber);
                    case 5:
                        try {
                            return [2 /*return*/, result === null ? null : Block_1.Block.fromJSON(result)];
                        }
                        catch (e) {
                            throw Error("Expected chain_getBlock to return either null or JSON of Block, but an error occurred: " + e.toString());
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets asset scheme of given hash of AssetMintTransaction.
     * @param txhash The tx hash of AssetMintTransaction.
     * @param shardId The shard id of Asset Scheme.
     * @param blockNumber The specific block number to get the asset scheme from
     * @returns AssetScheme, if asset scheme exists. Else, returns null.
     */
    ChainRpc.prototype.getAssetSchemeByHash = function (txhash, shardId, blockNumber) {
        var _this = this;
        if (!H256_1.H256.check(txhash)) {
            throw Error("Expected the first arugment of getAssetSchemeByHash to be an H256 value but found " + txhash);
        }
        if (!isShardIdValue(shardId)) {
            throw Error("Expected the second argument of getAssetSchemeByHash to be a shard ID value but found " + shardId);
        }
        if (blockNumber !== undefined && !isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the third argument of getAssetSchemeByHash to be non-negative integer but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getAssetSchemeByHash", [
                "0x" + H256_1.H256.ensure(txhash).value,
                shardId,
                blockNumber
            ])
                .then(function (result) {
                try {
                    resolve(result === null
                        ? null
                        : AssetScheme_1.AssetScheme.fromJSON(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getAssetSchemeByHash to return either null or JSON of AssetScheme, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets asset scheme of asset type
     * @param assetType The type of Asset.
     * @param blockNumber The specific block number to get the asset scheme from
     * @returns AssetScheme, if asset scheme exists. Else, returns null.
     */
    ChainRpc.prototype.getAssetSchemeByType = function (assetType, blockNumber) {
        var _this = this;
        if (!H256_1.H256.check(assetType)) {
            throw Error("Expected the first arugment of getAssetSchemeByType to be an H256 value but found " + assetType);
        }
        if (blockNumber !== undefined && !isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the second argument of getAssetSchemeByType to be non-negative integer but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getAssetSchemeByType", [
                "0x" + H256_1.H256.ensure(assetType).value,
                blockNumber
            ])
                .then(function (result) {
                try {
                    resolve(result === null
                        ? null
                        : AssetScheme_1.AssetScheme.fromJSON(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getAssetSchemeByType to return either null or JSON of AssetScheme, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets asset of given transaction hash and index.
     * @param txhash The tx hash of AssetMintTransaction or AssetTransferTransaction.
     * @param index The index of output in the transaction.
     * @param blockNumber The specific block number to get the asset from
     * @returns Asset, if asset exists, Else, returns null.
     */
    ChainRpc.prototype.getAsset = function (txhash, index, blockNumber) {
        var _this = this;
        if (!H256_1.H256.check(txhash)) {
            throw Error("Expected the first argument of getAsset to be an H256 value but found " + txhash);
        }
        if (!isNonNegativeInterger(index)) {
            throw Error("Expected the second argument of getAsset to be non-negative integer but found " + index);
        }
        if (blockNumber !== undefined && !isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the third argument of getAsset to be non-negative integer but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getAsset", [
                "0x" + H256_1.H256.ensure(txhash).value,
                index,
                blockNumber
            ])
                .then(function (result) {
                if (result === null) {
                    return resolve(null);
                }
                try {
                    resolve(Asset_1.Asset.fromJSON(__assign({}, result, { transactionHash: H256_1.H256.ensure(txhash).value, transactionOutputIndex: index })));
                }
                catch (e) {
                    reject(Error("Expected chain_getAsset to return either null or JSON of Asset, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets the text of the given hash of parcel with Store action.
     * @param parcelHash The parcel hash of the Store parcel.
     * @param blockNumber The specific block number to get the text from
     * @returns Text, if text exists. Else, returns null.
     */
    ChainRpc.prototype.getText = function (parcelHash, blockNumber) {
        var _this = this;
        if (!H256_1.H256.check(parcelHash)) {
            throw Error("Expected the first arugment of getText to be an H256 value but found " + parcelHash);
        }
        if (blockNumber !== undefined && !isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the second argument of getText to be non-negative integer but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getText", [
                "0x" + H256_1.H256.ensure(parcelHash).value,
                blockNumber
            ])
                .then(function (result) {
                try {
                    resolve(result === null ? null : Text_1.Text.fromJSON(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getText to return either null or JSON of Text, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Checks whether an asset is spent or not.
     * @param txhash The tx hash of AssetMintTransaction or AssetTransferTransaction.
     * @param index The index of output in the transaction.
     * @param shardId The shard id of an Asset.
     * @param blockNumber The specific block number to get the asset from.
     * @returns True, if the asset is spent. False, if the asset is not spent. Null, if no such asset exists.
     */
    ChainRpc.prototype.isAssetSpent = function (txhash, index, shardId, blockNumber) {
        var _this = this;
        if (!H256_1.H256.check(txhash)) {
            throw Error("Expected the first argument of isAssetSpent to be an H256 value but found " + txhash);
        }
        if (!isNonNegativeInterger(index)) {
            throw Error("Expected the second argument of isAssetSpent to be a non-negative integer but found " + index);
        }
        if (!isShardIdValue(shardId)) {
            throw Error("Expected the third argument of isAssetSpent to be a shard ID value but found " + shardId);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_isAssetSpent", [
                "0x" + H256_1.H256.ensure(txhash).value,
                index,
                shardId,
                blockNumber
            ])
                .then(function (result) {
                if (result === null || typeof result === "boolean") {
                    resolve(result);
                }
                else {
                    reject(Error("Expected chain_isAssetSpent to return either null or boolean but it returned " + result));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets pending parcels.
     * @returns List of SignedParcel, with each parcel has null for blockNumber/blockHash/parcelIndex.
     */
    ChainRpc.prototype.getPendingParcels = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getPendingParcels", [])
                .then(function (result) {
                if (!Array.isArray(result)) {
                    return reject(Error("Expected chain_getPendingParcels to return an array but it returned " + result));
                }
                try {
                    resolve(result.map(function (p) { return SignedParcel_1.SignedParcel.fromJSON(p); }));
                }
                catch (e) {
                    reject(Error("Expected chain_getPendingParcels to return an array of JSON of SignedParcel, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets the network ID of the node.
     * @returns A network ID, e.g. "tc".
     */
    ChainRpc.prototype.getNetworkId = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getNetworkId", [])
                .then(function (result) {
                if (typeof result === "string") {
                    resolve(result);
                }
                else {
                    reject(Error("Expected chain_getNetworkId to return a string but it returned " + result));
                }
            })
                .catch(reject);
        });
    };
    return ChainRpc;
}());
exports.ChainRpc = ChainRpc;
function isNonNegativeInterger(value) {
    return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
function isShardIdValue(value) {
    return (typeof value === "number" &&
        Number.isInteger(value) &&
        value >= 0 &&
        value <= 0xffff);
}
