/* tslint:disable no-bitwise */

export function luminanceFromHex(hexStr: string) {
    const cleanHexStr = hexStr.length === 7 ? hexStr.substring(1) : hexStr;
    const rgb = parseInt(cleanHexStr, 16); // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff; // bitwise extract red
    const g = (rgb >> 8) & 0xff; // bitwise extract green
    const b = (rgb >> 0) & 0xff; // bitwise extract blue
    return 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
}

export function isDarkLuminance(hexValue: string) {
    return luminanceFromHex(hexValue) < 60;
}

export function isExtremeLightLuminance(hexValue: string) {
    return luminanceFromHex(hexValue) > 240;
}

export function isNormalLightLuminance(hexValue: string) {
    return luminanceFromHex(hexValue) > 200;
}

export function separateHexColorsInString(hexStr: string) {
    const hexStringClean = hexStr === null ? '' : hexStr;
    const rexi = /#(\w+)(?!\w)/g;
    return hexStringClean.match(rexi);
}

export function getColorOrFabricStyle(imageUrl: string | null | undefined, hex?: string) {
    if (imageUrl) {
        // Images always take priority
        return {
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'contain',
            backgroundColor: hex,
        };
    } else {
        // If we don't have an image, we should check for duo tone then fallback to just hex
        if (hex) {
            const hexValArr = separateHexColorsInString(hex);
            if (Array.isArray(hexValArr) && hexValArr.length === 2) {
                const start = hexValArr[0];
                const end = hexValArr[1];
                return {
                    background: `linear-gradient(45deg, ${end} 0%, ${end} 50%, ${start} 51%, ${start} 100%)`
                };
            }

            return {
                backgroundColor: hex,
                border: '1px solid transparent',
                borderColor: hex && isExtremeLightLuminance(hex) ? '#9a9a9a' : 'transparent'
            };
        }
    }
    return {};
}

/* tslint:enable no-bitwise */
