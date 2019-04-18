import { SiteVersion } from '@common/constants';
import { ProductMedia } from '../product';

interface ProductDocument {
    pid: string;
    productId: string;
    componentIdPath: string;
    name: string;
    productVersionId: number;
    url: string | null;
    price: {
        [SiteVersion.AU]: number;
        [SiteVersion.US]: number;
    };
    strikeThroughPrice?: {
        [SiteVersion.AU]: number;
        [SiteVersion.US]: number;
    };
    images: ProductMedia[] | null;

    // Diagnostic Fields
    sortWeight: number;
}

interface Facet {
    facetId: string;
    title: string;
    subtitle: string;
    order: number;
    docCount: number;
    previewImage: string;
    facetMeta?: {
        hex?: string;
        image?: string;
        code: string;
    }
}

interface FacetGroup {
    name: string;
    title: string;
    subtitle: string;
    slug: string;
    multiselect: boolean;
    collapsed: boolean;
    isCategoryFacet: boolean;
    facets: Facet[];
}

interface FacetGroups {
    [key: string]: FacetGroup;
}

interface FacetCategory {
    name: string;
    hideHeader: boolean;
    facetGroupIds: string[];
}

interface FacetConfiguration {
    [key: string]: FacetCategory[];
}

interface DocumentSearchResponse {
    results: ProductDocument[];
    facetConfigurations: FacetConfiguration;
    facetGroups: FacetGroups;
    sortOptions: DocumentSearchSortOption[] | null;
    lastIndex: number;
    lastValue: number;
    hasMore: boolean;
}

export interface DocumentSearchSortOption {
    name: string,
    sortField: string,
    sortOrder: string
}

interface DocumentSearchArgs {
    query?: string | null;
    sortField?: string | null;
    sortOrder?: string | null;
    facets?: string[];
    excludeFacets?: string[];
    lastIndex?: number;
    lastValue?: number;
    pageSize: number;
    returnFacets: boolean;
    useSpree: boolean;
    boostPids: string[]|null;
    boostFacets: string[]|null;
}
