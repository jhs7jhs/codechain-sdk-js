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
var Asset_1 = require("./Asset");
var AssetScheme_1 = require("./AssetScheme");
var Block_1 = require("./Block");
var H128_1 = require("./H128");
var H160_1 = require("./H160");
var H256_1 = require("./H256");
var H512_1 = require("./H512");
var Invoice_1 = require("./Invoice");
var Script_1 = require("./Script");
var SignedTransaction_1 = require("./SignedTransaction");
var Transaction_1 = require("./Transaction");
var AssetMintOutput_1 = require("./transaction/AssetMintOutput");
var AssetOutPoint_1 = require("./transaction/AssetOutPoint");
var AssetTransferInput_1 = require("./transaction/AssetTransferInput");
var AssetTransferOutput_1 = require("./transaction/AssetTransferOutput");
var ChangeAssetScheme_1 = require("./transaction/ChangeAssetScheme");
var ComposeAsset_1 = require("./transaction/ComposeAsset");
var CreateShard_1 = require("./transaction/CreateShard");
var Custom_1 = require("./transaction/Custom");
var DecomposeAsset_1 = require("./transaction/DecomposeAsset");
var MintAsset_1 = require("./transaction/MintAsset");
var Order_1 = require("./transaction/Order");
var OrderOnTransfer_1 = require("./transaction/OrderOnTransfer");
var Pay_1 = require("./transaction/Pay");
var Remove_1 = require("./transaction/Remove");
var SetRegularKey_1 = require("./transaction/SetRegularKey");
var SetShardOwners_1 = require("./transaction/SetShardOwners");
var SetShardUsers_1 = require("./transaction/SetShardUsers");
var Store_1 = require("./transaction/Store");
var TransferAsset_1 = require("./transaction/TransferAsset");
var UnwrapCCC_1 = require("./transaction/UnwrapCCC");
var WrapCCC_1 = require("./transaction/WrapCCC");
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
     * Creates Pay type which pays the value quantity of CCC(CodeChain Coin)
     * from the tx signer to the recipient. Who is signing the tx will pay.
     * @param params.recipient The platform account who receives CCC
     * @param params.quantity quantity of CCC to pay
     * @throws Given string for recipient is invalid for converting it to PlatformAddress
     * @throws Given number or string for quantity is invalid for converting it to U64
     */
    Core.prototype.createPayTransaction = function (params) {
        var recipient = params.recipient, quantity = params.quantity;
        checkPlatformAddressRecipient(recipient);
        checkAmount(quantity);
        return new Pay_1.Pay(codechain_primitives_1.PlatformAddress.ensure(recipient), U64_1.U64.ensure(quantity), this.networkId);
    };
    /**
     * Creates SetRegularKey type which sets the regular key of the tx signer.
     * @param params.key The public key of a regular key
     * @throws Given string for key is invalid for converting it to H512
     */
    Core.prototype.createSetRegularKeyTransaction = function (params) {
        var key = params.key;
        checkKey(key);
        return new SetRegularKey_1.SetRegularKey(H512_1.H512.ensure(key), this.networkId);
    };
    /**
     * Creates CreateShard type which can create new shard
     */
    Core.prototype.createCreateShardTransaction = function () {
        return new CreateShard_1.CreateShard(this.networkId);
    };
    Core.prototype.createSetShardOwnersTransaction = function (params) {
        var shardId = params.shardId, owners = params.owners;
        checkShardId(shardId);
        checkOwners(owners);
        return new SetShardOwners_1.SetShardOwners({
            shardId: shardId,
            owners: owners.map(codechain_primitives_1.PlatformAddress.ensure)
        }, this.networkId);
    };
    /**
     * Create SetShardUser type which can change shard users
     * @param params.shardId
     * @param params.users
     */
    Core.prototype.createSetShardUsersTransaction = function (params) {
        var shardId = params.shardId, users = params.users;
        checkShardId(shardId);
        checkUsers(users);
        return new SetShardUsers_1.SetShardUsers({
            shardId: shardId,
            users: users.map(codechain_primitives_1.PlatformAddress.ensure)
        }, this.networkId);
    };
    /**
     * Creates Wrap CCC type which wraps the value quantity of CCC(CodeChain Coin)
     * in a wrapped CCC asset. Who is signing the tx will pay.
     * @param params.shardId A shard ID of the wrapped CCC asset.
     * @param params.lockScriptHash A lock script hash of the wrapped CCC asset.
     * @param params.parameters Parameters of the wrapped CCC asset.
     * @param params.quantity quantity of CCC to pay
     * @throws Given string for a lock script hash is invalid for converting it to H160
     * @throws Given number or string for quantity is invalid for converting it to U64
     */
    Core.prototype.createWrapCCCTransaction = function (params) {
        var shardId = params.shardId, quantity = params.quantity;
        checkShardId(shardId);
        checkAmount(quantity);
        var data;
        if ("recipient" in params) {
            checkAssetTransferAddressRecipient(params.recipient);
            data = {
                shardId: shardId,
                recipient: codechain_primitives_1.AssetTransferAddress.ensure(params.recipient),
                quantity: U64_1.U64.ensure(quantity)
            };
        }
        else {
            var lockScriptHash = params.lockScriptHash, parameters = params.parameters;
            checkLockScriptHash(lockScriptHash);
            checkParameters(parameters);
            data = {
                shardId: shardId,
                lockScriptHash: H160_1.H160.ensure(lockScriptHash),
                parameters: parameters,
                quantity: U64_1.U64.ensure(quantity)
            };
        }
        return new WrapCCC_1.WrapCCC(data, this.networkId);
    };
    /**
     * Creates Store type which store content with certifier on chain.
     * @param params.content Content to store
     * @param params.secret Secret key to sign
     * @param params.certifier Certifier of the text, which is PlatformAddress
     * @param params.signature Signature on the content by the certifier
     * @throws Given string for secret is invalid for converting it to H256
     */
    Core.prototype.createStoreTransaction = function (params) {
        var storeParams;
        if ("secret" in params) {
            var content = params.content, secret = params.secret;
            checkSecret(secret);
            storeParams = {
                content: content,
                secret: H256_1.H256.ensure(secret)
            };
        }
        else {
            var content = params.content, certifier = params.certifier, signature = params.signature;
            checkCertifier(certifier);
            checkSignature(signature);
            storeParams = {
                content: content,
                certifier: codechain_primitives_1.PlatformAddress.ensure(certifier),
                signature: signature
            };
        }
        return new Store_1.Store(storeParams, this.networkId);
    };
    /**
     * Creates Remove type which remove the text from the chain.
     * @param params.hash Transaction hash which stored the text
     * @param params.secret Secret key to sign
     * @param params.signature Signature on tx hash by the certifier of the text
     * @throws Given string for hash or secret is invalid for converting it to H256
     */
    Core.prototype.createRemoveTransaction = function (params) {
        var removeParam = null;
        if ("secret" in params) {
            var hash = params.hash, secret = params.secret;
            checkTransactionHash(hash);
            checkSecret(secret);
            removeParam = {
                hash: H256_1.H256.ensure(hash),
                secret: H256_1.H256.ensure(secret)
            };
        }
        else {
            var hash = params.hash, signature = params.signature;
            checkTransactionHash(hash);
            checkSignature(signature);
            removeParam = {
                hash: H256_1.H256.ensure(hash),
                signature: signature
            };
        }
        return new Remove_1.Remove(removeParam, this.networkId);
    };
    /**
     * Creates Custom type that will be handled by a specified type handler
     * @param params.handlerId An Id of an type handler which will handle a custom transaction
     * @param params.bytes A custom transaction body
     * @throws Given number for handlerId is invalid for converting it to U64
     */
    Core.prototype.createCustomTransaction = function (params) {
        var handlerId = params.handlerId, bytes = params.bytes;
        checkHandlerId(handlerId);
        checkBytes(bytes);
        var customParam = {
            handlerId: U64_1.U64.ensure(handlerId),
            bytes: bytes
        };
        return new Custom_1.Custom(customParam, this.networkId);
    };
    /**
     * Creates asset's scheme.
     * @param params.metadata Any string that describing the asset. For example,
     * stringified JSON containing properties.
     * @param params.supply Total supply of this asset
     * @param params.approver Platform account or null. If account is present, the
     * tx that includes AssetTransferTransaction of this asset must be signed by
     * the approver account.
     * @param params.administrator Platform account or null. The administrator
     * can transfer the asset without unlocking.
     * @throws Given string for approver is invalid for converting it to paltform account
     * @throws Given string for administrator is invalid for converting it to paltform account
     */
    Core.prototype.createAssetScheme = function (params) {
        var shardId = params.shardId, metadata = params.metadata, supply = params.supply, _a = params.approver, approver = _a === void 0 ? null : _a, _b = params.administrator, administrator = _b === void 0 ? null : _b, _c = params.allowedScriptHashes, allowedScriptHashes = _c === void 0 ? null : _c, _d = params.pool, pool = _d === void 0 ? [] : _d;
        checkShardId(shardId);
        checkMetadata(metadata);
        checkAmount(supply);
        checkApprover(approver);
        checkAdministrator(administrator);
        return new AssetScheme_1.AssetScheme({
            networkId: this.networkId,
            shardId: shardId,
            metadata: metadata,
            supply: U64_1.U64.ensure(supply),
            approver: approver == null ? null : codechain_primitives_1.PlatformAddress.ensure(approver),
            administrator: administrator == null
                ? null
                : codechain_primitives_1.PlatformAddress.ensure(administrator),
            allowedScriptHashes: allowedScriptHashes == null ? [] : allowedScriptHashes,
            pool: pool.map(function (_a) {
                var assetType = _a.assetType, assetQuantity = _a.quantity;
                return ({
                    assetType: H160_1.H160.ensure(assetType),
                    quantity: U64_1.U64.ensure(assetQuantity)
                });
            })
        });
    };
    Core.prototype.createOrder = function (params) {
        var assetTypeFrom = params.assetTypeFrom, assetTypeTo = params.assetTypeTo, _a = params.assetTypeFee, assetTypeFee = _a === void 0 ? H160_1.H160.zero() : _a, shardIdFrom = params.shardIdFrom, shardIdTo = params.shardIdTo, _b = params.shardIdFee, shardIdFee = _b === void 0 ? 0 : _b, assetQuantityFrom = params.assetQuantityFrom, assetQuantityTo = params.assetQuantityTo, _c = params.assetQuantityFee, assetQuantityFee = _c === void 0 ? 0 : _c, originOutputs = params.originOutputs, expiration = params.expiration;
        checkAssetType(assetTypeFrom);
        checkAssetType(assetTypeTo);
        checkAssetType(assetTypeFee);
        checkShardId(shardIdFrom);
        checkShardId(shardIdTo);
        checkShardId(shardIdFee);
        checkAmount(assetQuantityFrom);
        checkAmount(assetQuantityTo);
        checkAmount(assetQuantityFee);
        checkExpiration(expiration);
        var originOutputsConv = [];
        for (var i = 0; i < originOutputs.length; i++) {
            var originOutput = originOutputs[i];
            var tracker = originOutput.tracker, index = originOutput.index, assetType = originOutput.assetType, shardId = originOutput.shardId, quantity = originOutput.quantity, lockScriptHash = originOutput.lockScriptHash, parameters = originOutput.parameters;
            checkAssetOutPoint(originOutput);
            originOutputsConv[i] =
                originOutput instanceof AssetOutPoint_1.AssetOutPoint
                    ? originOutput
                    : new AssetOutPoint_1.AssetOutPoint({
                        tracker: H256_1.H256.ensure(tracker),
                        index: index,
                        assetType: H160_1.H160.ensure(assetType),
                        shardId: shardId,
                        quantity: U64_1.U64.ensure(quantity),
                        lockScriptHash: lockScriptHash
                            ? H160_1.H160.ensure(lockScriptHash)
                            : undefined,
                        parameters: parameters
                    });
        }
        var baseParams = {
            assetTypeFrom: H160_1.H160.ensure(assetTypeFrom),
            assetTypeTo: H160_1.H160.ensure(assetTypeTo),
            assetTypeFee: H160_1.H160.ensure(assetTypeFee),
            shardIdFrom: shardIdFrom,
            shardIdTo: shardIdTo,
            shardIdFee: shardIdFee,
            assetQuantityFrom: U64_1.U64.ensure(assetQuantityFrom),
            assetQuantityTo: U64_1.U64.ensure(assetQuantityTo),
            assetQuantityFee: U64_1.U64.ensure(assetQuantityFee),
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
        var order = params.order, spentQuantity = params.spentQuantity, inputIndices = params.inputIndices, outputIndices = params.outputIndices;
        checkOrder(order);
        checkAmount(spentQuantity);
        checkIndices(inputIndices);
        checkIndices(outputIndices);
        return new OrderOnTransfer_1.OrderOnTransfer({
            order: order,
            spentQuantity: U64_1.U64.ensure(spentQuantity),
            inputIndices: inputIndices,
            outputIndices: outputIndices
        });
    };
    Core.prototype.createMintAssetTransaction = function (params) {
        var scheme = params.scheme, recipient = params.recipient, _a = params.approvals, approvals = _a === void 0 ? [] : _a;
        if (scheme !== null && typeof scheme !== "object") {
            throw Error("Expected scheme param to be either an AssetScheme or an object but found " + scheme);
        }
        var _b = scheme.networkId, networkId = _b === void 0 ? this.networkId : _b, shardId = scheme.shardId, metadata = scheme.metadata, _c = scheme.approver, approver = _c === void 0 ? null : _c, _d = scheme.administrator, administrator = _d === void 0 ? null : _d, _e = scheme.allowedScriptHashes, allowedScriptHashes = _e === void 0 ? null : _e, supply = scheme.supply;
        checkAssetTransferAddressRecipient(recipient);
        checkNetworkId(networkId);
        if (shardId === undefined) {
            throw Error("shardId is undefined");
        }
        checkShardId(shardId);
        checkMetadata(metadata);
        checkApprover(approver);
        checkAdministrator(administrator);
        if (supply != null) {
            checkAmount(supply);
        }
        return new MintAsset_1.MintAsset({
            networkId: networkId,
            shardId: shardId,
            approver: approver == null ? null : codechain_primitives_1.PlatformAddress.ensure(approver),
            administrator: administrator == null
                ? null
                : codechain_primitives_1.PlatformAddress.ensure(administrator),
            allowedScriptHashes: allowedScriptHashes == null ? [] : allowedScriptHashes,
            metadata: metadata,
            output: new AssetMintOutput_1.AssetMintOutput({
                supply: supply == null ? null : U64_1.U64.ensure(supply),
                recipient: codechain_primitives_1.AssetTransferAddress.ensure(recipient)
            }),
            approvals: approvals
        });
    };
    Core.prototype.createChangeAssetSchemeTransaction = function (params) {
        var shardId = params.shardId, assetType = params.assetType, scheme = params.scheme, _a = params.approvals, approvals = _a === void 0 ? [] : _a;
        if (scheme !== null && typeof scheme !== "object") {
            throw Error("Expected scheme param to be either an AssetScheme or an object but found " + scheme);
        }
        var _b = scheme.networkId, networkId = _b === void 0 ? this.networkId : _b, metadata = scheme.metadata, _c = scheme.approver, approver = _c === void 0 ? null : _c, _d = scheme.administrator, administrator = _d === void 0 ? null : _d, _e = scheme.allowedScriptHashes, allowedScriptHashes = _e === void 0 ? null : _e;
        checkNetworkId(networkId);
        checkAssetType(assetType);
        checkMetadata(metadata);
        checkApprover(approver);
        checkAdministrator(administrator);
        return new ChangeAssetScheme_1.ChangeAssetScheme({
            networkId: networkId,
            shardId: shardId,
            assetType: H160_1.H160.ensure(assetType),
            metadata: metadata,
            approver: approver == null ? null : codechain_primitives_1.PlatformAddress.ensure(approver),
            administrator: administrator == null
                ? null
                : codechain_primitives_1.PlatformAddress.ensure(administrator),
            allowedScriptHashes: allowedScriptHashes == null ? [] : allowedScriptHashes,
            approvals: approvals
        });
    };
    Core.prototype.createTransferAssetTransaction = function (params) {
        var _a = params || {}, _b = _a.burns, burns = _b === void 0 ? [] : _b, _c = _a.inputs, inputs = _c === void 0 ? [] : _c, _d = _a.outputs, outputs = _d === void 0 ? [] : _d, _e = _a.orders, orders = _e === void 0 ? [] : _e, _f = _a.networkId, networkId = _f === void 0 ? this.networkId : _f, _g = _a.metadata, metadata = _g === void 0 ? "" : _g, _h = _a.approvals, approvals = _h === void 0 ? [] : _h;
        checkTransferBurns(burns);
        checkTransferInputs(inputs);
        checkTransferOutputs(outputs);
        checkNetworkId(networkId);
        return new TransferAsset_1.TransferAsset({
            burns: burns,
            inputs: inputs,
            outputs: outputs,
            orders: orders,
            networkId: networkId,
            metadata: metadata,
            approvals: approvals
        });
    };
    Core.prototype.createComposeAssetTransaction = function (params) {
        var scheme = params.scheme, inputs = params.inputs, recipient = params.recipient, _a = params.approvals, approvals = _a === void 0 ? [] : _a;
        var _b = scheme.networkId, networkId = _b === void 0 ? this.networkId : _b, shardId = scheme.shardId, metadata = scheme.metadata, _c = scheme.approver, approver = _c === void 0 ? null : _c, _d = scheme.administrator, administrator = _d === void 0 ? null : _d, _e = scheme.allowedScriptHashes, allowedScriptHashes = _e === void 0 ? null : _e, supply = scheme.supply;
        checkTransferInputs(inputs);
        checkAssetTransferAddressRecipient(recipient);
        checkNetworkId(networkId);
        if (shardId === undefined) {
            throw Error("shardId is undefined");
        }
        checkShardId(shardId);
        checkMetadata(metadata);
        checkApprover(approver);
        if (supply != null) {
            checkAmount(supply);
        }
        return new ComposeAsset_1.ComposeAsset({
            networkId: networkId,
            shardId: shardId,
            approver: approver == null ? null : codechain_primitives_1.PlatformAddress.ensure(approver),
            administrator: administrator == null
                ? null
                : codechain_primitives_1.PlatformAddress.ensure(administrator),
            allowedScriptHashes: allowedScriptHashes == null ? [] : allowedScriptHashes,
            metadata: metadata,
            inputs: inputs,
            output: new AssetMintOutput_1.AssetMintOutput({
                recipient: codechain_primitives_1.AssetTransferAddress.ensure(recipient),
                supply: supply == null ? null : U64_1.U64.ensure(supply)
            }),
            approvals: approvals
        });
    };
    Core.prototype.createDecomposeAssetTransaction = function (params) {
        if (params === null ||
            typeof params !== "object" ||
            !("input" in params)) {
            throw Error("Expected the first param of createAssetDecomposeTransaction to be an object containing input param but found " + params);
        }
        var input = params.input, _a = params.outputs, outputs = _a === void 0 ? [] : _a, _b = params.networkId, networkId = _b === void 0 ? this.networkId : _b, _c = params.approvals, approvals = _c === void 0 ? [] : _c;
        checkTransferInput(input);
        checkTransferOutputs(outputs);
        checkNetworkId(networkId);
        return new DecomposeAsset_1.DecomposeAsset({
            input: input,
            outputs: outputs,
            networkId: networkId,
            approvals: approvals
        });
    };
    Core.prototype.createUnwrapCCCTransaction = function (params) {
        var burn = params.burn, _a = params.networkId, networkId = _a === void 0 ? this.networkId : _a;
        checkNetworkId(networkId);
        if (burn instanceof Asset_1.Asset) {
            var burnInput = burn.createTransferInput();
            checkTransferBurns([burnInput]);
            return new UnwrapCCC_1.UnwrapCCC({
                burn: burnInput,
                networkId: networkId
            });
        }
        else {
            checkTransferBurns([burn]);
            return new UnwrapCCC_1.UnwrapCCC({
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
        var tracker = assetOutPoint.tracker, index = assetOutPoint.index, assetType = assetOutPoint.assetType, shardId = assetOutPoint.shardId, quantity = assetOutPoint.quantity, lockScriptHash = assetOutPoint.lockScriptHash, parameters = assetOutPoint.parameters;
        return new AssetTransferInput_1.AssetTransferInput({
            prevOut: assetOutPoint instanceof AssetOutPoint_1.AssetOutPoint
                ? assetOutPoint
                : new AssetOutPoint_1.AssetOutPoint({
                    tracker: H256_1.H256.ensure(tracker),
                    index: index,
                    assetType: H160_1.H160.ensure(assetType),
                    shardId: shardId,
                    quantity: U64_1.U64.ensure(quantity),
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
        var tracker = params.tracker, index = params.index, assetType = params.assetType, shardId = params.shardId, quantity = params.quantity;
        checkTracker(tracker);
        checkIndex(index);
        checkAssetType(assetType);
        checkShardId(shardId);
        checkAmount(quantity);
        return new AssetOutPoint_1.AssetOutPoint({
            tracker: H256_1.H256.ensure(tracker),
            index: index,
            assetType: H160_1.H160.ensure(assetType),
            shardId: shardId,
            quantity: U64_1.U64.ensure(quantity)
        });
    };
    Core.prototype.createAssetTransferOutput = function (params) {
        var assetType = params.assetType, shardId = params.shardId;
        var quantity = U64_1.U64.ensure(params.quantity);
        checkAssetType(assetType);
        checkShardId(shardId);
        checkAmount(quantity);
        if ("recipient" in params) {
            var recipient = params.recipient;
            checkAssetTransferAddressRecipient(recipient);
            return new AssetTransferOutput_1.AssetTransferOutput({
                recipient: codechain_primitives_1.AssetTransferAddress.ensure(recipient),
                assetType: H160_1.H160.ensure(assetType),
                shardId: shardId,
                quantity: quantity
            });
        }
        else if ("lockScriptHash" in params && "parameters" in params) {
            var lockScriptHash = params.lockScriptHash, parameters = params.parameters;
            checkLockScriptHash(lockScriptHash);
            checkParameters(parameters);
            return new AssetTransferOutput_1.AssetTransferOutput({
                lockScriptHash: H160_1.H160.ensure(lockScriptHash),
                parameters: parameters,
                assetType: H160_1.H160.ensure(assetType),
                shardId: shardId,
                quantity: quantity
            });
        }
        else {
            throw Error("Unexpected params: " + params);
        }
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
        // Transaction
        Transaction: Transaction_1.Transaction,
        SignedTransaction: SignedTransaction_1.SignedTransaction,
        // Transaction
        Pay: Pay_1.Pay,
        SetRegularKey: SetRegularKey_1.SetRegularKey,
        CreateShard: CreateShard_1.CreateShard,
        SetShardOwners: SetShardOwners_1.SetShardOwners,
        SetShardUsers: SetShardUsers_1.SetShardUsers,
        WrapCCC: WrapCCC_1.WrapCCC,
        Store: Store_1.Store,
        Remove: Remove_1.Remove,
        Custom: Custom_1.Custom,
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
function checkTracker(value) {
    if (!H256_1.H256.check(value)) {
        throw Error("Expected tracker param to be an H256 value but found " + value);
    }
}
function checkIndex(index) {
    if (typeof index !== "number") {
        throw Error("Expected index param to be a number but found " + index);
    }
}
function checkAssetType(value) {
    if (!H160_1.H160.check(value)) {
        throw Error("Expected assetType param to be an H160 value but found " + value);
    }
}
function checkAssetOutPoint(value) {
    if (value !== null && typeof value !== "object") {
        throw Error("Expected assetOutPoint param to be either an AssetOutPoint or an object but found " + value);
    }
    var tracker = value.tracker, index = value.index, assetType = value.assetType, shardId = value.shardId, quantity = value.quantity, lockScriptHash = value.lockScriptHash, parameters = value.parameters;
    checkTracker(tracker);
    checkIndex(index);
    checkAssetType(assetType);
    checkShardId(shardId);
    checkAmount(quantity);
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
function checkTransactionHash(value) {
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
function checkHandlerId(handlerId) {
    if (typeof handlerId !== "number" ||
        !Number.isInteger(handlerId) ||
        handlerId < 0) {
        throw Error("Expected handlerId param to be a non-negative number value but found " + handlerId);
    }
}
function checkBytes(bytes) {
    if (!(bytes instanceof Buffer)) {
        throw Error("Expected bytes param to be an instance of Buffer but found " + bytes);
    }
}
