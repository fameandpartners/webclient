
import FameAPI from '@common/services/fameApi';
import { createModel, RematchRootState } from '@rematch/core';
import { DocumentSearchResponse, DocumentSearchArgs } from '@typings';

export type SearchModelRootState = DocumentSearchResponse & {
    isLoading: boolean;
    hasMore: boolean;
    lastSearchParams: DocumentSearchArgs | null;
};

function compareSearchArgs(a: DocumentSearchArgs, b: DocumentSearchArgs) {
    return a.sortField === b.sortField
        && a.query === b.query
        && a.lastIndex === b.lastIndex
        && a.lastValue === b.lastValue
        && a.pageSize === b.pageSize
        && a.sortOrder === b.sortOrder
        &&
        (
            (!a.facets && !b.facets)
            ||
            (
                b.facets && a.facets
                && b.facets.difference(a.facets).length === 0
                && a.facets.difference(b.facets).length === 0
            )
        )
        &&
        (
            (!a.excludeFacets && !b.excludeFacets)
            ||
            (
                b.excludeFacets && a.excludeFacets
                && b.excludeFacets.difference(a.excludeFacets).length === 0
                && a.excludeFacets.difference(b.excludeFacets).length === 0
            )
        );
}

const DEFAULT_STATE: SearchModelRootState = {
    results: [],
    facetConfigurations: {},
    facetGroups: {},
    lastIndex: 0,
    lastValue: 0,
    hasMore: false,
    isLoading: false,
    lastSearchParams: null,
    sortOptions: null
};

const SearchModel = createModel({
    state: DEFAULT_STATE,
    reducers: {
        setLoading(state: SearchModelRootState, searchParams: DocumentSearchArgs): SearchModelRootState {
            return {
                ...state,
                isLoading: true,
                lastSearchParams: searchParams
            };
        },
        update(state: SearchModelRootState, { results, searchParams }: { results: DocumentSearchResponse, searchParams: DocumentSearchArgs}): SearchModelRootState {
            const { lastIndex } = results;
            if (state.lastIndex === lastIndex) {
                return state;
            }

            return {
                ...results,
                results: [
                    ...state.results,
                    ...results.results
                ],
                isLoading: false,
                hasMore: results.hasMore,
                lastSearchParams: searchParams
            };
        },
        set(state: SearchModelRootState, { results, searchParams }: { results: DocumentSearchResponse, searchParams: DocumentSearchArgs}): SearchModelRootState {
            return {
                ...results,
                isLoading: false,
                hasMore: results.hasMore,
                lastSearchParams: searchParams
            };
        },
    },
    effects: ({
        async loadDocumentAsync(payload: DocumentSearchArgs, rootState: RematchRootState<any>) {
            if (rootState.SearchModel.lastSearchParams && compareSearchArgs(payload, rootState.SearchModel.lastSearchParams!!)) {
                return;
            }

            const fameApi = new FameAPI(rootState.SiteVersion);
            const results = await (payload.useSpree ? fameApi.getDocumentFromSpree(payload) : fameApi.getDocumentFromProductCatalog(payload));
            this.update({results, searchParams: payload});
        },
        async downloadDocumentAsync(payload: DocumentSearchArgs, rootState: RematchRootState<any>) {
            if (rootState.SearchModel.lastSearchParams && compareSearchArgs(payload, rootState.SearchModel.lastSearchParams)) {
                return;
            }

            this.setLoading(payload);

            const fameApi = new FameAPI(rootState.SiteVersion);
            const results = await (payload.useSpree ? fameApi.getDocumentFromSpree(payload) : fameApi.getDocumentFromProductCatalog(payload));
            this.set({results, searchParams: payload});
        },
    }),
});

export default SearchModel;
