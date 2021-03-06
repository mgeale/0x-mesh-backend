import { BigNumber } from '@0x/mesh-rpc-client';
import { assetDataUtils, MultiAssetData } from '@0x/order-utils';

export interface DecodeAssetData {
    assetProxyId: string;
    tokenAddress?: string;
    amounts?: BigNumber[];
    tokenId?: BigNumber;
}

export function decodeAssetData(encodedAssetData: string): DecodeAssetData {
    const decodedAssetData = assetDataUtils.decodeAssetDataOrThrow(encodedAssetData);

    if (assetDataUtils.isMultiAssetData(decodedAssetData)) {
        return reformatMultiAssetData(decodedAssetData);
    } else {
        return decodedAssetData;
    }
}

function reformatMultiAssetData(multiAssetData: MultiAssetData): DecodeAssetData {
    const assets = multiAssetData.nestedAssetData;
    const result = [];
    for (let i = 0; i < assets.length; i++) {
        const assetData = decodeAssetData(assets[i]);
        result.push({
            tokenAddress: assetData.tokenAddress,
            amounts: multiAssetData.amounts[i]
        });
    }
    const sorted = result.sort((a, b) =>
        a.tokenAddress > b.tokenAddress ? 1 : b.tokenAddress > a.tokenAddress ? -1 : 0
    );
    const amounts = sorted.map(r => r.amounts);
    const addresses = sorted.map(r => r.tokenAddress).join('+');
    return {
        assetProxyId: multiAssetData.assetProxyId,
        tokenAddress: addresses,
        amounts
    };
}
