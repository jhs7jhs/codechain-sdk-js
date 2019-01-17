"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var codechain_primitives_1 = require("codechain-primitives");
var H256_1 = require("./H256");
var json_1 = require("./transaction/json");
var U256_1 = require("./U256");
/**
 * Block is the unit of processes being handled by CodeChain. Contains information related to SignedTransaction's list and block creation.
 */
var Block = /** @class */ (function () {
    function Block(data) {
        var parentHash = data.parentHash, timestamp = data.timestamp, number = data.number, author = data.author, extraData = data.extraData, transactionsRoot = data.transactionsRoot, stateRoot = data.stateRoot, invoicesRoot = data.invoicesRoot, score = data.score, seal = data.seal, hash = data.hash, transactions = data.transactions;
        this.parentHash = parentHash;
        this.timestamp = timestamp;
        this.number = number;
        this.author = author;
        this.extraData = extraData;
        this.transactionsRoot = transactionsRoot;
        this.stateRoot = stateRoot;
        this.invoicesRoot = invoicesRoot;
        this.score = score;
        this.seal = seal;
        this.hash = hash;
        this.transactions = transactions;
    }
    Block.fromJSON = function (data) {
        var parentHash = data.parentHash, timestamp = data.timestamp, number = data.number, author = data.author, extraData = data.extraData, transactionsRoot = data.transactionsRoot, stateRoot = data.stateRoot, invoicesRoot = data.invoicesRoot, score = data.score, seal = data.seal, hash = data.hash, transactions = data.transactions;
        return new this({
            parentHash: new H256_1.H256(parentHash),
            timestamp: timestamp,
            number: number,
            author: codechain_primitives_1.PlatformAddress.fromString(author),
            extraData: extraData,
            transactionsRoot: new H256_1.H256(transactionsRoot),
            stateRoot: new H256_1.H256(stateRoot),
            invoicesRoot: new H256_1.H256(invoicesRoot),
            score: new U256_1.U256(score),
            seal: seal,
            hash: new H256_1.H256(hash),
            transactions: transactions.map(json_1.fromJSONToSignedTransaction)
        });
    };
    Block.prototype.toJSON = function () {
        var _a = this, parentHash = _a.parentHash, timestamp = _a.timestamp, number = _a.number, author = _a.author, extraData = _a.extraData, transactionsRoot = _a.transactionsRoot, stateRoot = _a.stateRoot, invoicesRoot = _a.invoicesRoot, score = _a.score, seal = _a.seal, hash = _a.hash, transactions = _a.transactions;
        return {
            parentHash: parentHash.toJSON(),
            timestamp: timestamp,
            number: number,
            author: author.toString(),
            extraData: extraData,
            transactionsRoot: transactionsRoot.toJSON(),
            stateRoot: stateRoot.toJSON(),
            invoicesRoot: invoicesRoot.toJSON(),
            score: score.value.toString(),
            seal: seal,
            hash: hash.toJSON(),
            transactions: transactions.map(function (p) { return p.toJSON(); })
        };
    };
    return Block;
}());
exports.Block = Block;
