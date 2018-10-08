import {
    signSchnorr,
    verifySchnorr,
    recoverSchnorr,
    getPublicFromPrivate
} from "../utils";

const priv = "99053a6568a93b9f194ef983c84ddfa9eb2b37888e47433558d40b2f4770b2d8";
const msg = "00000000c0dec6a100000000c0dec6a100000000c0dec6a100000000c0dec6a1";

test("public key", () => {
    const pub = getPublicFromPrivate(priv);
    expect(pub.length).toBe(128);
});

test("sign", () => {
    const signature = signSchnorr(msg, priv);
    expect(signature).toEqual({
        r: "d8706a863775325b1b8c3f16c19ff337c2699c4f857be903e08a5a9234c5a5c7",
        s: "14692567c1d9e0c3eed5de125cb882c33b74d447c08a2db5db24283df7741815"
    });
});

test("verify - success", () => {
    const result = verifySchnorr(
        msg,
        {
            r:
                "d8706a863775325b1b8c3f16c19ff337c2699c4f857be903e08a5a9234c5a5c7",
            s:
                "14692567c1d9e0c3eed5de125cb882c33b74d447c08a2db5db24283df7741815"
        },
        getPublicFromPrivate(priv)
    );
    expect(result).toBe(true);
});

test("verify - fail", () => {
    const result = verifySchnorr(
        "0000000000000000000000000000000000000000000000000000000000000000",
        {
            r:
                "d8706a863775325b1b8c3f16c19ff337c2699c4f857be903e08a5a9234c5a5c7",
            s:
                "14692567c1d9e0c3eed5de125cb882c33b74d447c08a2db5db24283df7741815"
        },
        getPublicFromPrivate(priv)
    );
    expect(result).toBe(false);
});

test("recover", () => {
    const a = recoverSchnorr(msg, {
        r: "d8706a863775325b1b8c3f16c19ff337c2699c4f857be903e08a5a9234c5a5c7",
        s: "14692567c1d9e0c3eed5de125cb882c33b74d447c08a2db5db24283df7741815"
    });
    expect(a).toBe(getPublicFromPrivate(priv));
});
