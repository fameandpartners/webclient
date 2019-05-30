import React, { ReactNodeArray } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import classnames from 'classnames';
import BaseLayout from '@containers/BaseLayout';
import { SiteVersion } from '@common/constants';
import { FormattedMessage } from 'react-intl';
import { DocumentSearchResponse, Facet, FacetGroup, FacetCategory } from 'typings/fame_api/product_document';
import ProductCard from '@components/search/ProductCard';
import Spinner from '@components/base/Spinner';
import SEOIndexPage from '@components/base/Seo/SeoIndexPage';
import SearchResultAd from '@containers/SearchPage/SearchResultAd';
import SearchResultEmpty from '@containers/SearchPage/SearchResultEmpty';
import SearchFilter from '@containers/SearchPage/SearchFilter';
import FabricOrColorCircle from '@components/customization-overview/FabricOrColorCircle';
import { FACET_CONFIGURATION_TITLE, SearchPageType } from '@containers/SearchPage/SearchPage';
import { UserContext } from '@common/context/UserContext';
import SearchSortToggle from '@containers/SearchPage/SearchSortToggle';
import { Mobile, Desktop } from '@components/base/MediaQuerySSR';
import { CmsCategoryPage } from '@components/cms/CategoryPage';
import SearchFilterBar from '@containers/SearchPage/SearchFilterBar';
import { scrollSmoothlyTo } from '@common/utils/scroll-util';
import { History } from 'history';

const BackArrow = require('@svg/i-back.svg').default;

interface Props {
  siteVersion: SiteVersion;
  hasMore: boolean;
  isLoading: boolean;
  searchResult: DocumentSearchResponse;
  selectedFacets: string[];
  baseFacets: string[];
  selectedSort: string;
  query: string | null | undefined;
  type: SearchPageType;
  onLoadMore: () => void;
  onShowMobileFilters: () => void;
  onSortSelected: (sort: string) => void;
  onResetFilters: (facetCategory: FacetCategory) => void;
  onResetFiltersForGroup: (facetGroup: FacetGroup) => void;
  onResetAllFilters: () => void;
  onFacetSelected: (facet: Facet, group: FacetGroup) => void;
  facetDetails: CmsCategoryPage | null | undefined;
  showAd: boolean;
  history: History;
}

class SearchResultPage extends React.PureComponent<Props> {
  private resultsContainerRef = React.createRef<HTMLElement>();

  public scrollToTop() {
    const searchResults = this.resultsContainerRef.current;
    if (searchResults) {
      const count = searchResults.offsetTop - 56;
      setTimeout(() => scrollSmoothlyTo(count), 50);
    }
  }

  public getTitle() {
    const { facetDetails, type, query } = this.props;

    if (type === SearchPageType.SEARCH && query) {
      return (
        <h1>
          <FormattedMessage id={'SearchPage.Title'} defaultMessage={'Search Results for "{query}"'} values={{ query }} />
        </h1>
      );
    } else if (type === SearchPageType.CUSTOM_CLOTHING_SEARCH) {
      return null;
    } else if (facetDetails) {
      return <h1>{facetDetails.title}</h1>;
    } else {
      return (
        <h1>
          <FormattedMessage id={'SearchPage.Title'} defaultMessage={'Search Results'} />
        </h1>
      );
    }
  }

  public renderHeader() {
    return (
      <section className={'SearchHeader'}>
        <style jsx>{`
          @import 'vars';

          :global(.SearchHeader) {
            padding-top: 12 * $space-base;
            padding-bottom: 8 * $space-base;

            :global(h1) {
              @include container;
            }

            @include mobile {
              padding-top: 3 * $space-base;
              padding-bottom: 4 * $space-base;
            }
          }
        `}</style>
        {this.getTitle()}
      </section>
    );
  }

  public renderSearchFilterMobile() {
    const { searchResult, selectedFacets, onShowMobileFilters } = this.props;

    let selectedFacetNames: string | null = null;
    let selectedFacetColorCircles: ReactNodeArray = [];

    if (searchResult && searchResult.facetGroups) {
      const facets = Object.values(searchResult.facetGroups)
        .flatMap((x) => x.facets)
        .filter((x) => selectedFacets.includes(x.facetId));

      selectedFacetNames = facets
        .filter((x) => !x.facetMeta || !x.facetMeta.hex)
        .map((x) => x.title)
        .join(', ');

      selectedFacetColorCircles = facets.filter((x) => x.facetMeta && x.facetMeta.hex).map((x) => <FabricOrColorCircle key={x.facetMeta!.hex} component={x} style={{ width: 16, height: 16, marginTop: 4, marginRight: 4 }} />);
    }

    return (
      <div className="MobileFilterOverview" onClick={onShowMobileFilters}>
        <style jsx>{`
          @import 'vars';

          .MobileFilterOverview {
            border: 1px solid $color-grey90;
            cursor: pointer;
            padding: $space-base 0;

            &__Line {
              margin: 0.5 * $space-base 2 * $space-base;

              &--title {
                display: flex;
                margin-bottom: $space-base;
              }
            }

            .title {
              text-transform: uppercase;
              flex-grow: 1;
            }

            .selection {
              color: $color-grey47;
            }
          }
        `}</style>

        <div className="MobileFilterOverview__Line MobileFilterOverview__Line--title">
          <span className="title">
            <FormattedMessage id={'SearchPage.Filter'} defaultMessage={'Filter by:'} />
          </span>
          <BackArrow style={{ width: 12, height: 12, transform: 'rotate(180deg)', marginLeft: 16, marginTop: 6 }} />
        </div>
        {selectedFacetNames && (
          <div className="MobileFilterOverview__Line">
            <span className="selection">{selectedFacetNames}</span>
          </div>
        )}
        {selectedFacetColorCircles.length > 0 && (
          <div className="MobileFilterOverview__Line">
            <span className="selection">{selectedFacetColorCircles}</span>
          </div>
        )}
      </div>
    );
  }

  public renderSidebar() {
    const { siteVersion, searchResult, hasMore, isLoading, selectedFacets, baseFacets, onLoadMore, onFacetSelected, onResetFilters, onShowMobileFilters, showAd, query, facetDetails } = this.props;
    const { sortOptions } = searchResult;

    return (
      <section className={classnames('Sidebar')}>
        <style jsx>{`
          @import 'vars';
          .Sidebar {
            @include grid-column(3);

            @include media('<desktopLarge') {
              @include grid-column(3);
            }

            @include mobile {
              @include grid-column(12);
              margin-right: 0;
            }

            &__Filter {
              top: $navbar-height;
              bottom: 0;
              overflow: auto;
              scroll-behavior: smooth;
              padding-right: $gutter;
              padding-bottom: space(4);

              :global(.FilterGroup:first-child) :global(.Accordion:first-child) :global(hr:first-child) {
                display: none;
              }
            }

            :global(.FilterGroup) {
              padding-bottom: 5 * $space-base;
            }

            :global(.SearchSortToggle) {
              padding-top: 4 * $space-base;
            }
          }
        `}</style>

        <div className="Sidebar__Filter">
          {sortOptions && sortOptions.length > 0 && <SearchSortToggle onSortSelected={this.props.onSortSelected} selectedSort={this.props.selectedSort} sortOptions={sortOptions} />}

          <SearchFilter
            facetConfiguration={searchResult.facetConfigurations[FACET_CONFIGURATION_TITLE]}
            facetGroups={searchResult.facetGroups}
            facetDetails={facetDetails}
            selectedFacets={selectedFacets}
            baseFacets={baseFacets}
            onResetFilters={onResetFilters}
            onSelected={onFacetSelected}
            history={this.props.history}
            onlyShowFacetGroups={facetDetails && facetDetails.taxons ? facetDetails.taxons.taxonGroups : null}
          />
        </div>
      </section>
    );
  }

  public render() {
    const { siteVersion, type, onResetFiltersForGroup, searchResult, hasMore, isLoading, selectedFacets, baseFacets, onLoadMore, onFacetSelected, onResetAllFilters, showAd, query, facetDetails, onResetFilters } = this.props;
    const edgeToEdge = (facetDetails && facetDetails.style === 'Filter on top') || false; // || type === SearchPageType.SEARCH;

    const results = searchResult.results.map((x) => <UserContext.Consumer key={x.pid}>{(user) => <ProductCard key={x.pid} product={x} siteVersion={siteVersion} user={user} overlayText={edgeToEdge} />}</UserContext.Consumer>);

    return (
      <BaseLayout>
        <SEOIndexPage
          siteVersion={siteVersion}
          shouldIndex={(facetDetails ? facetDetails.pageIndex : false) as any}
          title={facetDetails ? facetDetails.metaTitle : query ? `Search results for ${query}` : 'Search results'}
          description={facetDetails ? facetDetails.metaDescription : undefined}
          image={facetDetails ? facetDetails.metaImage : undefined}
          canonicalUrl={facetDetails ? facetDetails.slug : undefined}
        />
        <style jsx>{`
          @import 'vars';

          .grid {
            @include grid;

            .Container {
              @include grid-column(9);

              @include mobile {
                @include grid-column(12);
              }
            }
          }

          .Container {
            position: relative;

            &__Grid {
              display: flex;
              flex-wrap: wrap;
              margin: 0 (-$space-base/2);
              transition: filter 0.4s ease-out, opacity 0.4s ease-out;
              padding-top: 4 * $space-base;

              &--EdgeToEdge {
                padding-top: $search-filter-bar-height;
                background-color: $color-grey96;

                @include mobile {
                  padding-top: 0;
                }

                :global(.ProductCard),
                :global(.SearchResultAd) {
                  order: 5;

                  width: 50%;

                  @include desktop {
                    width: 25%;
                  }

                  @include media('>desktopLarge') {
                    width: 25%;
                  }

                  margin: 0;
                  padding: 0;
                }
              }

              &--NotEdgeToEdge {
                :global(.ProductCard),
                :global(.SearchResultAd) {
                  @include grid-column-narrow-padding(6);
                  margin-bottom: 2 * $space-base;
                  order: 5;

                  @include desktop {
                    margin-bottom: 6 * $space-base;
                    @include grid-column-narrow-padding(4);
                  }

                  @include media('>desktopLarge') {
                    @include grid-column-narrow-padding(3);
                  }
                }
              }

              &--HasAd {
                :global(.ProductCard) {
                  &:nth-child(2) {
                    order: 1;
                  }
                  &:nth-child(3) {
                    order: 2;
                  }
                  &:nth-child(4) {
                    order: 3;
                  }
                  &:nth-child(5) {
                    order: 4;
                  }
                }

                :global(.SearchResultAd) {
                  order: 2;

                  @include desktop {
                    order: 3;
                  }

                  @include media('>desktopLarge') {
                    order: 4;
                  }
                }
              }

              &--loading {
                pointer-events: none;
                filter: grayscale(100%);
                opacity: 0.3;
              }
            }

            :global(.loading-more-loader) {
              display: flex;
              justify-content: center;
              align-items: center;
              flex: 1;
              padding: space(8) 0;
            }
            :global(.loading-more-loader--background) {
              background-color: $color-grey96;
            }

            .page-loader {
              text-align: center;
              max-width: 500px;
              margin-bottom: 4 * $space-base;

              &--overlay {
                position: absolute;
                z-index: 3;
                left: calc(50%);
                transform: translate(-50%, 0);
                top: 12 * $space-base;

                @include mobile {
                  top: 3 * $space-base;
                }
              }

              h2 {
                margin-bottom: 5 * $space-base;
              }
              :global(.spinner) {
                margin: auto;
              }
            }
          }
        `}</style>

        <Desktop>
          {!edgeToEdge && this.renderHeader()}

          {edgeToEdge && (
            <SearchFilterBar
              title={this.getTitle()}
              facetConfiguration={searchResult.facetConfigurations[FACET_CONFIGURATION_TITLE]}
              facetGroups={searchResult.facetGroups}
              selectedFacets={selectedFacets}
              baseFacets={baseFacets}
              onResetFiltersForGroup={onResetFiltersForGroup}
              onResetAllFilters={onResetAllFilters}
              onSelected={onFacetSelected}
            />
          )}
        </Desktop>

        <Mobile>
          {this.renderHeader()}
          {this.renderSearchFilterMobile()}
        </Mobile>

        <div className={edgeToEdge ? '' : 'grid'}>
          <Desktop>{!edgeToEdge && this.renderSidebar()}</Desktop>

          <section className={'Container'} ref={this.resultsContainerRef}>
            {isLoading && (
              <div className={classnames('page-loader', { 'page-loader--overlay': results.length > 0 })}>
                <Spinner color="black" width={48} height={48} />
              </div>
            )}

            {results.length > 0 && (
              <InfiniteScroll
                pageStart={0}
                loadMore={onLoadMore}
                hasMore={hasMore}
                initialLoad={false}
                threshold={300}
                loader={
                  <div key={'loader'} className={classnames('loading-more-loader', { 'loading-more-loader--background': edgeToEdge })}>
                    <Spinner width={32} height={32} color={'grey79'} />
                  </div>}
                useCapture={{ passive: true }}
              >
                <div className={classnames('Container__Grid', { 'Container__Grid--loading': isLoading, 'Container__Grid--EdgeToEdge': edgeToEdge, 'Container__Grid--NotEdgeToEdge': !edgeToEdge, 'Container__Grid--HasAd': showAd })}>
                  {showAd && <SearchResultAd key="ad" />}
                  {results}
                </div>
              </InfiniteScroll>
            )}

            {results.length === 0 && !isLoading && <SearchResultEmpty type={type} onResetAllFilters={onResetAllFilters} />}
          </section>
        </div>
      </BaseLayout>
    );
  }

  // #endregion
}

export default SearchResultPage;
