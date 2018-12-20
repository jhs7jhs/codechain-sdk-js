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
Object.defineProperty(exports, "__esModule", { value: true });
var codechain_primitives_1 = require("codechain-primitives");
var AssetTransaction_1 = require("./action/AssetTransaction");
var CreateShard_1 = require("./action/CreateShard");
var Payment_1 = require("./action/Payment");
var Remove_1 = require("./action/Remove");
var SetRegularKey_1 = require("./action/SetRegularKey");
var SetShardOwners_1 = require("./action/SetShardOwners");
var SetShardUsers_1 = require("./action/SetShardUsers");
var Store_1 = require("./action/Store");
var WrapCCC_1 = require("./action/WrapCCC");
var Asset_1 = require("./Asset");
var AssetScheme_1 = require("./AssetScheme");
var Block_1 = require("./Block");
var H128_1 = require("./H128");
var H160_1 = require("./H160");
var H256_1 = require("./H256");
var H512_1 = require("./H512");
var Invoice_1 = require("./Invoice");
var Parcel_1 = require("./Parcel");
var Script_1 = require("./Script");
var SignedParcel_1 = require("./SignedParcel");
var AssetComposeTransaction_1 = require("./transaction/AssetComposeTransaction");
var AssetDecomposeTransaction_1 = require("./transaction/AssetDecomposeTransaction");
var AssetMintOutput_1 = require("./transaction/AssetMintOutput");
var AssetMintTransaction_1 = require("./transaction/AssetMintTransaction");
var AssetOutPoint_1 = require("./transaction/AssetOutPoint");
var AssetSchemeChangeTransaction_1 = require("./transaction/AssetSchemeChangeTransaction");
var AssetTransferInput_1 = require("./transaction/AssetTransferInput");
var AssetTransferOutput_1 = require("./transaction/AssetTransferOutput");
var AssetTransferTransaction_1 = require("./transaction/AssetTransferTransaction");
var AssetUnwrapCCCTransaction_1 = require("./transaction/AssetUnwrapCCCTransaction");
var Order_1 = require("./transaction/Order");
var OrderOnTransfer_1 = require("./transaction/OrderOnTransfer");
var Transaction_1 = require("./transaction/Transaction");
var U256_1 = require("./U256");
var U64_1 = require("./U64");
var Core = /** @class */ (function () {
    /**
     * @param params.networkId The network id of CodeChain.
     */
    function Core(params) {
        this.classes = Core.classes;
        var networkId = params.networkId;
        this.networkId = networkId;
    }
    /**
     * Creates Payment action which pays the value amount of CCC(CodeChain Coin)
     * from the parcel signer to the recipient. Who is signing the parcel will pay.
     * @param params.recipient The platform account who receives CCC
     * @param params.amount Amount of CCC to pay
     * @throws Given string for recipient is invalid for converting it to PlatformAddress
     * @throws Given number or string for amount is invalid for converting it to U64
     */
    Core.prototype.createPaymentParcel = function (params) {
        var recipient = params.recipient, amount = params.amount;
        checkPlatformAddressRecipient(recipient);
        checkAmount(amount);
        return new Parcel_1.Parcel(this.networkId, new Payment_1.Payment(codechain_primitives_1.PlatformAddress.ensure(recipient), U64_1.U64.ensure(amount)));
    };
    /**
     * Creates SetRegularKey action which sets the regular key of the parcel signer.
     * @param params.key The public key of a regular key
     * @throws Given string for key is invalid for converting it to H512
     */
    Core.prototype.createSetRegularKeyParcel = function (params) {
        var key = params.key;
        checkKey(key);
        return new Parcel_1.Parcel(this.networkId, new SetRegularKey_1.SetRegularKey(H512_1.H512.ensure(key)));
    };
    /**
     * Creates AssetTransaction action which can mint or transfer assets through
     * AssetMintTransaction or AssetTransferTransaction.
     * @param params.transaction Transaction
     */
    Core.prototype.createAssetTransactionParcel = function (params) {
        var transaction = params.transaction, _a = params.approvals, approvals = _a === void 0 ? [] : _a;
        checkTransaction(transaction);
        return new Parcel_1.Parcel(this.networkId, new AssetTransaction_1.AssetTransaction({ transaction: transaction, approvals: approvals }));
    };
    /**
     * Creates CreateShard action which can create new shard
     */
    Core.prototype.createCreateShardParcel = function () {
        return new Parcel_1.Parcel(this.networkId, new CreateShard_1.CreateShard());
    };
    Core.prototype.createSetShardOwnersParcel = function (params) {
        var shardId = params.shardId, owners = params.owners;
        checkShardId(shardId);
        checkOwners(owners);
        return new Parcel_1.Parcel(this.networkId, new SetShardOwners_1.SetShardOwners({
            shardId: shardId,
            owners: owners.map(codechain_primitives_1.PlatformAddress.ensure)
        }));
    };
    /**
     * Create SetShardUser action which can change shard users
     * @param params.shardId
     * @param params.users
     */
    Core.prototype.createSetShardUsersParcel = function (params) {
        var shardId = params.shardId, users = params.users;
        checkShardId(shardId);
        checkUsers(users);
        return new Parcel_1.Parcel(this.networkId, new SetShardUsers_1.SetShardUsers({
            shardId: shardId,
            users: users.map(codechain_primitives_1.PlatformAddress.ensure)
        }));
    };
    /**
     * Creates Wrap CCC action which wraps the value amount of CCC(CodeChain Coin)
     * in a wrapped CCC asset. Who is signing the parcel will pay.
     * @param params.shardId A shard ID of the wrapped CCC asset.
     * @param params.lockScriptHash A lock script hash of the wrapped CCC asset.
     * @param params.parameters Parameters of the wrapped CCC asset.
     * @param params.amount Amount of CCC to pay
     * @throws Given string for a lock script hash is invalid for converting it to H160
     * @throws Given number or string for amount is invalid for converting it to U64
     */
    Core.prototype.createWrapCCCParcel = function (params) {
        var shardId = params.shardId, amount = params.amount;
        checkShardId(shardId);
        checkAmount(amount);
        if ("recipient" in params) {
            checkAssetTransferAddressRecipient(params.recipient);
            return new Parcel_1.Parcel(this.networkId, new WrapCCC_1.WrapCCC({
                shardId: shardId,
                recipient: codechain_primitives_1.AssetTransferAddress.ensure(params.recipient),
                amount: U64_1.U64.ensure(amount)
            }));
        }
        else {
            var lockScriptHash = params.lockScriptHash, parameters = params.parameters;
            checkLockScriptHash(lockScriptHash);
            checkParameters(parameters);
            return new Parcel_1.Parcel(this.networkId, new WrapCCC_1.WrapCCC({
                shardId: shardId,
                lockScriptHash: H160_1.H160.ensure(lockScriptHash),
                parameters: parameters,
                amount: U64_1.U64.ensure(amount)
            }));
        }
    };
    /**
     * Creates Store action which store content with certifier on chain.
     * @param params.content Content to store
     * @param params.secret Secret key to sign
     * @param params.certifier Certifier of the text, which is PlatformAddress
     * @param params.signature Signature on the content by the certifier
     * @throws Given string for secret is invalid for converting it to H256
     */
    Core.prototype.createStoreParcel = function (params) {
        if ("secret" in params) {
            var content = params.content, secret = params.secret;
            checkSecret(secret);
            return new Parcel_1.Parcel(this.networkId, new Store_1.Store({
                content: content,
                secret: H256_1.H256.ensure(secret),
                networkId: this.networkId
            }));
        }
        else {
            var content = params.content, certifier = params.certifier, signature = params.signature;
            checkCertifier(certifier);
            checkSignature(signature);
            return new Parcel_1.Parcel(this.networkId, new Store_1.Store({
                content: content,
                certifier: codechain_primitives_1.PlatformAddress.ensure(certifier),
                signature: signature
            }));
        }
    };
    /**
     * Creates Remove action which remove the text from the chain.
     * @param params.hash Parcel hash which stored the text
     * @param params.secret Secret key to sign
     * @param params.signature Signature on parcel hash by the certifier of the text
     * @throws Given string for hash or secret is invalid for converting it to H256
     */
    Core.prototype.createRemoveParcel = function (params) {
        if ("secret" in params) {
            var hash = params.hash, secret = params.secret;
            checkParcelHash(hash);
            checkSecret(secret);
            return new Parcel_1.Parcel(this.networkId, new Remove_1.Remove({
                hash: H256_1.H256.ensure(hash),
                secret: H256_1.H256.ensure(secret)
            }));
        }
        else {
            var hash = params.hash, signature = params.signature;
            checkParcelHash(hash);
            checkSignature(signature);
            return new Parcel_1.Parcel(this.networkId, new Remove_1.Remove({
                hash: H256_1.H256.ensure(hash),
                signature: signature
            }));
        }
    };
    /**
     * Creates asset's scheme.
     * @param params.metadata Any string that describing the asset. For example,
     * stringified JSON containing properties.
     * @param params.amount Total amount of this asset
     * @param params.approver Platform account or null. If account is present, the
     * parcel that includes AssetTransferTransaction of this asset must be signed by
     * the approver account.
     * @param params.administrator Platform account or null. The administrator
     * can transfer the asset without unlocking.
     * @throws Given string for approver is invalid for converting it to paltform account
     * @throws Given string for administrator is invalid for converting it to paltform account
     */
    Core.prototype.createAssetScheme = function (params) {
        var shardId = params.shardId, metadata = params.metadata, amount = params.amount, _a = params.approver, approver = _a === void 0 ? null : _a, _b = params.administrator, administrator = _b === void 0 ? null : _b, _c = params.pool, pool = _c === void 0 ? [] : _c;
        checkShardId(shardId);
        checkMetadata(metadata);
        checkAmount(amount);
        checkApprover(approver);
        checkAdministrator(administrator);
        return new AssetScheme_1.AssetScheme({
            networkId: this.networkId,
            shardId: shardId,
            metadata: metadata,
            amount: U64_1.U64.ensure(amount),
            approver: approver == null ? null : codechain_primitives_1.PlatformAddress.ensure(approver),
            administrator: administrator == null
                ? null
                : codechain_primitives_1.PlatformAddress.ensure(administrator),
            pool: pool.map(function (_a) {
                var assetType = _a.assetType, assetAmount = _a.amount;
                return ({
                    assetType: H256_1.H256.ensure(assetType),
                    amount: U64_1.U64.ensure(assetAmount)
                });
            })
        });
    };
    Core.prototype.createOrder = function (params) {
        var assetTypeFrom = params.assetTypeFrom, assetTypeTo = params.assetTypeTo, _a = params.assetTypeFee, assetTypeFee = _a === void 0 ? "0".repeat(64) : _a, assetAmountFrom = params.assetAmountFrom, assetAmountTo = params.assetAmountTo, _b = params.assetAmountFee, assetAmountFee = _b === void 0 ? 0 : _b, originOutputs = params.originOutputs, expiration = params.expiration;
        checkAssetType(assetTypeFrom);
        checkAssetType(assetTypeTo);
        checkAssetType(assetTypeFee);
        checkAmount(assetAmountFrom);
        checkAmount(assetAmountTo);
        checkAmount(assetAmountFee);
        checkExpiration(expiration);
        var originOutputsConv = [];
        for (var i = 0; i < originOutputs.length; i++) {
            var originOutput = originOutputs[i];
            var transactionHash = originOutput.transactionHash, index = originOutput.index, assetType = originOutput.assetType, amount = originOutput.amount, lockScriptHash = originOutput.lockScriptHash, parameters = originOutput.parameters;
            checkAssetOutPoint(originOutput);
            originOutputsConv[i] =
                originOutput instanceof AssetOutPoint_1.AssetOutPoint
                    ? originOutput
                    : new AssetOutPoint_1.AssetOutPoint({
                        transactionHash: H256_1.H256.ensure(transactionHash),
                        index: index,
                        assetType: H256_1.H256.ensure(assetType),
                        amount: U64_1.U64.ensure(amount),
                        lockScriptHash: lockScriptHash
                            ? H160_1.H160.ensure(lockScriptHash)
                            : undefined,
                        parameters: parameters
                    });
        }
        var baseParams = {
            assetTypeFrom: H256_1.H256.ensure(assetTypeFrom),
            assetTypeTo: H256_1.H256.ensure(assetTypeTo),
            assetTypeFee: H256_1.H256.ensure(assetTypeFee),
            assetAmountFrom: U64_1.U64.ensure(assetAmountFrom),
            assetAmountTo: U64_1.U64.ensure(assetAmountTo),
            assetAmountFee: U64_1.U64.ensure(assetAmountFee),
            expiration: U64_1.U64.ensure(expiration),
            originOutputs: originOutputsConv
        };
        var toParams;
        var feeParams;
        if ("recipientFrom" in params) {
            checkAssetTransferAddressRecipient(params.recipientFrom);
            toParams = {
                recipientFrom: codechain_primitives_1.AssetTransferAddress.ensure(params.recipientFrom)
            };
        }
        else {
            var lockScriptHashFrom = params.lockScriptHashFrom, parametersFrom = params.parametersFrom;
            checkLockScriptHash(lockScriptHashFrom);
            checkParameters(parametersFrom);
            toParams = {
                lockScriptHashFrom: H160_1.H160.ensure(lockScriptHashFrom),
                parametersFrom: parametersFrom
            };
        }
        if ("recipientFee" in params) {
            checkAssetTransferAddressRecipient(params.recipientFee);
            feeParams = {
                recipientFee: codechain_primitives_1.AssetTransferAddress.ensure(params.recipientFee)
            };
        }
        else if ("lockScriptHashFee" in params) {
            var lockScriptHashFee = params.lockScriptHashFee, parametersFee = params.parametersFee;
            checkLockScriptHash(lockScriptHashFee);
            checkParameters(parametersFee);
            feeParams = {
                lockScriptHashFee: H160_1.H160.ensure(lockScriptHashFee),
                parametersFee: parametersFee
            };
        }
        else {
            feeParams = {
                lockScriptHashFee: H160_1.H160.ensure("0".repeat(40)),
                parametersFee: []
            };
        }
        return new Order_1.Order(__assign({}, baseParams, toParams, feeParams));
    };
    Core.prototype.createOrderOnTransfer = function (params) {
        var order = params.order, spentAmount = params.spentAmount, inputIndices = params.inputIndices, outputIndices = params.outputIndices;
        checkOrder(order);
        checkAmount(spentAmount);
        checkIndices(inputIndices);
        checkIndices(outputIndices);
        return new OrderOnTransfer_1.OrderOnTransfer({
            order: order,
            spentAmount: U64_1.U64.ensure(spentAmount),
            inputIndices: inputIndices,
            outputIndices: outputIndices
        });
    };
    Core.prototype.createAssetMintTransaction = function (params) {
        var scheme = params.scheme, recipient = params.recipient;
        if (scheme !== null && typeof scheme !== "object") {
            throw Error("Expected scheme param to be either an AssetScheme or an object but found " + scheme);
        }
        var _a = scheme.networkId, networkId = _a === void 0 ? this.networkId : _a, shardId = scheme.shardId, metadata = scheme.metadata, _b = scheme.approver, approver = _b === void 0 ? null : _b, _c = scheme.administrator, administrator = _c === void 0 ? null : _c, amount = scheme.amount;
        checkAssetTransferAddressRecipient(recipient);
        checkNetworkId(networkId);
        if (shardId === undefined) {
            throw Error("shardId is undefined");
        }
        checkShardId(shardId);
        checkMetadata(metadata);
        checkApprover(approver);
        checkAdministrator(administrator);
        if (amount != null) {
            checkAmount(amount);
        }
        return new AssetMintTransaction_1.AssetMintTransaction({
            networkId: networkId,
            shardId: shardId,
            approver: approver == null ? null : codechain_primitives_1.PlatformAddress.ensure(approver),
            administrator: administrator == null
                ? null
                : codechain_primitives_1.PlatformAddress.ensure(administrator),
            metadata: metadata,
            output: new AssetMintOutput_1.AssetMintOutput({
                amount: amount == null ? null : U64_1.U64.ensure(amount),
                recipient: codechain_primitives_1.AssetTransferAddress.ensure(recipient)
            })
        });
    };
    Core.prototype.createAssetSchemeChangeTransaction = function (params) {
        var assetType = params.assetType, scheme = params.scheme;
        if (scheme !== null && typeof scheme !== "object") {
            throw Error("Expected scheme param to be either an AssetScheme or an object but found " + scheme);
        }
        var _a = scheme.networkId, networkId = _a === void 0 ? this.networkId : _a, metadata = scheme.metadata, _b = scheme.approver, approver = _b === void 0 ? null : _b, _c = scheme.administrator, administrator = _c === void 0 ? null : _c;
        checkNetworkId(networkId);
        checkAssetType(assetType);
        checkMetadata(metadata);
        checkApprover(approver);
        checkAdministrator(administrator);
        return new AssetSchemeChangeTransaction_1.AssetSchemeChangeTransaction({
            networkId: networkId,
            assetType: H256_1.H256.ensure(assetType),
            metadata: metadata,
            approver: approver == null ? null : codechain_primitives_1.PlatformAddress.ensure(approver),
            administrator: administrator == null
                ? null
                : codechain_primitives_1.PlatformAddress.ensure(administrator)
        });
    };
    Core.prototype.createAssetTransferTransaction = function (params) {
        var _a = params || {}, _b = _a.burns, burns = _b === void 0 ? [] : _b, _c = _a.inputs, inputs = _c === void 0 ? [] : _c, _d = _a.outputs, outputs = _d === void 0 ? [] : _d, _e = _a.orders, orders = _e === void 0 ? [] : _e, _f = _a.networkId, networkId = _f === void 0 ? this.networkId : _f;
        checkTransferBurns(burns);
        checkTransferInputs(inputs);
        checkTransferOutputs(outputs);
        checkNetworkId(networkId);
        return new AssetTransferTransaction_1.AssetTransferTransaction({
            burns: burns,
            inputs: inputs,
            outputs: outputs,
            orders: orders,
            networkId: networkId
        });
    };
    Core.prototype.createAssetComposeTransaction = function (params) {
        var scheme = params.scheme, inputs = params.inputs, recipient = params.recipient;
        var _a = scheme.networkId, networkId = _a === void 0 ? this.networkId : _a, shardId = scheme.shardId, metadata = scheme.metadata, _b = scheme.approver, approver = _b === void 0 ? null : _b, _c = scheme.administrator, administrator = _c === void 0 ? null : _c, amount = scheme.amount;
        checkTransferInputs(inputs);
        checkAssetTransferAddressRecipient(recipient);
        checkNetworkId(networkId);
        if (shardId === undefined) {
            throw Error("shardId is undefined");
        }
        checkShardId(shardId);
        checkMetadata(metadata);
        checkApprover(approver);
        if (amount != null) {
            checkAmount(amount);
        }
        return new AssetComposeTransaction_1.AssetComposeTransaction({
            networkId: networkId,
            shardId: shardId,
            approver: approver === null ? null : codechain_primitives_1.PlatformAddress.ensure(approver),
            administrator: administrator === null
                ? null
                : codechain_primitives_1.PlatformAddress.ensure(administrator),
            metadata: metadata,
            inputs: inputs,
            output: new AssetMintOutput_1.AssetMintOutput({
                recipient: codechain_primitives_1.AssetTransferAddress.ensure(recipient),
                amount: amount == null ? null : U64_1.U64.ensure(amount)
            })
        });
    };
    Core.prototype.createAssetDecomposeTransaction = function (params) {
        if (params === null ||
            typeof params !== "object" ||
            !("input" in params)) {
            throw Error("Expected the first param of createAssetDecomposeTransaction to be an object containing input param but found " + params);
        }
        var input = params.input, _a = params.outputs, outputs = _a === void 0 ? [] : _a, _b = params.networkId, networkId = _b === void 0 ? this.networkId : _b;
        checkTransferInput(input);
        checkTransferOutputs(outputs);
        checkNetworkId(networkId);
        return new AssetDecomposeTransaction_1.AssetDecomposeTransaction({
            input: input,
            outputs: outputs,
            networkId: networkId
        });
    };
    Core.prototype.createAssetUnwrapCCCTransaction = function (params) {
        var burn = params.burn, _a = params.networkId, networkId = _a === void 0 ? this.networkId : _a;
        checkNetworkId(networkId);
        if (burn instanceof Asset_1.Asset) {
            var burnInput = burn.createTransferInput();
            checkTransferBurns([burnInput]);
            return new AssetUnwrapCCCTransaction_1.AssetUnwrapCCCTransaction({
                burn: burnInput,
                networkId: networkId
            });
        }
        else {
            checkTransferBurns([burn]);
            return new AssetUnwrapCCCTransaction_1.AssetUnwrapCCCTransaction({
                burn: burn,
                networkId: networkId
            });
        }
    };
    Core.prototype.createAssetTransferInput = function (params) {
        var assetOutPoint = params.assetOutPoint, _a = params.timelock, timelock = _a === void 0 ? null : _a, lockScript = params.lockScript, unlockScript = params.unlockScript;
        checkAssetOutPoint(assetOutPoint);
        checkTimelock(timelock);
        if (lockScript) {
            checkLockScript(lockScript);
        }
        if (unlockScript) {
            checkUnlockScript(unlockScript);
        }
        var transactionHash = assetOutPoint.transactionHash, index = assetOutPoint.index, assetType = assetOutPoint.assetType, amount = assetOutPoint.amount, lockScriptHash = assetOutPoint.lockScriptHash, parameters = assetOutPoint.parameters;
        return new AssetTransferInput_1.AssetTransferInput({
            prevOut: assetOutPoint instanceof AssetOutPoint_1.AssetOutPoint
                ? assetOutPoint
                : new AssetOutPoint_1.AssetOutPoint({
                    transactionHash: H256_1.H256.ensure(transactionHash),
                    index: index,
                    assetType: H256_1.H256.ensure(assetType),
                    amount: U64_1.U64.ensure(amount),
                    lockScriptHash: lockScriptHash
                        ? H160_1.H160.ensure(lockScriptHash)
                        : undefined,
                    parameters: parameters
                }),
            timelock: timelock,
            lockScript: lockScript,
            unlockScript: unlockScript
        });
    };
    Core.prototype.createAssetOutPoint = function (params) {
        var transactionHash = params.transactionHash, index = params.index, assetType = params.assetType, amount = params.amount;
        checkTransactionHash(transactionHash);
        checkIndex(index);
        checkAssetType(assetType);
        checkAmount(amount);
        return new AssetOutPoint_1.AssetOutPoint({
            transactionHash: H256_1.H256.ensure(transactionHash),
            index: index,
            assetType: H256_1.H256.ensure(assetType),
            amount: U64_1.U64.ensure(amount)
        });
    };
    Core.prototype.createAssetTransferOutput = function (params) {
        var assetType = params.assetType;
        var amount = U64_1.U64.ensure(params.amount);
        checkAssetType(assetType);
        checkAmount(amount);
        if ("recipient" in params) {
            var recipient = params.recipient;
            checkAssetTransferAddressRecipient(recipient);
            return new AssetTransferOutput_1.AssetTransferOutput({
                recipient: codechain_primitives_1.AssetTransferAddress.ensure(recipient),
                assetType: H256_1.H256.ensure(assetType),
                amount: amount
            });
        }
        else if ("lockScriptHash" in params && "parameters" in params) {
            var lockScriptHash = params.lockScriptHash, parameters = params.parameters;
            checkLockScriptHash(lockScriptHash);
            checkParameters(parameters);
            return new AssetTransferOutput_1.AssetTransferOutput({
                lockScriptHash: H160_1.H160.ensure(lockScriptHash),
                parameters: parameters,
                assetType: H256_1.H256.ensure(assetType),
                amount: amount
            });
        }
        else {
            throw Error("Unexpected params: " + params);
        }
    };
    // FIXME: any
    Core.prototype.getTransactionFromJSON = function (json) {
        return Transaction_1.getTransactionFromJSON(json);
    };
    Core.classes = {
        // Data
        H128: H128_1.H128,
        H160: H160_1.H160,
        H256: H256_1.H256,
        H512: H512_1.H512,
        U256: U256_1.U256,
        U64: U64_1.U64,
        Invoice: Invoice_1.Invoice,
        // Block
        Block: Block_1.Block,
        // Parcel
        Parcel: Parcel_1.Parcel,
        SignedParcel: SignedParcel_1.SignedParcel,
        // Action
        Payment: Payment_1.Payment,
        SetRegularKey: SetRegularKey_1.SetRegularKey,
        AssetTransaction: AssetTransaction_1.AssetTransaction,
        CreateShard: CreateShard_1.CreateShard,
        SetShardOwners: SetShardOwners_1.SetShardOwners,
        SetShardUsers: SetShardUsers_1.SetShardUsers,
        WrapCCC: WrapCCC_1.WrapCCC,
        Store: Store_1.Store,
        Remove: Remove_1.Remove,
        // Transaction
        AssetMintTransaction: AssetMintTransaction_1.AssetMintTransaction,
        AssetSchemeChangeTransaction: AssetSchemeChangeTransaction_1.AssetSchemeChangeTransaction,
        AssetTransferTransaction: AssetTransferTransaction_1.AssetTransferTransaction,
        AssetComposeTransaction: AssetComposeTransaction_1.AssetComposeTransaction,
        AssetDecomposeTransaction: AssetDecomposeTransaction_1.AssetDecomposeTransaction,
        AssetUnwrapCCCTransaction: AssetUnwrapCCCTransaction_1.AssetUnwrapCCCTransaction,
        AssetTransferInput: AssetTransferInput_1.AssetTransferInput,
        AssetTransferOutput: AssetTransferOutput_1.AssetTransferOutput,
        AssetOutPoint: AssetOutPoint_1.AssetOutPoint,
        // Asset and AssetScheme
        Asset: Asset_1.Asset,
        AssetScheme: AssetScheme_1.AssetScheme,
        // Script
        Script: Script_1.Script,
        // Addresses
        PlatformAddress: codechain_primitives_1.PlatformAddress,
        AssetTransferAddress: codechain_primitives_1.AssetTransferAddress
    };
    return Core;
}());
exports.Core = Core;
function checkNetworkId(networkId) {
    if (typeof networkId !== "string" || networkId.length !== 2) {
        throw Error("Expected networkId param to be a string of length 2 but found " + networkId);
    }
}
function checkPlatformAddressRecipient(recipient) {
    if (!codechain_primitives_1.PlatformAddress.check(recipient)) {
        throw Error("Expected recipient param to be a PlatformAddress but found " + recipient);
    }
}
function checkAssetTransferAddressRecipient(recipient) {
    if (!codechain_primitives_1.AssetTransferAddress.check(recipient)) {
        throw Error("Expected recipient param to be a AssetTransferAddress but found " + recipient);
    }
}
function checkAmount(amount) {
    if (!U64_1.U64.check(amount)) {
        throw Error("Expected amount param to be a U64 value but found " + amount);
    }
}
function checkExpiration(expiration) {
    if (!U64_1.U64.check(expiration)) {
        throw Error("Expected expiration param to be a U64 value but found " + expiration);
    }
}
function checkKey(key) {
    if (!H512_1.H512.check(key)) {
        throw Error("Expected key param to be an H512 value but found " + key);
    }
}
function checkShardId(shardId) {
    if (typeof shardId !== "number" ||
        !Number.isInteger(shardId) ||
        shardId < 0 ||
        shardId > 0xffff) {
        throw Error("Expected shardId param to be a number but found " + shardId);
    }
}
function checkMetadata(metadata) {
    if (typeof metadata !== "string") {
        throw Error("Expected metadata param to be a string but found " + metadata);
    }
}
function checkApprover(approver) {
    if (approver !== null && !codechain_primitives_1.PlatformAddress.check(approver)) {
        throw Error("Expected approver param to be either null or a PlatformAddress value but found " + approver);
    }
}
function checkAdministrator(administrator) {
    if (administrator !== null && !codechain_primitives_1.PlatformAddress.check(administrator)) {
        throw Error("Expected administrator param to be either null or a PlatformAddress value but found " + administrator);
    }
}
function checkCertifier(certifier) {
    if (!codechain_primitives_1.PlatformAddress.check(certifier)) {
        throw Error("Expected certifier param to be a PlatformAddress but found " + certifier);
    }
}
function checkTransaction(_transaction) {
    // FIXME: check whether the transaction is valid
}
function checkOwners(owners) {
    if (!Array.isArray(owners)) {
        throw Error("Expected owners param to be an array but found " + owners);
    }
    owners.forEach(function (owner, index) {
        if (!codechain_primitives_1.PlatformAddress.check(owner)) {
            throw Error("Expected an owner address to be a PlatformAddress value but found " + owner + " at index " + index);
        }
    });
}
function checkUsers(users) {
    if (!Array.isArray(users)) {
        throw Error("Expected users param to be an array but found " + users);
    }
    users.forEach(function (user, index) {
        if (!codechain_primitives_1.PlatformAddress.check(user)) {
            throw Error("Expected a user address to be a PlatformAddress value but found " + user + " at index " + index);
        }
    });
}
function checkTransferBurns(burns) {
    if (!Array.isArray(burns)) {
        throw Error("Expected burns param to be an array but found " + burns);
    }
    burns.forEach(function (burn, index) {
        if (!(burn instanceof AssetTransferInput_1.AssetTransferInput)) {
            throw Error("Expected an item of burns to be an AssetTransferInput but found " + burn + " at index " + index);
        }
    });
}
function checkTransferInput(input) {
    if (!(input instanceof AssetTransferInput_1.AssetTransferInput)) {
        throw Error("Expected an input param to be an AssetTransferInput but found " + input);
    }
}
function checkTransferInputs(inputs) {
    if (!Array.isArray(inputs)) {
        throw Error("Expected inputs param to be an array but found " + inputs);
    }
    inputs.forEach(function (input, index) {
        if (!(input instanceof AssetTransferInput_1.AssetTransferInput)) {
            throw Error("Expected an item of inputs to be an AssetTransferInput but found " + input + " at index " + index);
        }
    });
}
function checkTransferOutputs(outputs) {
    if (!Array.isArray(outputs)) {
        throw Error("Expected outputs param to be an array but found " + outputs);
    }
    outputs.forEach(function (output, index) {
        if (!(output instanceof AssetTransferOutput_1.AssetTransferOutput)) {
            throw Error("Expected an item of outputs to be an AssetTransferOutput but found " + output + " at index " + index);
        }
    });
}
function checkTransactionHash(value) {
    if (!H256_1.H256.check(value)) {
        throw Error("Expected transactionHash param to be an H256 value but found " + value);
    }
}
function checkIndex(index) {
    if (typeof index !== "number") {
        throw Error("Expected index param to be a number but found " + index);
    }
}
function checkAssetType(value) {
    if (!H256_1.H256.check(value)) {
        throw Error("Expected assetType param to be an H256 value but found " + value);
    }
}
function checkAssetOutPoint(value) {
    if (value !== null && typeof value !== "object") {
        throw Error("Expected assetOutPoint param to be either an AssetOutPoint or an object but found " + value);
    }
    var transactionHash = value.transactionHash, index = value.index, assetType = value.assetType, amount = value.amount, lockScriptHash = value.lockScriptHash, parameters = value.parameters;
    checkTransactionHash(transactionHash);
    checkIndex(index);
    checkAssetType(assetType);
    checkAmount(amount);
    if (lockScriptHash) {
        checkLockScriptHash(lockScriptHash);
    }
    if (parameters) {
        checkParameters(parameters);
    }
}
function checkOrder(order) {
    if (order !== null && !(order instanceof Order_1.Order)) {
        throw Error("Expected order param to be either null or an Order value but found " + order);
    }
}
function checkIndices(indices) {
    if (!Array.isArray(indices)) {
        throw Error("Expected indices param to be an array but found " + indices);
    }
    indices.forEach(function (value, idx) {
        if (typeof value !== "number") {
            throw Error("Expected an indices to be an array of numbers but found " + value + " at index " + idx);
        }
    });
}
function checkLockScriptHash(value) {
    if (!H160_1.H160.check(value)) {
        throw Error("Expected lockScriptHash param to be an H160 value but found " + value);
    }
}
function checkParcelHash(value) {
    if (!H256_1.H256.check(value)) {
        throw Error("Expected hash param to be an H256 value but found " + value);
    }
}
function checkSecret(value) {
    if (!H256_1.H256.check(value)) {
        throw Error("Expected secret param to be an H256 value but found " + value);
    }
}
function checkParameters(parameters) {
    if (!Array.isArray(parameters)) {
        throw Error("Expected parameters param to be an array but found " + parameters);
    }
    parameters.forEach(function (p, index) {
        if (!(p instanceof Buffer)) {
            throw Error("Expected an item of parameters to be a Buffer instance but found " + p + " at index " + index);
        }
    });
}
function checkTimelock(timelock) {
    if (timelock === null) {
        return;
    }
    var type = timelock.type, value = timelock.value;
    if (type === "block" ||
        type === "blockAge" ||
        type === "time" ||
        type === "timeAge") {
        return;
    }
    if (typeof value === "number") {
        return;
    }
    throw Error("Expected timelock param to be either null or an object containing both type and value but found " + timelock);
}
function checkLockScript(lockScript) {
    if (!(lockScript instanceof Buffer)) {
        throw Error("Expedted lockScript param to be an instance of Buffer but found " + lockScript);
    }
}
function checkUnlockScript(unlockScript) {
    if (!(unlockScript instanceof Buffer)) {
        throw Error("Expected unlockScript param to be an instance of Buffer but found " + unlockScript);
    }
}
function checkSignature(signature) {
    // ECDSA Signature
    if (typeof signature !== "string" ||
        !/^(0x)?[0-9a-fA-F]{130}$/.test(signature)) {
        throw Error("Expected signature param to be a 65 byte hexstring but found " + signature);
    }
}
