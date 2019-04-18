import { CustomizedProduct, Component, FacetGroups, ProductListSummary } from 'typings';
import { ComponentType } from '@common/utils/component-type';
import queryString from 'query-string';
import { NotFoundError } from '@common/utils/error-reporting';
import { SiteVersion } from '@common/constants';
import { mapToCode } from '@common/utils/product';
import { formatCustomizationIds, findImage } from '@common/utils/render-url-helper';

export const URL_COMPONENT_SEPARATOR = '~';
const CUSTOM_DRESS_BASE = 'custom-dress';

const URL_EXCLUDED_TYPES = [
    ComponentType.Size,
    ComponentType.Making,
    ComponentType.Return
];

export const BASEURL_DRESS_SYSTEM_SEARCH = '/custom-clothes/search';
export const BASEURL_SEARCH = '/search';
export const BASEURL_CATEGORY_PAGES = [
    '/dresses',
    '/pants',
    '/jackets',
    '/outerwear',
    '/gowns',
    '/jumpsuits',
    '/skirts',
    '/clothing',
    '/tops'
];
export const BASEURL_DRESS_FINDER = '/custom-clothes/find';
export const BASEURL_ACCOUNT = '/account';
export const BASEURL_RETURNS = '/return';

export function componentShouldBeInUrl(component: Component) {
    return !URL_EXCLUDED_TYPES.includes(component.componentTypeCategory);
}

function getCodesFromCustomDressUrl(slug: string): string[] {
    return slug
    .replace(new RegExp(`^${CUSTOM_DRESS_BASE}-`), '')
    .split(URL_COMPONENT_SEPARATOR);
}

export function getIdFromSlug(slug: string): string {
    if (slug.startsWith('dress')) {
        return (slug.match(/(\w)+$/) as RegExpMatchArray)[0];
    } else if (slug.startsWith(CUSTOM_DRESS_BASE)) {
        const configuration = getCodesFromCustomDressUrl(slug);
        return configuration[0];
    }

    throw new NotFoundError(`Cannot parse url ${slug}`);
}

export function getPidFromSlug(slug: string): string|null {
    if (slug.startsWith(CUSTOM_DRESS_BASE)) {
        const [group, ...codes] = getCodesFromCustomDressUrl(slug);
        const customisationString = formatCustomizationIds(codes);

        return `${group}~${customisationString}`;
    }
    return null;
}

export function getComponentsFromSlug(slug: string, searchString: string): {componentCodes: string[], colorIdOrCodes: string[]} {
    const parsedUrl = queryString.parse(searchString);

    let componentCodes: string[] = [];
    const colorIdOrCodes: string[] = [];

    if (parsedUrl && 'clr' in parsedUrl) {
        colorIdOrCodes.push(parsedUrl.clr);
    }
    if (parsedUrl && 'color' in parsedUrl) {
        colorIdOrCodes.push(parsedUrl.color);
    }
    if (parsedUrl && 'components' in parsedUrl) {
        componentCodes = [...componentCodes, ...parsedUrl.components.split(',')];
    }

    if (slug.startsWith(CUSTOM_DRESS_BASE)) {
        const [group, ...codes] = getCodesFromCustomDressUrl(slug);
        componentCodes = [...componentCodes, ...codes];
    }

    return {colorIdOrCodes, componentCodes};
}

export function getBaseUrl(siteVersion: SiteVersion) {
    return global.__FAME_CONFIG__.URLS[siteVersion].frontend;
}

export function getUrlForSiteVersion(siteVersion: SiteVersion, url: string) {
    return `${getBaseUrl(siteVersion)}${url}`;
}

const ALLOWED_CUSTOMISATIONS = [ComponentType.Color, ComponentType.ColorAndFabric, ComponentType.Fabric];
export function isCustomDress(customizedProduct: CustomizedProduct) {
    if (customizedProduct.product.curationMeta && customizedProduct.components.length === 0) {
        return false;
    }

    const image = findImage(customizedProduct);
    if (customizedProduct.product.curationMeta
            && customizedProduct.components.length === 1
            && ALLOWED_CUSTOMISATIONS.includes(customizedProduct.components[0].componentTypeCategory)
            && image != null && image.options.includes(customizedProduct.components[0].code)
        ) {
        return false;
    }

    return true;

}

const CCS_TAXON = ['collections/ccs'];
export function isCCSDress(customizedProduct: CustomizedProduct, summary: ProductListSummary | null) {
    return isCustomDress(customizedProduct) && summary && Boolean(summary.taxonString) && CCS_TAXON.some((x) => summary.taxonString!.includes(x));
}

export function generateProductDetailUrl(customizedProduct: CustomizedProduct, page: string) {
    const {product, components} =  customizedProduct;
    const selectedComponents = components.filter(componentShouldBeInUrl);

    if (!isCustomDress(customizedProduct) && selectedComponents.length === 0) {
        return `/dresses/dress-${product.curationMeta.permaLink}-${product.urlProductId || product.productId}${page}`;
    } else if (!isCustomDress(customizedProduct) && selectedComponents.length === 1) {
        return `/dresses/dress-${product.curationMeta.permaLink}-${product.urlProductId || product.productId}${page}?color=${selectedComponents[0].code}`;
    } else {
        const codes = selectedComponents
            .map(mapToCode)
            .sort()
            .join(URL_COMPONENT_SEPARATOR);

        return `/dresses/${CUSTOM_DRESS_BASE}-${product.urlProductId || product.productId}${URL_COMPONENT_SEPARATOR}${codes}${page}`;
    }
}

export function  getDressFinderComponentsFromUrl(urlComponents: string) {
    if (urlComponents) {
        return urlComponents.split(URL_COMPONENT_SEPARATOR);
    }

    return [];
}

export function generateDressFinderUrl(facetGroups: FacetGroups, forward: boolean, slug: string, components: string[]) {
    const keys = Object.keys(facetGroups);
    const currentIndex = slug ? keys.indexOf(slug) : 0;
    let nextIndex = -1;

    if (forward) {
        if (currentIndex < keys.length - 1) {
            nextIndex = currentIndex + 1;
        }
    } else {
        if (currentIndex > 0) {
            nextIndex = currentIndex - 1;
        }
    }

    if (nextIndex < 0) {
        return;
    }

    return `${BASEURL_DRESS_FINDER}/${keys[nextIndex]}/${components.join(URL_COMPONENT_SEPARATOR)}`;
}

export function generateProductUrlForPid(pid: string) {
    return `/dresses/custom-dress-${pid}`;
}
