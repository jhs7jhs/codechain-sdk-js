import { AssetTransferAddress, PlatformAddress } from "codechain-primitives";
import { AssetTransferInput, Order, SignedTransaction, Transaction, U64, UnwrapCCC } from "../core/classes";
import { AssetTransaction } from "../core/Transaction";
import { ComposeAsset } from "../core/transaction/ComposeAsset";
import { DecomposeAsset } from "../core/transaction/DecomposeAsset";
import { TransferAsset } from "../core/transaction/TransferAsset";
import { NetworkId } from "../core/types";
import { SignatureTag } from "../utils";
import { KeyStore } from "./KeyStore";
import { LocalKeyStore } from "./LocalKeyStore";
import { P2PKH } from "./P2PKH";
import { P2PKHBurn } from "./P2PKHBurn";
import { RemoteKeyStore } from "./RemoteKeyStore";
export declare type KeyStoreType = "local" | "memory" | {
    type: "remote";
    url: string;
} | {
    type: "local";
    path: string;
};
export declare class Key {
    static classes: {
        RemoteKeyStore: typeof RemoteKeyStore;
        LocalKeyStore: typeof LocalKeyStore;
    };
    classes: {
        RemoteKeyStore: typeof RemoteKeyStore;
        LocalKeyStore: typeof LocalKeyStore;
    };
    private networkId;
    private keyStore;
    private keyStoreType;
    constructor(options: {
        networkId: NetworkId;
        keyStoreType: KeyStoreType;
    });
    /**
     * Creates persistent key store
     * @param keystoreURL key store url (ex http://localhost:7007)
     */
    createRemoteKeyStore(keystoreURL: string): Promise<KeyStore>;
    /**
     * Creates persistent key store which stores data in the filesystem.
     * @param dbPath A keystore file path
     */
    createLocalKeyStore(dbPath?: string): Promise<KeyStore>;
    /**
     * Creates a new platform address
     * @param params.keyStore A key store.
     * @returns A new platform address
     */
    createPlatformAddress(params?: {
        keyStore?: KeyStore;
        passphrase?: string;
    }): Promise<PlatformAddress>;
    /**
     * Creates a new asset transfer address
     * @param params.type The type of AssetTransferAddress. The default value is "P2PKH".
     * @param params.keyStore A key store.
     * @returns A new platform address
     */
    createAssetTransferAddress(params?: {
        type?: "P2PKH" | "P2PKHBurn";
        keyStore?: KeyStore;
        passphrase?: string;
    }): Promise<AssetTransferAddress>;
    /**
     * Creates P2PKH script generator.
     * @returns new instance of P2PKH
     */
    createP2PKH(params: {
        keyStore: KeyStore;
    }): P2PKH;
    /**
     * Creates P2PKHBurn script generator.
     * @returns new instance of P2PKHBurn
     */
    createP2PKHBurn(params: {
        keyStore: KeyStore;
    }): P2PKHBurn;
    /**
     * Approves the transaction
     * @param transaction A transaction
     * @param params
     * @param params.keyStore A key store.
     * @param params.account An account.
     * @param params.passphrase The passphrase for the given account
     * @returns An approval
     */
    approveTransaction(transaction: AssetTransaction, params: {
        keyStore?: KeyStore;
        account: PlatformAddress | string;
        passphrase?: string;
    }): Promise<string>;
    /**
     * Signs a Transaction with the given account.
     * @param tx A Transaction
     * @param params.keyStore A key store.
     * @param params.account An account.
     * @param params.passphrase The passphrase for the given account
     * @returns A SignedTransaction
     * @throws When seq or fee in the Transaction is null
     * @throws When account or its passphrase is invalid
     */
    signTransaction(tx: Transaction, params: {
        keyStore?: KeyStore;
        account: PlatformAddress | string;
        passphrase?: string;
        fee: U64 | string | number;
        seq: number;
    }): Promise<SignedTransaction>;
    /**
     * Signs a transaction's input with a given key store.
     * @param tx An TransferAsset.
     * @param index The index of an input to sign.
     * @param params.keyStore A key store.
     * @param params.passphrase The passphrase for the given input.
     */
    signTransactionInput(tx: TransferAsset | ComposeAsset | DecomposeAsset, index: number, params?: {
        keyStore?: KeyStore;
        passphrase?: string;
        signatureTag?: SignatureTag;
    }): Promise<void>;
    /**
     * Signs a transaction's input with an order.
     * @param input An AssetTransferInput.
     * @param order An order to be used as a signature message.
     * @param params.keyStore A key store.
     * @param params.passphrase The passphrase for the given input.
     */
    signTransactionInputWithOrder(input: AssetTransferInput, order: Order, params?: {
        keyStore?: KeyStore;
        passphrase?: string;
    }): Promise<void>;
    /**
     * Signs a transaction's burn with a given key store.
     * @param tx An TransferAsset.
     * @param index The index of a burn to sign.
     * @param params.keyStore A key store.
     * @param params.passphrase The passphrase for the given burn.
     */
    signTransactionBurn(tx: TransferAsset | UnwrapCCC, index: number, params?: {
        keyStore?: KeyStore;
        passphrase?: string;
        signatureTag?: SignatureTag;
    }): Promise<void>;
    private ensureKeyStore;
}
