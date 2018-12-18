"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var codechain_primitives_1 = require("codechain-primitives");
var H256_1 = require("./H256");
var SignedParcel_1 = require("./SignedParcel");
var U256_1 = require("./U256");
/**
 * Block is the unit of processes being handled by CodeChain. Contains information related to SignedParcel's list and block creation.
 */
var Block = /** @class */ (function () {
    function Block(data) {
        var parentHash = data.parentHash, timestamp = data.timestamp, number = data.number, author = data.author, extraData = data.extraData, parcelsRoot = data.parcelsRoot, stateRoot = data.stateRoot, invoicesRoot = data.invoicesRoot, score = data.score, seal = data.seal, hash = data.hash, parcels = data.parcels;
        this.parentHash = parentHash;
        this.timestamp = timestamp;
        this.number = number;
        this.author = author;
        this.extraData = extraData;
        this.parcelsRoot = parcelsRoot;
        this.stateRoot = stateRoot;
        this.invoicesRoot = invoicesRoot;
        this.score = score;
        this.seal = seal;
        this.hash = hash;
        this.parcels = parcels;
    }
    Block.fromJSON = function (data) {
        var parentHash = data.parentHash, timestamp = data.timestamp, number = data.number, author = data.author, extraData = data.extraData, parcelsRoot = data.parcelsRoot, stateRoot = data.stateRoot, invoicesRoot = data.invoicesRoot, score = data.score, seal = data.seal, hash = data.hash, parcels = data.parcels;
        return new this({
            parentHash: new H256_1.H256(parentHash),
            timestamp: timestamp,
            number: number,
            author: codechain_primitives_1.PlatformAddress.fromString(author),
            extraData: extraData,
            parcelsRoot: new H256_1.H256(parcelsRoot),
            stateRoot: new H256_1.H256(stateRoot),
            invoicesRoot: new H256_1.H256(invoicesRoot),
            score: new U256_1.U256(score),
            seal: seal,
            hash: new H256_1.H256(hash),
            parcels: parcels.map(function (p) { return SignedParcel_1.SignedParcel.fromJSON(p); })
        });
    };
    Block.prototype.toJSON = function () {
        var _a = this, parentHash = _a.parentHash, timestamp = _a.timestamp, number = _a.number, author = _a.author, extraData = _a.extraData, parcelsRoot = _a.parcelsRoot, stateRoot = _a.stateRoot, invoicesRoot = _a.invoicesRoot, score = _a.score, seal = _a.seal, hash = _a.hash, parcels = _a.parcels;
        return {
            parentHash: parentHash.value,
            timestamp: timestamp,
            number: number,
            author: author.toString(),
            extraData: extraData,
            parcelsRoot: parcelsRoot.value,
            stateRoot: stateRoot.value,
            invoicesRoot: invoicesRoot.value,
            score: score.value.toString(),
            seal: seal,
            hash: hash.value,
            parcels: parcels.map(function (p) { return p.toJSON(); })
        };
    };
    return Block;
}());
exports.Block = Block;
