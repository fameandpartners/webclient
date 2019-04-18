import React from 'react';
import { SiteVersion } from '@common/constants';
import { CmsObject, CmsElement } from 'typings/cms';
import Wrapper from '@containers/CmsPage/Wrapper';
import { RouteComponentProps } from 'react-router';
import { getReactComponentClassForCmsName } from '@components/cms/registry';
import { CmsElementState } from '@common/rematch/models/cms';
import CmsDataLoadingContext from './DataLoader';
import ErrorPage from '@components/error-page/ErrorPage';
import FullScreenLoader from '@components/base/FullScreenLoader';
import { trackPageView } from '@common/analytics/analytics';
import { RootDispatch } from '@common/rematch';

interface Props extends RouteComponentProps<{ slug?: string; id?: string }> {
    siteVersion: SiteVersion;
    cmsElements: Array<CmsElementState<any>>;
    loadProduct: (id: string) => void;
    dispatch: any;
}

interface State {
    cmsElement?: CmsElementState<any>;
}

export function createReactComponent(component: CmsElement, isEditMode: boolean) {
    const mapping = getReactComponentClassForCmsName(component.type);

    const reactComponent = React.createElement(mapping.component, {
        ...component,
        key: component.id
    });

    return (
        <Wrapper key={`${component.id}-wrapped`} id={component.id} spaceId={component.spaceId} isEditMode={isEditMode}>
            {reactComponent}
        </Wrapper>
    );
}

function transform(component: CmsObject, isEditMode: boolean) {
    if (component.cmsType === 'element' && component.type.startsWith('_')) {
        return transformProps(component, isEditMode);
    } else {
        return transformToReactComponents(component, isEditMode);
    }
}

function transformProps(component: CmsObject, isEditMode: boolean) {
    const transformed = {};

    Object.keys(component).forEach((key: string) => {
        const value = component[key];

        if (Array.isArray(value) && value.length > 0 && value[0] instanceof Object && value[0].cmsType === 'element') {
            transformed[key] = value.map((c) => transform(c, isEditMode));
        } else if (value instanceof Object && value.cmsType === 'element') {
            transformed[key] = transform(value, isEditMode);
        } else {
            transformed[key] = value;
        }
    });

    return transformed;
}

export function transformToReactComponents(component: CmsObject, isEditMode: boolean) {
    const transformed = transformProps(component, isEditMode);
    return createReactComponent(transformed as any, isEditMode);
}

class CmsPage extends React.Component<Props, State> {
    public static isPreview(url: string) {
        return url.indexOf('?preview') > -1;
    }

    public static async loadCmsDataBySlug(dispatch: RootDispatch, slug: string, isPreview: boolean) {

        const data = await dispatch.CmsModel.loadPageBySlugAsync({slug, isPreview});

        if (data) {
            await CmsPage.resolveCmsData(data, dispatch);
        }
    }

    public static async loadCmsDataById(dispatch: RootDispatch, id: string, isPreview: boolean) {
        const data = await dispatch.CmsModel.loadElementById({id, isPreview});
        if (data) {
            await CmsPage.resolveCmsData(data, dispatch);
        }
    }

    protected static resolveCmsData(root: CmsElement, dispatch: RootDispatch): Promise<void> {
        const dataLoadingContext = new CmsDataLoadingContext();
        CmsPage.registerCmsComponentDataContext(root, dataLoadingContext);
        return dataLoadingContext.resolve(dispatch.ProductsModel.loadProductAsync, dispatch.ProductsModel.loadProductSummaryAsync);
    }

    protected static registerCmsComponentDataContext(component: CmsElement, dataLoadingContext: CmsDataLoadingContext) {
        Object.keys(component).forEach((key: string) => {
            const value = component[key];

            if (Array.isArray(value) && value.length > 0 && value[0] instanceof Object && value[0].cmsType === 'element') {
                for (const child of value) {
                    CmsPage.registerCmsComponentDataContext(child, dataLoadingContext);
                }
            } else if (value instanceof Object && value.cmsType === 'element') {
                CmsPage.registerCmsComponentDataContext(value, dataLoadingContext);
            }
        });

        const mapping = getReactComponentClassForCmsName(component.type);

        if (mapping.loader) {
            mapping.loader(component, dataLoadingContext);
        }
    }

    public static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> {
        const { cmsElements, dispatch, match, siteVersion } = nextProps;
        const { id, slug } = match.params;

        const page = cmsElements.find((el) => el.id === id && el.slug === slug && !el.facets);
        if (!page) {
            trackPageView(siteVersion, 'content', null, null, null);

            if (id) {
                CmsPage.loadCmsDataById(dispatch, id, CmsPage.isPreview(window.location.href));
            } else {
                CmsPage.loadCmsDataBySlug(dispatch, slug!, CmsPage.isPreview(window.location.href));
            }
        }

        return { cmsElement: page };
    }

    public componentDidMount() {
        trackPageView(this.props.siteVersion, 'content', null, null, null);
    }

    public render() {
        const isPreview = this.props.location.search ? this.props.location.search.includes('cmsEdit') : false;
        const page = this.state.cmsElement;

        if (page && page.element) {
            return transformToReactComponents(page.element, isPreview);
        }
        if (page && page.isLoading) {
            return <FullScreenLoader />;
        }
        if (page && !page.isLoading && !page.element) {
            return <ErrorPage type={404} />;
        }

        return <ErrorPage type={500} />;
    }
}

export default CmsPage;
