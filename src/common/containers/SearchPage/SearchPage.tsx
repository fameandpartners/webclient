import React from 'react';
import { SiteVersion, DEFAULT_PAGE_SIZE } from '@common/constants';
import { RouteComponentProps, Switch, Route } from 'react-router';
import { DocumentSearchArgs, FacetCategory, Facet, DocumentSearchResponse, FacetGroup } from 'typings/fame_api/product_document';
import { trackSelectFacet, trackDeselectFacet, trackPageView, trackSearchCleared, trackSearchLoadMore, trackSearchFilterApplied } from '@common/analytics/analytics';
import SearchResultPage from '@containers/SearchPage/SearchResultPage';
import SearchFilterPage from '@containers/SearchPage/SearchFilterPage';
import qs from 'query-string';
import { BASEURL_DRESS_SYSTEM_SEARCH, URL_COMPONENT_SEPARATOR, BASEURL_SEARCH } from '@common/utils/url-helper';
import { UserRootState } from '@common/rematch/models/user';
import { LoadFacetsDetails, CmsRootState, CmsElementState } from '@common/rematch/models/cms';
import { RootDispatch } from '@common/rematch';
import { CmsCategoryPage } from '@components/cms/CategoryPage';
import ErrorPage from '@components/error-page/ErrorPage';
import { History } from 'history';

export interface SearchParams {
    selectedFacets: string[];
    excludeFacets: string[];
    baseFacets: string[];
    sortField: string | null;
    sortOrder: string | null;
    query: string | null | undefined;
}

const DEFAULT_SEARCH_PARAMS = {
    selectedFacets: [],
    excludeFacets: [],
    baseFacets: [],
    sortField: null,
    sortOrder: null,
    query: undefined,
};

export const FACET_CONFIGURATION_TITLE = 'search';

function compareSearchParams(a: SearchParams, b: SearchParams) {
    return a.sortField === b.sortField
        && a.sortOrder === b.sortOrder
        && a.query === b.query
        && b.selectedFacets.difference(a.selectedFacets).length === 0
        && a.selectedFacets.difference(b.selectedFacets).length === 0
        && b.selectedFacets.difference(a.selectedFacets).length === 0
        && a.selectedFacets.difference(b.selectedFacets).length === 0
        && b.excludeFacets.difference(a.excludeFacets).length === 0
        && a.excludeFacets.difference(b.excludeFacets).length === 0
        && b.baseFacets.difference(a.baseFacets).length === 0
        && a.baseFacets.difference(b.baseFacets).length === 0;
}

function normaliseUrl(url: string) {
    let slug = url;
    // Drop '/' for category pages
    if (slug.endsWith('/')) {
        slug = slug.slice(0, slug.length - 1);
    }
    slug = slug.replace('/filter', '');
    return slug;
}

interface Props extends RouteComponentProps<{}> {
    user: UserRootState;
    siteVersion: SiteVersion;
    loadDocument: (query: DocumentSearchArgs) => void;
    downloadDocument: (query: DocumentSearchArgs) => void;
    loadFacetDetails: (query: LoadFacetsDetails) => void;
    hasMore: boolean;
    isLoading: boolean;
    searchResult: DocumentSearchResponse;
    type: SearchPageType;
    cmsData: CmsRootState;
    history: History;
}

interface State {
    searchParams: SearchParams;
    facetDetails: CmsElementState<CmsCategoryPage> | null;
}

export enum SearchPageType {
    CUSTOM_CLOTHING_SEARCH,
    SEARCH,
    CATEGORY_PAGE
}

class SearchPage extends React.PureComponent<Props, State> {
    private searchResultPageRef = React.createRef<SearchResultPage>();

    public state: State = {
        searchParams: DEFAULT_SEARCH_PARAMS,
        facetDetails: null
    };

    private static shouldShowAdd(type: SearchPageType) {
        return type === SearchPageType.CUSTOM_CLOTHING_SEARCH;
    }

    public static async preloadData(url: string, type: SearchPageType, dispatch: RootDispatch) {

        let facetDetails: CmsCategoryPage|null = null;
        if (type === SearchPageType.CATEGORY_PAGE) {
            const parsed = qs.parseUrl(url, {arrayFormat: 'bracket'});

            const slug = normaliseUrl(parsed.url);

            const isPreview = parsed.query.isPreview === 'true';
            facetDetails = await dispatch.CmsModel.loadFacetDetails({ slug, isPreview }) as CmsCategoryPage|null;
        }

        const searchParams = SearchPage.parseUrl(url, type, facetDetails);
        await dispatch.SearchModel.loadDocumentAsync({
            facets: [...searchParams.baseFacets, ...searchParams.selectedFacets],
            excludeFacets: facetDetails && facetDetails.excludeFacets || [],
            lastIndex: undefined,
            lastValue: undefined,
            sortField: searchParams.sortField,
            sortOrder: searchParams.sortOrder,
            pageSize: DEFAULT_PAGE_SIZE - (SearchPage.shouldShowAdd(type) ? 1 : 0),
            useSpree: type !== SearchPageType.CUSTOM_CLOTHING_SEARCH,
            returnFacets: true,
            query: searchParams.query,
            boostPids: facetDetails && facetDetails.boostPids,
            boostFacets: facetDetails && facetDetails.boostFacets
        });
    }

    public static parseUrl(location: string, type: SearchPageType, facetDetails: CmsCategoryPage | null): SearchParams {
        const parsed = qs.parseUrl(location, {arrayFormat: 'bracket'});
        const pathName = parsed.url;

        const urlParams = {
            sortField: parsed.query.sortField || (facetDetails && facetDetails.sortField) || DEFAULT_SEARCH_PARAMS.sortField,
            sortOrder: parsed.query.sortOrder || (facetDetails && facetDetails.sortOrder) || DEFAULT_SEARCH_PARAMS.sortOrder,
            query: parsed.query.q
        };

        // /dresses/maxi?facets[]=pink&facets[]=strapless
        if (type === SearchPageType.CATEGORY_PAGE) {
            const facets = parsed.query.facets;

            return {
                ...urlParams,
                baseFacets: facetDetails && facetDetails.facets || [],
                excludeFacets: facetDetails && facetDetails.excludeFacets || [],
                selectedFacets: facets || []
            };
        // /custom-clothes/search/red/purple
        } else if (type === SearchPageType.CUSTOM_CLOTHING_SEARCH) {
            return {
                ...urlParams,
                sortField: 'sortWeight',
                sortOrder: 'Descending',
                baseFacets: [],
                excludeFacets: [],
                selectedFacets: pathName.replace(BASEURL_DRESS_SYSTEM_SEARCH, '').split('/').filter((x) => !!x && x !== 'filter'),
            };
        // //search?facets[]=print&q=polka
        } else if (type === SearchPageType.SEARCH) {
            return {
                ...urlParams,
                baseFacets: [],
                excludeFacets: [],
                selectedFacets: parsed.query.facets || [],
            };
        }
        throw new Error('invalid type');
    }

    public static generateUrl(state: SearchParams, page: string, type: SearchPageType, facetDetails: CmsCategoryPage | null): string {

        const urlParams: any = {
            q: state.query
        };

        if (state.sortField && state.sortField !== DEFAULT_SEARCH_PARAMS.sortField) {
            urlParams.sortField = state.sortField;
        }
        if (state.sortOrder && state.sortOrder !== DEFAULT_SEARCH_PARAMS.sortOrder) {
            urlParams.sortOrder = state.sortOrder;
        }

        if (type === SearchPageType.CATEGORY_PAGE) {
            const urlParts = [
                facetDetails!.slug,
                page
            ].notNullOrUndefined();

            const categoryUrlParams = {
                ...urlParams,
                facets: state.selectedFacets,
            };

            return `${urlParts.join('/')}?${qs.stringify(categoryUrlParams, {arrayFormat: 'bracket'})}`;
        } else if (type === SearchPageType.CUSTOM_CLOTHING_SEARCH) {
            const urlParts = [
                BASEURL_DRESS_SYSTEM_SEARCH,
                ...state.selectedFacets,
                page
            ].notNullOrUndefined();

            return `${urlParts.join('/')}?${qs.stringify(urlParams, {arrayFormat: 'bracket'})}`;
        } else if (type === SearchPageType.SEARCH) {
            const urlParts = [
                BASEURL_SEARCH,
                page
            ].notNullOrUndefined();

            const searchUrlParams = {
                ...urlParams,
                facets: state.selectedFacets,
            };

            return `${urlParts.join('/')}?${qs.stringify(searchUrlParams, {arrayFormat: 'bracket'})}`;
        }
        throw new Error('invalid type');
    }

    public static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> {
        const { location, downloadDocument, loadFacetDetails } = nextProps;

        const slug = normaliseUrl(location.pathname);

        const isCategoryPage = nextProps.type === SearchPageType.CATEGORY_PAGE;
        const facetDetails = nextProps.cmsData.elements.find((e) => e.slug === slug);
        if (isCategoryPage && !facetDetails) {
            loadFacetDetails({ slug, isPreview: false });
        }

        const searchParams = SearchPage.parseUrl(`${location.pathname}${location.search}`, nextProps.type, facetDetails && facetDetails.element);
        if (!isCategoryPage || (facetDetails && facetDetails.element)) {
            if (!compareSearchParams(prevState.searchParams, searchParams)) {
                downloadDocument({
                    facets: [...searchParams.selectedFacets, ...searchParams.baseFacets],
                    excludeFacets: (facetDetails && facetDetails.element && facetDetails.element.excludeFacets) || [],
                    query: searchParams.query,
                    lastIndex: undefined,
                    lastValue: undefined,
                    sortField: searchParams.sortField,
                    sortOrder: searchParams.sortOrder,
                    pageSize: DEFAULT_PAGE_SIZE - (SearchPage.shouldShowAdd(nextProps.type) ? 1 : 0),
                    returnFacets: true,
                    useSpree: nextProps.type !== SearchPageType.CUSTOM_CLOTHING_SEARCH,
                    boostPids: facetDetails && facetDetails.element.boostPids,
                    boostFacets: facetDetails && facetDetails.element.boostFacets
                });
            }
        }

        return { searchParams, facetDetails };
    }

    public componentDidMount() {
        trackPageView(this.props.siteVersion, 'search', null, null, this.props.searchResult.results);
        trackSearchFilterApplied(this.state.searchParams);
    }

    private onLoadMore = () => {
        const { searchResult, loadDocument } = this.props;
        const { facetDetails } = this.state;

        trackSearchLoadMore(searchResult.results.length);

        loadDocument({
            facets: [...this.state.searchParams.selectedFacets, ...this.state.searchParams.baseFacets],
            excludeFacets: (facetDetails && facetDetails.element && facetDetails.element.excludeFacets) || [],
            query: this.state.searchParams.query,
            lastIndex: searchResult.lastIndex,
            lastValue: searchResult.lastValue,
            sortField: this.state.searchParams.sortField,
            sortOrder: this.state.searchParams.sortOrder,
            pageSize: DEFAULT_PAGE_SIZE,
            returnFacets: false,
            useSpree: this.props.type !== SearchPageType.CUSTOM_CLOTHING_SEARCH,
            boostPids: (facetDetails && facetDetails.element && facetDetails.element.boostPids || []),
            boostFacets: (facetDetails && facetDetails.element && facetDetails.element.boostFacets || [])
        });
    }

    private toggleFacet = (searchParams: SearchParams, facet: Facet, group: FacetGroup): SearchParams => {
        const { selectedFacets, baseFacets } = searchParams;

        let newFacets: string[];
        let newBaseFacets = baseFacets;
        if (baseFacets.includes(facet.facetId)) {
            trackDeselectFacet(facet.facetId, group.title);
            newFacets = [
                ...selectedFacets,
                ...baseFacets.filter((bf) => bf !== facet.facetId)
            ];
            newBaseFacets = [];
        } else if (group.isCategoryFacet) {
            if (selectedFacets.includes(facet.facetId)) {
                trackDeselectFacet(facet.facetId, group.title);
                newFacets = [];
            } else {
                trackSelectFacet(facet.facetId, group.title);
                newFacets = [
                    facet.facetId
                ];
            }
        } else if (group.multiselect) {
            if (selectedFacets.includes(facet.facetId)) {
                trackDeselectFacet(facet.facetId, group.title);
                newFacets = selectedFacets.filter((f) => f !== facet.facetId);
            } else {
                trackSelectFacet(facet.facetId, group.title);
                newFacets = [
                    ...selectedFacets,
                    facet.facetId
                ];
            }
        } else {
            if (selectedFacets.includes(facet.facetId)) {
                trackDeselectFacet(facet.facetId, group.title);
                newFacets = selectedFacets.filter((f) => f !== facet.facetId);
            } else {
                trackSelectFacet(facet.facetId, group.title);

                newFacets = [
                    ...selectedFacets.filter((f) => !group.facets.some((x) => x.facetId === f)),
                    facet.facetId
                ];
            }
        }

        return {
            ...this.state.searchParams,
            selectedFacets: newFacets,
            baseFacets: newBaseFacets
        };
    }

    private goToState = (state: SearchParams, mode: 'replace' | 'push', page = '') => {
        const { history } = this.props;

        if (page === '') {
            trackSearchFilterApplied(state);
        }

        const newUrl = SearchPage.generateUrl(state, page, this.props.type, this.state.facetDetails && this.state.facetDetails.element || null);
        if ('replace' === mode) {
            history.replace(newUrl);
        } else {
            history.push(newUrl);
        }

        const searchPage = this.searchResultPageRef.current;
        if (searchPage && page === '') {
            searchPage.scrollToTop();
        }

    }

    private onFacetSelection = (facet: Facet, group: FacetGroup) => {
        const state = this.toggleFacet(this.state.searchParams, facet, group);
        this.goToState(state, 'replace');
    }

    private onSortSelection = (value: string) => {
        const [ field, order ] = value.split(URL_COMPONENT_SEPARATOR);

        const state = {
            ...this.state.searchParams,
            sortField: field,
            sortOrder: order
        };

        this.goToState(state, 'replace');
    }

    private onShowMobileFilters = () => {
        this.goToState(this.state.searchParams, 'push', 'filter');
    }

    private onCloseMobileFilters = (state: SearchParams) => {
        this.goToState(state, 'push');
    }

    private resetFilters = (facetCategory: FacetCategory) => {
        const facetIds = facetCategory.facetGroupIds
            .map((groupId) => this.props.searchResult.facetGroups[groupId])
            .flatMap((g) => g.facets)
            .map((f) => f.facetId);

        const selectedFacets = this.state.searchParams.selectedFacets.filter((f) => !facetIds.includes(f));

        trackSearchCleared();

        this.goToState(
            {
                selectedFacets,
                sortField: DEFAULT_SEARCH_PARAMS.sortField,
                sortOrder: DEFAULT_SEARCH_PARAMS.sortOrder,
                query: this.state.searchParams.query,
                baseFacets: this.state.searchParams.baseFacets,
                excludeFacets: this.state.searchParams.excludeFacets
            },
            'push'
        );
    }

    private resetFiltersForGroup = (facetGroup: FacetGroup) => {
        const facetIds = facetGroup.facets
            .map((f) => f.facetId);

        const selectedFacets = this.state.searchParams.selectedFacets.filter((f) => !facetIds.includes(f));

        trackSearchCleared();

        this.goToState(
            {
                selectedFacets,
                sortField: DEFAULT_SEARCH_PARAMS.sortField,
                sortOrder: DEFAULT_SEARCH_PARAMS.sortOrder,
                query: this.state.searchParams.query,
                baseFacets: this.state.searchParams.baseFacets,
                excludeFacets: this.state.searchParams.excludeFacets
            },
            'push'
        );
    }

    private resetAllFilters = () => {
        trackSearchCleared();

        this.goToState(
            {
                selectedFacets: [],
                sortField: DEFAULT_SEARCH_PARAMS.sortField,
                sortOrder: DEFAULT_SEARCH_PARAMS.sortOrder,
                query: this.state.searchParams.query,
                baseFacets: this.state.searchParams.baseFacets,
                excludeFacets: this.state.searchParams.excludeFacets
            },
            'push'
        );
    }

    // #region Render

    public render() {
        const { siteVersion, searchResult, hasMore, isLoading, match, user, type } = this.props;
        const { searchParams, facetDetails } = this.state;
        const facetDetailsCmsElement = facetDetails && facetDetails.element;

        if (type === SearchPageType.CATEGORY_PAGE && facetDetails && !facetDetails.element && !facetDetails.isLoading && !isLoading) {
            return <ErrorPage type={404} />;
        }

        return (
           <React.Fragment>
                <Switch>
                    <Route
                        path={match.path + '/:slug*/filter'}
                        render={() => {
                            return (
                                <SearchFilterPage
                                    siteVersion={siteVersion}
                                    searchResult={searchResult}
                                    initalSearchPageState={searchParams}
                                    toggleFacet={this.toggleFacet}
                                    onClose={this.onCloseMobileFilters}
                                    goToState={this.goToState}
                                    facetDetails={facetDetailsCmsElement}
                                    history={this.props.history}
                                />
                            );
                        }}
                    />

                    <Route
                        render={() => (
                            <React.Fragment>
                                <SearchResultPage
                                    ref={this.searchResultPageRef}
                                    hasMore={hasMore}
                                    isLoading={isLoading}
                                    siteVersion={siteVersion}
                                    searchResult={searchResult}
                                    facetDetails={facetDetailsCmsElement}
                                    selectedFacets={searchParams.selectedFacets}
                                    baseFacets={searchParams.baseFacets}
                                    query={searchParams.query}
                                    onLoadMore={this.onLoadMore}
                                    onShowMobileFilters={this.onShowMobileFilters}
                                    onResetFilters={this.resetFilters}
                                    onResetAllFilters={this.resetAllFilters}
                                    onResetFiltersForGroup={this.resetFiltersForGroup}
                                    onFacetSelected={this.onFacetSelection}
                                    onSortSelected={this.onSortSelection}
                                    selectedSort={[searchParams.sortField, searchParams.sortOrder].notNullOrUndefined().join('~')}
                                    showAd={SearchPage.shouldShowAdd(type)}
                                    type={type}
                                    history={this.props.history}
                                />

                            </React.Fragment>
                        )}
                    />
                </Switch>
            </React.Fragment>
        );
    }

    // #endregion
}

export default SearchPage;
