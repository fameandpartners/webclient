import { CmsElement, ContentfulService } from 'typings/cms';
import { createModel } from '@rematch/core';

export interface CmsElementState<T extends CmsElement> {
    isLoading: boolean;
    slug?: string;
    id?: string;
    facets?: string[];
    element?: T;
}
export interface CmsRootState {
    elements: Array<CmsElementState<any>>;
    contentfulService: ContentfulService;
}

export interface LoadElementById {
    id: string;
    isPreview: boolean;
}

export interface LoadPageBySlugAction {
    slug: string;
    isPreview: boolean;
}

export interface LoadFacetsDetails {
    slug: string;
    isPreview: boolean;
}

function normaliseUrl(url: string | null) {
    return `/${url ? url.toLowerCase() : ''}`;
}

const DEFAULT_STATE: CmsRootState = {
    elements: [],
    contentfulService: null!!
};

const CmsModel = createModel({
    reducers: {
        addElement(state: CmsRootState, elementState: CmsElementState<any>): CmsRootState {
            return {
                ...state,
                elements: [
                    ...state.elements.filter((eS) => !(eS.id === elementState.id && eS.slug === elementState.slug && eS.facets === elementState.facets)),
                    elementState
                ]
            };
        },
        setContentfulService(state: CmsRootState, contentfulService: ContentfulService): CmsRootState {
            return {
                ...state,
                contentfulService
            };
        }
    },
    state: DEFAULT_STATE,
    effects: {
        async loadElementById({id, isPreview}: LoadElementById, rootState: any) {
            this.addElement({
                isLoading: true,
                id,
            });
            const component: CmsElement|null = await rootState.CmsModel.contentfulService.getEntryById(id, isPreview, rootState.UserModel, rootState.SiteVersion);
            this.addElement({
                isLoading: false,
                id,
                element: component
            });

            return component;
        },
        async loadFacetDetails({slug, isPreview}: LoadFacetsDetails, rootState: any) {
            this.addElement({
                isLoading: true,
                slug,
            });
            const component: CmsElement|null = await rootState.CmsModel.contentfulService.getEntryByField('slug', slug, 'categoryPage', isPreview, rootState.UserModel, rootState.SiteVersion);
            this.addElement({
                isLoading: false,
                slug,
                element: component
            });

            return component;
        },
        async loadPageBySlugAsync({slug, isPreview}: LoadPageBySlugAction, rootState: any) {
            this.addElement({
                isLoading: true,
                slug,
            });
            const component: CmsElement|null = await rootState.CmsModel.contentfulService.getEntryByField('url', normaliseUrl(slug), 'page', isPreview, rootState.UserModel, rootState.SiteVersion);
            this.addElement({
                isLoading: false,
                slug,
                element: component
            });

            return component;
        },
        async loadGlobalPageConfig({isPreview}: {isPreview: boolean}, rootState: any) {
            const slug = 'global-page';

            this.addElement({
                isLoading: true,
                slug,
            });
            const component: CmsElement|null = await rootState.CmsModel.contentfulService.getEntryByField('slug', slug, 'pageSettings', isPreview, rootState.UserModel, rootState.SiteVersion);
            this.addElement({
                isLoading: false,
                slug,
                element: component
            });

            return component;
        }
    }
});

export default CmsModel;
