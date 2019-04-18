export function isBrowser() {
    return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

export function isNode() {
    return !isBrowser();
}