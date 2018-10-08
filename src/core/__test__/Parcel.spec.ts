import { PlatformAddress } from "codechain-primitives";

import { H256 } from "../H256";
import { U256 } from "../U256";
import { Parcel } from "../Parcel";

test("rlp", () => {
    const t = Parcel.transactions("tc");
    t.setFee(0);
    t.setNonce(0);
    expect(t.rlpBytes()).toEqual(
        Buffer.from([
            248,
            81,
            128,
            128,
            130,
            116,
            99,
            248,
            74,
            1,
            192,
            248,
            69,
            248,
            67,
            128,
            160,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            160,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            192
        ])
    );
});

test("hash", () => {
    const t = Parcel.transactions("tc");
    t.setFee(0);
    t.setNonce(0);
    expect(t.hash()).toEqual(
        new H256(
            "cc946ae0cc8226c5a8db992d840c5f6bcb22dd2ea91dea994a334b67b325b1a0"
        )
    );
});

test("sign", () => {
    const t = Parcel.transactions("tc");
    const signed = t.sign({
        secret:
            "ede1d4ccb4ec9a8bbbae9a13db3f4a7b56ea04189be86ac3a6a439d9a0a1addd",
        nonce: 0,
        fee: 0
    });
    const { r, s } = signed.signature();
    expect(r.toEncodeObject()).toEqual(
        new U256(
            "0x8e1718666082bad693c4a899da5aa09e074f9af76f6ebfe56603c4162cb54cda"
        ).toEncodeObject()
    );
    expect(s.toEncodeObject()).toEqual(
        new U256(
            "0x70f06caa391551fd8991a45674ef7cbf7e68a616f3d60eac5196470a06cdab0e"
        ).toEncodeObject()
    );
});

test("signed hash", () => {
    const t = Parcel.transactions("tc");
    const signed = t.sign({
        secret:
            "ede1d4ccb4ec9a8bbbae9a13db3f4a7b56ea04189be86ac3a6a439d9a0a1addd",
        nonce: 0,
        fee: 0
    });
    expect(signed.hash()).toEqual(
        new H256(
            "24d358b15c933477d45938afc933d040a0297516c8347a72adcc652bcf23a324"
        )
    );
});

test("toJSON", () => {
    const p = Parcel.payment(
        "tc",
        PlatformAddress.fromAccountId(
            "0x0000000000000000000000000000000000000000"
        ),
        new U256(11)
    );
    p.setFee(33);
    p.setNonce(44);
    expect(Parcel.fromJSON(p.toJSON())).toEqual(p);
});
