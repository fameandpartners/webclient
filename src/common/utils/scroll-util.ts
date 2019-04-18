export function scrollSmoothlyTo(top: number) {
    if (!document || !document.documentElement) {
        return;
    }

    const isSmoothScrollSupported = 'scrollBehavior' in document!.documentElement!.style;

    if (isSmoothScrollSupported) {
        window.scrollTo({top, behavior: 'smooth'});
    } else {
        window.scrollTo(top, 0);
    }
}