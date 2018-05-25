import { H256, H160, Parcel, U256 } from ".";

export interface BlockValues {
    parentHash: H256;
    timestamp: number;
    number: number;
    author: H160;
    extraData: Buffer;
    parcelsRoot: H256;
    stateRoot: H256;
    invoicesRoot: H256;
    score: U256;
    seal: Buffer[];
    hash: H256;
    parcels: Parcel[];
}

export class Block {
    parentHash: H256;
    timestamp: number;
    number: number;
    author: H160;
    extraData: Buffer;
    parcelsRoot: H256;
    stateRoot: H256;
    invoicesRoot: H256;
    score: U256;
    seal: Buffer[];
    hash: H256;
    parcels: Parcel[];

    constructor(data: BlockValues) {
        const { parentHash, timestamp, number, author, extraData,
            parcelsRoot, stateRoot, invoicesRoot, score, seal, hash, parcels } = data;
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

    static fromJSON(data: any) {
        const { parentHash, timestamp, number, author, extraData,
            parcelsRoot, stateRoot, invoicesRoot, score, seal, hash, parcels } = data;
        return new this({
            parentHash: new H256(parentHash),
            timestamp,
            number,
            author: new H160(author),
            extraData,
            parcelsRoot: new H256(parcelsRoot),
            stateRoot: new H256(stateRoot),
            invoicesRoot: new H256(invoicesRoot),
            score: new U256(score),
            seal,
            hash: new H256(hash),
            parcels: parcels.map((p: any) => Parcel.fromJSON(p))
        });
    }

    toJSON() {
        const { parentHash, timestamp, number, author, extraData,
            parcelsRoot, stateRoot, invoicesRoot, score, seal, hash, parcels } = this;
        return {
            parentHash: parentHash.value,
            timestamp,
            number,
            author: author.value,
            extraData,
            parcelsRoot: parcelsRoot.value,
            stateRoot: stateRoot.value,
            invoicesRoot: invoicesRoot.value,
            score: score.value.toString(),
            seal,
            hash: hash.value,
            parcels: parcels.map(p => p.toJSON()),
        };
    }
}
