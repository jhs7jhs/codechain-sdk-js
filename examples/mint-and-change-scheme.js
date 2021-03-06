const SDK = require("codechain-sdk");

const sdk = new SDK({
    server: process.env.CODECHAIN_RPC_HTTP || "http://localhost:8080",
    networkId: process.env.CODECHAIN_NETWORK_ID || "tc"
});

const ACCOUNT_ADDRESS =
    process.env.ACCOUNT_ADDRESS ||
    "tccq9h7vnl68frvqapzv3tujrxtxtwqdnxw6yamrrgd";
const ACCOUNT_PASSPHRASE = process.env.ACCOUNT_PASSPHRASE || "satoshi";

(async () => {
    const aliceAddress = await sdk.key.createAssetTransferAddress();
    const bobAddress = "tcaqyqckq0zgdxgpck6tjdg4qmp52p2vx3qaexqnegylk";
    const carolAddress = "tccq9qvruafmf9vegjhkl0ruunkwp0d4lc8fgxknzh5";

    // Create asset named Gold. Total amount of Gold is 10000. The approver is set
    // to null, which means this type of asset can be transferred freely.
    const goldAssetScheme = sdk.core.createAssetScheme({
        shardId: 0,
        metadata: JSON.stringify({
            name: "Gold",
            description: "An asset example",
            icon_url: "https://gold.image/"
        }),
        amount: 10000,
        administrator: ACCOUNT_ADDRESS
    });
    const mintTx = sdk.core.createAssetMintTransaction({
        scheme: goldAssetScheme,
        recipient: aliceAddress
    });

    const mintParcel = sdk.core.createAssetTransactionParcel({
        transaction: mintTx
    });

    await sdk.rpc.chain.sendParcel(mintParcel, {
        account: ACCOUNT_ADDRESS,
        passphrase: ACCOUNT_PASSPHRASE
    });

    const mintTxInvoices = await sdk.rpc.chain.getTransactionInvoices(
        mintTx.hash(),
        {
            timeout: 300 * 1000
        }
    );
    if (!mintTxInvoices[0].success) {
        throw Error(
            `AssetMintTransaction failed: ${JSON.stringify(
                mintTxInvoices[0].error
            )}`
        );
    }

    const assetSchemeChangeTx = sdk.core.createAssetSchemeChangeTransaction({
        assetType: mintTx.getMintedAsset().assetType,
        scheme: {
            metadata: JSON.stringify({
                name: "Golden Coin",
                description: "An asset example",
                icon_url: "https://gold.image/"
            }),
            approver: bobAddress,
            administrator: carolAddress
        }
    });

    const assetSchemeChangeParcel = sdk.core.createAssetTransactionParcel({
        transaction: assetSchemeChangeTx
    });
    await sdk.rpc.chain.sendParcel(assetSchemeChangeParcel, {
        account: ACCOUNT_ADDRESS,
        passphrase: ACCOUNT_PASSPHRASE
    });

    const assetSchemeChangeTxInvoices = await sdk.rpc.chain.getTransactionInvoices(
        assetSchemeChangeTx.hash(),
        {
            timeout: 300 * 1000
        }
    );
    if (!assetSchemeChangeTxInvoices[0].success) {
        throw Error(
            `AssetSchemeChange failed: ${JSON.stringify(
                assetSchemeChangeTxInvoices[0].error
            )}`
        );
    }

    console.log(await sdk.rpc.chain.getAssetSchemeByHash(mintTx.hash(), 0));
    console.log(
        await sdk.rpc.chain.getAssetSchemeByType(
            mintTx.getMintedAsset().assetType
        )
    );
})().catch(err => {
    console.error(`Error:`, err);
});
