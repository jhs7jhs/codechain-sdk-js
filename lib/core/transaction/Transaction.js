"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AssetComposeTransaction_1 = require("./AssetComposeTransaction");
var AssetDecomposeTransaction_1 = require("./AssetDecomposeTransaction");
var AssetMintTransaction_1 = require("./AssetMintTransaction");
var AssetSchemeChangeTransaction_1 = require("./AssetSchemeChangeTransaction");
var AssetTransferTransaction_1 = require("./AssetTransferTransaction");
var AssetUnwrapCCCTransaction_1 = require("./AssetUnwrapCCCTransaction");
/**
 * Create a transaction from either an AssetMintTransaction JSON object or an
 * AssetTransferTransaction JSON object.
 * @param json Either an AssetMintTransaction JSON object or an AssetTransferTransaction JSON object.
 * @returns A Transaction.
 */
exports.getTransactionFromJSON = function (json) {
    switch (json.type) {
        case "assetMint":
            return AssetMintTransaction_1.AssetMintTransaction.fromJSON(json);
        case "assetTransfer":
            return AssetTransferTransaction_1.AssetTransferTransaction.fromJSON(json);
        case "assetCompose":
            return AssetComposeTransaction_1.AssetComposeTransaction.fromJSON(json);
        case "assetDecompose":
            return AssetDecomposeTransaction_1.AssetDecomposeTransaction.fromJSON(json);
        case "assetUnwrapCCC":
            return AssetUnwrapCCCTransaction_1.AssetUnwrapCCCTransaction.fromJSON(json);
        case "assetSchemeChange":
            return AssetSchemeChangeTransaction_1.AssetSchemeChangeTransaction.fromJSON(json);
        default:
            throw Error("Unexpected transaction type: " + json.type);
    }
};
