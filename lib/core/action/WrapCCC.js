"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codechain_primitives_1 = require("codechain-primitives");
const P2PKH_1 = require("../../key/P2PKH");
const P2PKHBurn_1 = require("../../key/P2PKHBurn");
const Asset_1 = require("../Asset");
class WrapCCC {
    constructor(data) {
        if ("recipient" in data) {
            // FIXME: Clean up by abstracting the standard scripts
            const { type, payload } = data.recipient;
            if ("pubkeys" in payload) {
                throw Error("Multisig payload is not supported yet");
            }
            switch (type) {
                case 0x00: // LOCK_SCRIPT_HASH ONLY
                    this.lockScriptHash = payload;
                    this.parameters = [];
                    break;
                case 0x01: // P2PKH
                    this.lockScriptHash = P2PKH_1.P2PKH.getLockScriptHash();
                    this.parameters = [Buffer.from(payload.value, "hex")];
                    break;
                case 0x02: // P2PKHBurn
                    this.lockScriptHash = P2PKHBurn_1.P2PKHBurn.getLockScriptHash();
                    this.parameters = [Buffer.from(payload.value, "hex")];
                    break;
                default:
                    throw Error(`Unexpected type of AssetTransferAddress: ${type}, ${data.recipient}`);
            }
        }
        else {
            const { lockScriptHash, parameters } = data;
            this.lockScriptHash = lockScriptHash;
            this.parameters = parameters;
        }
        const { shardId, amount } = data;
        this.shardId = shardId;
        this.amount = amount;
    }
    /**
     * Get the address of the asset scheme of the wrapped CCC asset. An asset scheme address equals to an
     * asset type value.
     * @returns An asset scheme address which is H256.
     */
    getAssetSchemeAddress() {
        const shardPrefix = convertU16toHex(this.shardId);
        const prefix = `5300${shardPrefix}`;
        const hash = prefix.concat("0".repeat(56));
        return new codechain_primitives_1.H256(hash);
    }
    /**
     * Get the wrapped CCC asset output of this parcel.
     * @param parcelHash A hash value of containing parcel
     * @returns An Asset.
     */
    getAsset(parcelHash) {
        const { lockScriptHash, parameters, amount } = this;
        return new Asset_1.Asset({
            assetType: this.getAssetSchemeAddress(),
            lockScriptHash,
            parameters,
            amount,
            transactionHash: parcelHash,
            transactionOutputIndex: 0
        });
    }
    toEncodeObject() {
        const { shardId, lockScriptHash, parameters, amount } = this;
        return [
            7,
            shardId,
            lockScriptHash.toEncodeObject(),
            parameters.map(parameter => Buffer.from(parameter)),
            amount.toEncodeObject()
        ];
    }
    toJSON() {
        const { shardId, lockScriptHash, parameters, amount } = this;
        return {
            action: "wrapCCC",
            shardId,
            lockScriptHash: lockScriptHash.value,
            parameters: parameters.map(parameter => [...parameter]),
            amount: amount.toEncodeObject()
        };
    }
}
exports.WrapCCC = WrapCCC;
// FIXME: Need to move the function to the external file. Also used in AssetMintTransaction.
function convertU16toHex(id) {
    const hi = ("0" + ((id >> 8) & 0xff).toString(16)).slice(-2);
    const lo = ("0" + (id & 0xff).toString(16)).slice(-2);
    return hi + lo;
}
