import { AccountRpc } from "./account";
import { ChainRpc } from "./chain";
import { DevelRpc } from "./devel";
import { EngineRpc } from "./engine";
import { NetworkRpc } from "./network";
import { NodeRpc } from "./node";
export declare class Rpc {
    /**
     * RPC module for retrieving the node info.
     */
    node: NodeRpc;
    /**
     * RPC module for accessing the blockchain.
     */
    chain: ChainRpc;
    /**
     * RPC module for configuring P2P networking of the node.
     */
    network: NetworkRpc;
    /**
     * RPC module for account management and signing
     */
    account: AccountRpc;
    /**
     * RPC module for retrieving the engine info.
     */
    engine: EngineRpc;
    /**
     * RPC module for developer functions
     */
    devel: DevelRpc;
    private client;
    /**
     * @param params.server HTTP RPC server address.
     * @param params.options.transactionSigner The default account to sign the tx
     * @param params.options.transactionFee The default quantity for the tx fee
     */
    constructor(params: {
        server: string;
        options?: {
            transactionSigner?: string;
            transactionFee?: number;
        };
    });
    sendRpcRequest: (name: string, params: any[]) => Promise<any>;
}
