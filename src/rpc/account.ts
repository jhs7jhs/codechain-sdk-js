import { H160, H256 } from "../core/classes";
import { PlatformAddress } from "../key/classes";

import { Rpc } from ".";

export class AccountRpc {
    private rpc: Rpc;

    /**
     * @hidden
     */
    constructor(rpc: Rpc) {
        this.rpc = rpc;
    }

    /**
     * Gets a list of accounts.
     * @returns A list of accounts
     */
    getList(): Promise<string[]> {
        return this.rpc.sendRpcRequest("account_getList", [])
            .then((accounts: string[]) => {
                return accounts.map(account => PlatformAddress.fromAccountId(account).toString());
            });
    }

    /**
     * Creates a new account.
     * @param passphrase A passphrase to be used by the account owner
     * @returns An account
     */
    create(passphrase?: string): Promise<string> {
        return this.rpc.sendRpcRequest("account_create", [
            passphrase
        ]).then(account => PlatformAddress.fromAccountId(account).toString());
    }

    /**
     * Imports a secret key and add the corresponding account.
     * @param secret H256 or hexstring for 256-bit private key
     * @param passphrase A passphrase to be used by the account owner
     * @returns The account
     */
    importRaw(secret: H256 | string, passphrase?: string): Promise<string> {
        return this.rpc.sendRpcRequest("account_importRaw", [
            `0x${H256.ensure(secret).value}`,
            passphrase
        ]).then(account => PlatformAddress.fromAccountId(account).toString());
    }

    /**
     * Removes the account.
     * @param address A platform address
     * @param passphrase The account's passphrase
     */
    remove(address: PlatformAddress | H160 | string, passphrase?: string): Promise<void> {
        const account = PlatformAddress.ensureAccount(address);
        return this.rpc.sendRpcRequest("account_remove", [
            `0x${account.value}`,
            passphrase
        ]);
    }

    /**
     * Calculates the account's signature for a given message.
     * @param messageDigest A message to sign
     * @param address A platform address
     * @param passphrase The account's passphrase
     */
    sign(messageDigest: H256 | string, address: PlatformAddress | H160 | string, passphrase?: string): Promise<string> {
        const account = PlatformAddress.ensureAccount(address);
        return this.rpc.sendRpcRequest("account_sign", [
            `0x${H256.ensure(messageDigest).value}`,
            `0x${account.value}`,
            passphrase
        ]);
    }
}
