
import { ImageSizeType } from '@common/utils/image-size-type';
import { OrientationType } from '@common/utils/orientation-type';
import { getRelevantComponents, mapToCode } from '@common/utils/product';
import { DEFAULT_SITE_VERSION, RENDER_GALLERY_IMAGE_SIZES } from '@common/constants';
import { ZoomType } from '@common/utils/zoom-type';
import { PreviewType } from '@common/utils/preview-type';
import { ComponentType } from '@common/utils/component-type';
import { URL_COMPONENT_SEPARATOR } from '@common/utils/url-helper';
import { Component, CustomizedProduct, ProductMedia, ProductListSummaries, ProductListSummary, OrderCustomizedProduct, OrderComponent } from 'typings';
import { RenderPositionId } from '@common/utils/render-position-id';

export function formatCustomizationIds(customizations: string[]) {
    return customizations
        .uniqueMap()
        .sort((a, b) => a.localeCompare(b))
        .join(URL_COMPONENT_SEPARATOR);
}
export function formatProductId(customisedProduct: CustomizedProduct|OrderCustomizedProduct): string {
    const codes = (customisedProduct.components as Array<OrderComponent|Component>)
        .filter((c) => c.componentTypeCategory !== ComponentType.Size)
        .map((c) => c.code);
    const customisationString = formatCustomizationIds(codes);
    return `${customisedProduct.product.productId}~${customisationString}`;
}

export function formatRenderName(productId: string, customizations: string[], renderPositionId: RenderPositionId, size: ImageSizeType) {
    return `${productId}/${renderPositionId.toString()}/${size}/${formatCustomizationIds(customizations)}.png`;
}

export function extractSizeFromUrl(url: string) {
    const re = /([0-9]+)x(?=[0-9]+)/;
    const match = url.match(re);
    if (match) {
        return parseInt(match[0], 10);
    }

    return 0;
}

export function convertToProductMedia(url: string, width: number, height: number): ProductMedia {
    // To cover for potential data issues
    if (!url) {
        return {
            type: 'photo',
            src: [{
                url: '',
                width,
                height,
            }],
            options: [],
            sortOrder: 0,
        };
    }

    const fullUrl = url.startsWith('http') || url.startsWith('//') ? url : `${global.__FAME_CONFIG__.URLS[DEFAULT_SITE_VERSION].renderUrl}/${url}`;
    const fullUrlFallback = url.startsWith('http') || url.startsWith('//') ? url : `${global.__FAME_CONFIG__.URLS[DEFAULT_SITE_VERSION].renderFallbackUrl}/${url}`;

    return {
        type: 'photo',
        src: [{
            url: fullUrl,
            fallbackUrl: fullUrlFallback,
            width: width === 0 ? extractSizeFromUrl(fullUrl) : width,
            height: height === 0 ? extractSizeFromUrl(fullUrl) : height,
        }],
        options: [],
        sortOrder: 0,
    };
}
export function getMainImageUrlForRender(customizedProduct: CustomizedProduct, orientation: OrientationType, zoom: ZoomType, sizes: ImageSizeType[]): ProductMedia {
    return getRenderImage({
        relatedRenderSections: customizedProduct.product.productRenderComponents,
        customizedProduct,
        sizes,
        renderPositionId: orientation === OrientationType.Front ? RenderPositionId.FrontNone : RenderPositionId.BackNone,
    });
}

export function getComponentImageUrlsForRender(component: Component, customizedProduct: CustomizedProduct, sizes: ImageSizeType[]): ProductMedia|null {
    if (!component.renderPositionId) {
        if (!component.meta.image) {
            return null;
        }

        const { url, width, height } = component.meta.image;
        return convertToProductMedia(url, width, height);
    }

    return getRenderImage({
        relatedRenderSections: component.optionRenderComponents,
        additionalComponent: component,
        customizedProduct,
        sizes,
        renderPositionId: component.renderPositionId
    });
}

function getRenderImage({
    relatedRenderSections,
    additionalComponent,
    customizedProduct,
    sizes,
    renderPositionId
}: {
    relatedRenderSections?: string[],
    additionalComponent?: Component,
    customizedProduct: CustomizedProduct,
    sizes: ImageSizeType[],
    renderPositionId: RenderPositionId
}): ProductMedia {
    // Get default components for customization
    // Because the options are the thing that tells us what the parents are we need to scan that in order to see what sections are still compatible then check the incompatible list
    const relevantSelectedComponents = getRelevantComponents({ product: customizedProduct.product, selectedComponents: customizedProduct.components, additionalComponent });

    const relevantComponents = relatedRenderSections
        ? relevantSelectedComponents
            .filter((x) => relatedRenderSections.includes(x.componentTypeId))
            .map(mapToCode)
        : [];

    if (additionalComponent && !relevantComponents.includes(additionalComponent.code)) {
        relevantComponents.push(additionalComponent.code);
    }

    return getRenderImageForPid({
        productId: customizedProduct.product.productId,
        renderPositionId,
        components: relevantComponents,
        sizes,
        productVersionId: customizedProduct.product.productVersionId,
    });
}

export function getFallbackMedia({
    productId,
    components,
    sizes,
    renderPositionId,
    productVersionId,
}: {
    productId: string,
    components: string[],
    sizes: ImageSizeType[],
    renderPositionId: RenderPositionId,
    productVersionId?: number,
}) {
    // TODO: use siteversion from props
    const baseUrl = global.__FAME_CONFIG__.URLS[DEFAULT_SITE_VERSION].renderUrl;
    const fallbackUrl = global.__FAME_CONFIG__.URLS[DEFAULT_SITE_VERSION].renderFallbackUrl;

    return sizes.map((size) => {
        const renderName = formatRenderName(productId, components, renderPositionId, size);
        const sizeComponents = size.split('x');
        return {
            url: `${baseUrl}/${renderName}${productVersionId !== undefined ? `?pvid=${productVersionId}` : ''}`,
            fallbackUrl: `${fallbackUrl}/${renderName}`,
            width: parseInt(sizeComponents[0], 10),
            height: parseInt(sizeComponents[1], 10),
        };
    });
}

export function getRenderImageForPid({
    productId,
    components,
    sizes,
    renderPositionId,
    productVersionId,
}: {
    productId: string,
    components: string[],
    sizes: ImageSizeType[],
    renderPositionId: RenderPositionId,
    productVersionId?: number,
}): ProductMedia {
    return {
        type: 'photo',
        src: getFallbackMedia({
            productId,
            components,
            sizes,
            renderPositionId,
            productVersionId
        }),
        options: [],
        sortOrder: 0,
    };
}

export function findImage(customizedProduct: CustomizedProduct, orientation: OrientationType = OrientationType.Front): ProductMedia {
    if (customizedProduct.product.previewType === PreviewType.Render) {
        return getMainImageUrlForRender(customizedProduct, orientation, ZoomType.None, [ImageSizeType.Option2816, ImageSizeType.Option1408, ImageSizeType.Option1056]);
    } else {
        const images = findImages(customizedProduct);
        return images[0];
    }
}

export function findImages(customizedProduct: CustomizedProduct, productListSummary?: ProductListSummary|null, onlyMatches: boolean = false): ProductMedia[] {
    if (productListSummary) {
        const summaryHasCurations = productListSummary.media && productListSummary.media.length > 0;
        if (summaryHasCurations) {
            return productListSummary.media!;
        }
    }

    const { product: { media, components } } = customizedProduct;

    if (media.length === 0) {
        if (customizedProduct.product.previewType === PreviewType.Render) {
            return [
                getMainImageUrlForRender(customizedProduct, OrientationType.Front, ZoomType.None, RENDER_GALLERY_IMAGE_SIZES),
                getMainImageUrlForRender(customizedProduct, OrientationType.Back, ZoomType.None, RENDER_GALLERY_IMAGE_SIZES),
            ];
        } else {
            return [];
        }
    }

    const colorOrFabricSelected = customizedProduct.components.filter((x) => (x.componentTypeCategory === ComponentType.Color || x.componentTypeCategory === ComponentType.ColorAndFabric));
    const filterComponent = colorOrFabricSelected.length > 0 ? colorOrFabricSelected[0].code : '';

    const filteredMedia = media.filter((x) => x.options.includes(filterComponent));
    if (filteredMedia.length > 0) {
        return filteredMedia;
    }

    if (onlyMatches) {
        return [];
    }

    // Since we can't find anything that is selected or recommeneded, just return the first SET of media for a color or fabric
    const firstRecommendedColorOrFabric = components.filter((x) => (x.componentTypeCategory === ComponentType.Color || x.componentTypeCategory === ComponentType.ColorAndFabric) && x.isRecommended)[0];
    const firstMediaOption = firstRecommendedColorOrFabric ? firstRecommendedColorOrFabric.code : media[0].options[0];
    return media.filter((x) => x.options.includes(firstMediaOption));
}

export function findSimilarSilhouetteImages(currentSummary: ProductListSummary, productListSummaries: ProductListSummaries): ProductMedia[] {
    return Object.entries(productListSummaries).filter((x) => x['1']!.primarySilhouetteId === currentSummary.primarySilhouetteId && x['1']!.pid !== currentSummary.pid).map((x) => x['1']).notNullOrUndefined().flatMap((x) => (x.media || [])).notNullOrUndefined();
}
