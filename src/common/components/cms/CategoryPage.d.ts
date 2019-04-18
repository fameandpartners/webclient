import { CmsAsset, CmsAssetImage, CmsElement } from "typings/cms";
import { SimpleHeaderProps } from "@components/cms/Header/SimpleHeader";
import { CmsNavigationLinkSection } from "./CmsPageGlobalConfig";

interface CmsCategoryPageFilter extends CmsElement {
    title: string;
    groups: CmsNavigationLinkSection[]
}
interface CmsCategoryPageTaxons extends CmsElement {
    taxonGroups: string[]
}
interface CmsCategoryPage extends CmsElement {
    metaTitle: string;
    metaDescription: string;
    metaImage: CmsAssetImage;
    pageIndex: boolean;
    facets: string[]|null;
    excludeFacets: string[]|null;
    slug: string;
    title: string|null;
    sortOrder: string|null;
    sortField: string|null;
    boostPids: string[]|null;
    boostFacets: string[]|null;
    style: null|'Filter on top'|'Filter by the side';
    filters: Array<CmsCategoryPageFilter>;
    taxons?: CmsCategoryPageTaxons;
}