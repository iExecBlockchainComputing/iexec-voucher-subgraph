import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '../networks.json');

// Get env variables
const { NETWORK_NAME, VOUCHER_HUB_ADDRESS, VOUCHER_HUB_START_BLOCK } = process.env;

async function updateNetworks() {
    if (!NETWORK_NAME || !VOUCHER_HUB_ADDRESS || !VOUCHER_HUB_START_BLOCK) {
        console.log(
            'Missing environment variables: NETWORK_NAME, VOUCHER_HUB_ADDRESS, VOUCHER_HUB_START_BLOCK',
        );
        // Do not exit with error code as Environment variables are not mandatory
        process.exit(0);
    }
    const data = await readFile(filePath, 'utf-8');
    const json = JSON.parse(data);

    json[NETWORK_NAME] = {
        VoucherHub: {
            address: VOUCHER_HUB_ADDRESS,
            startBlock: parseInt(VOUCHER_HUB_START_BLOCK, 10),
        },
    };

    await writeFile(filePath, JSON.stringify(json, null, 2));
    console.log(`✅ Network "${NETWORK_NAME}" added to networks.json`);
}

updateNetworks().catch((err) => {
    console.error('❌ Failed to update networks:', err);
});
