import { blake256, signEcdsa } from "../utils";
import { H256 } from "./H256";
import { SignedTransaction } from "./SignedTransaction";
import { NetworkId } from "./types";
import { U64 } from "./U64";

const RLP = require("rlp");

export interface AssetTransaction {
    tracker(): H256;
}

/**
 * A unit that collects transaction and requests processing to the network. A parsel signer pays for CCC processing fees.
 *
 * - The fee must be at least 10. The higher the fee, the higher the priority for the tx to be processed.
 * - It contains the network ID. This must be identical to the network ID to which the tx is being sent to.
 * - Its seq must be identical to the seq of the account that will sign the tx.
 * - It contains the transaction to process. After signing the Transaction's size must not exceed 1 MB.
 * - After signing with the sign() function, it can be sent to the network.
 */
export abstract class Transaction {
    private _seq: number | null;
    private _fee: U64 | null;
    private readonly _networkId: NetworkId;
    private _expiration: number | null;

    protected constructor(networkId: NetworkId) {
        this._seq = null;
        this._fee = null;
        this._networkId = networkId;
        this._expiration = null;
    }

    public seq(): number | null {
        return this._seq;
    }

    public fee(): U64 | null {
        return this._fee;
    }

    public expiration(): number | null {
        return this._expiration;
    }

    public setSeq(seq: number) {
        this._seq = seq;
    }

    public setFee(fee: U64 | string | number) {
        this._fee = U64.ensure(fee);
    }

    public setExpiration(expiration: number) {
        this._expiration = expiration;
    }

    public networkId(): NetworkId {
        return this._networkId;
    }

    public toEncodeObject(): any[] {
        const [seq, fee, networkId] = [
            this._seq,
            this._fee,
            this._networkId,
            this._expiration
        ];
        if (seq == null || !fee) {
            throw Error("Seq and fee in the tx must be present");
        }

        let expiration: number[] = [];
        if (this._expiration != null) {
            expiration = [this._expiration];
        }
        return [
            seq,
            fee.toEncodeObject(),
            networkId,
            expiration,
            this.actionToEncodeObject()
        ];
    }

    public rlpBytes(): Buffer {
        return RLP.encode(this.toEncodeObject());
    }

    public hash(): H256 {
        return new H256(blake256(this.rlpBytes()));
    }

    public sign(params: {
        secret: H256 | string;
        seq: number;
        fee: U64 | string | number;
    }): SignedTransaction {
        const { secret, seq, fee } = params;
        if (this._seq !== null) {
            throw Error("The tx seq is already set");
        }
        this._seq = seq;
        if (this._fee !== null) {
            throw Error("The tx fee is already set");
        }
        this._fee = U64.ensure(fee);
        const { r, s, v } = signEcdsa(
            this.hash().value,
            H256.ensure(secret).value
        );
        const sig = SignedTransaction.convertRsvToSignatureString({ r, s, v });
        return new SignedTransaction(this, sig);
    }

    public toJSON() {
        const seq = this._seq;
        const fee = this._fee;
        const networkId = this._networkId;
        const expiration = this._expiration;
        if (!fee) {
            throw Error("Transaction must have the fee");
        }
        const action = this.actionToJSON();
        action.type = this.type();
        const result: any = {
            fee: fee.toJSON(),
            networkId,
            action,
            expiration
        };
        if (seq != null) {
            result.seq = seq;
        }
        return result;
    }

    public abstract type(): string;

    protected abstract actionToJSON(): any;
    protected abstract actionToEncodeObject(): any[];
}
