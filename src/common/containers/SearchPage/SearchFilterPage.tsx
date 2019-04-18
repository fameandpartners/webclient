import React from 'react';
import Modal from '@components/modal/Modal';
import { SiteVersion } from '@common/constants';
import SearchFilter from '@containers/SearchPage/SearchFilter';
import { DocumentSearchResponse, Facet, FacetGroup } from 'typings/fame_api/product_document';
import Button from '@components/base/Button/Button';
import { FormattedMessage } from 'react-intl';
import { SearchParams, FACET_CONFIGURATION_TITLE } from '@containers/SearchPage/SearchPage';
import { CmsCategoryPage } from '@components/cms/CategoryPage';
import { History } from 'history';
const CloseCross = require('@svg/i-close-cross.svg').default;

interface Props {
    siteVersion: SiteVersion;
    searchResult: DocumentSearchResponse;
    initalSearchPageState: SearchParams;
    toggleFacet: (searchParams: SearchParams, facet: Facet, group: FacetGroup) => SearchParams;
    onClose: (state: SearchParams) => void;
    facetDetails: CmsCategoryPage | null | undefined;
    goToState: (state: SearchParams, mode: 'push' | 'replace', page: string) => void;
    history: History;
}

interface State {
    currentSearchParams: SearchParams;
}

class SearchFilterPage extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            currentSearchParams: props.initalSearchPageState
        };
    }

    private renderHeader() {
        return (
            <div />
        );
    }

    private renderFooter() {
        return (
            <React.Fragment>
                <Button key="clear" onClick={this.onResetFilters} className="action-buttons" secondary>
                    <FormattedMessage id="SearchFilter.ClearAll" defaultMessage="Clear all" />
                </Button>
                <Button key="save" onClick={this.onApply} className="action-buttons">
                    <FormattedMessage id="SearchFilter.Save" defaultMessage="Save" />
                </Button>
            </React.Fragment>
        );
    }

    private onSelectedFacet = (facet: Facet, group: FacetGroup) => {
        this.setState((state) => {
            const newSearchParams = this.props.toggleFacet(state.currentSearchParams, facet, group);
            this.props.goToState(newSearchParams, 'replace', 'filter');
            
            return {
                currentSearchParams: newSearchParams
            };
        });
    } 

    private onResetFilters = () => {
        this.setState((state) => {
            return {
                currentSearchParams: {
                    ...state.currentSearchParams,
                    selectedFacets: []
                }
            };
        });
    } 

    private onApply = () => {
        this.props.onClose(this.state.currentSearchParams);
    }

     public render() {
        return <Modal 
                siteVersion={this.props.siteVersion}
                backOptions={{
                    action: this.onApply
                }}
                headerNodes={this.renderHeader()}
                footerNodes={this.renderFooter()}
        >
        <style jsx>{`
            @import 'vars';

            .container {
                @include container;

                :global(hr) {
                    margin: 0 (-$page-padding-mobile);
                }
            }
        `}</style>
            <div className="container">
                <SearchFilter
                    facetConfiguration={this.props.searchResult.facetConfigurations[FACET_CONFIGURATION_TITLE]}
                    facetGroups={this.props.searchResult.facetGroups}
                    selectedFacets={this.state.currentSearchParams.selectedFacets}
                    baseFacets={this.state.currentSearchParams.baseFacets}
                    onSelected={this.onSelectedFacet}
                    facetDetails={this.props.facetDetails}
                    onlyShowFacetGroups={this.props.facetDetails && this.props.facetDetails.taxons ? this.props.facetDetails.taxons.taxonGroups : null}
                    history={this.props.history}
                />
            </div>
        </Modal >;
    }
}

export default SearchFilterPage;