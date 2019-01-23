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
    const shardId = 0;
    const aliceAddress = await sdk.key.createAssetTransferAddress();
    const bobAddress = "tcaqyqckq0zgdxgpck6tjdg4qmp52p2vx3qaexqnegylk";

    // Create asset named Gold. Total supply of Gold is 10000. The approver is set
    // to null, which means this type of asset can be transferred freely.
    const goldAssetScheme = sdk.core.createAssetScheme({
        shardId,
        metadata: JSON.stringify({
            name: "Gold",
            description: "An asset example",
            icon_url: "https://gold.image/"
        }),
        supply: 10000,
        approver: null
    });
    const mintTx = sdk.core.createMintAssetTransaction({
        scheme: goldAssetScheme,
        recipient: aliceAddress
    });

    const firstGold = mintTx.getMintedAsset();
    const transferTx = sdk.core
        .createTransferAssetTransaction()
        .addInputs(firstGold)
        .addOutputs(
            {
                recipient: bobAddress,
                quantity: 3000,
                assetType: firstGold.assetType,
                shardId
            },
            {
                recipient: aliceAddress,
                quantity: 7000,
                assetType: firstGold.assetType,
                shardId
            }
        );
    await sdk.key.signTransactionInput(transferTx, 0);

    await sdk.rpc.chain.sendTransaction(mintTx, {
        account: ACCOUNT_ADDRESS,
        passphrase: ACCOUNT_PASSPHRASE
    });
    await sdk.rpc.chain.sendTransaction(transferTx, {
        account: ACCOUNT_ADDRESS,
        passphrase: ACCOUNT_PASSPHRASE
    });

    const mintTxInvoices = await sdk.rpc.chain.getInvoicesByTracker(
        mintTx.tracker(),
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
    const transferTxInvoices = await sdk.rpc.chain.getInvoicesByTracker(
        transferTx.tracker(),
        {
            timeout: 300 * 1000
        }
    );
    if (!transferTxInvoices[0].success) {
        throw Error(
            `AssetTransferTransaction failed: ${JSON.stringify(
                transferTxInvoices[0].error
            )}`
        );
    }

    // Unspent Bob's 3000 golds
    console.log(await sdk.rpc.chain.getAsset(transferTx.tracker(), 0, shardId));
    // Unspent Alice's 7000 golds
    console.log(await sdk.rpc.chain.getAsset(transferTx.tracker(), 1, shardId));
})().catch(err => {
    console.error(`Error:`, err);
});
