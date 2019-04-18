import React from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { SearchPageType } from '@containers/SearchPage/SearchPage';
import SearchFilter from '@containers/SearchPage/SearchFilter';

class SearchResultEmpty extends React.PureComponent<{type: SearchPageType, onResetAllFilters: () => void}>  {
    public render() {
        const {type, onResetAllFilters} = this.props;
        return (
            <div className={'search-results-empty'}>
                <style jsx>{`
                    @import 'vars';

                    .search-results-empty {
                        @include grid-column(12);
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        text-align: center;
                        padding: 12*$space-base 8*$space-base;

                        @include desktop {
                            min-height: calc(100vh - #{$navbar-height} - #{$footer-height});
                        }

                        @include mobile {
                            padding: 0;
                        }
                    }
                `}</style>

                <h2><FormattedMessage id={'Search.ResultsEmpty.Title'} defaultMessage={'We can\'t find any dresses that match your selections'} /></h2>
                {type === SearchPageType.CUSTOM_CLOTHING_SEARCH 
                    && <h4><FormattedHTMLMessage id={'Search.ResultsEmpty.Subtitle.CCS'} defaultMessage={'Try <a href="/custom-clothes/search">clearing your filters</a> or use our <a href="/custom-clothes/find">dress finder</a> to find your perfect dress'} /></h4>}
                {type === SearchPageType.CATEGORY_PAGE 
                    && <h4>Try <a onClick={onResetAllFilters}>clearing your filters.</a></h4>}
                {type === SearchPageType.SEARCH 
                    && <h4><FormattedHTMLMessage id={'Search.ResultsEmpty.Subtitle.Catgeory'} defaultMessage={'<a href="/dresses/best-sellers">View our best selling dresses.</a>'} /></h4>}
            </div>
        );
    }
}

export default SearchResultEmpty;
