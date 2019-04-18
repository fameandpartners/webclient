import React from 'react';
import classnames from 'classnames';

import { SiteVersion } from '@common/constants';
import { RouteComponentProps } from 'react-router';
import Modal from '@components/modal/Modal';
import { FormattedMessage } from 'react-intl';
import Button from '@components/base/Button/Button';
import DressFinderCard from '@components/product/DressFinderCard';
import { getDressFinderComponentsFromUrl, generateDressFinderUrl, BASEURL_DRESS_SYSTEM_SEARCH } from '@common/utils/url-helper';
import Header from '@components/layout/Header/Header';
import { User, DocumentSearchArgs, FacetGroup, Facet, FacetGroups, FacetConfiguration, OrderCustomizedProduct, Order } from '@typings';
import CartContainer from '@components/layout/Cart/CartContainer';
import { countCartItems } from '@common/utils/cart-helper';
import { convertToProductMedia } from '@common/utils/render-url-helper';
import { trackSelectDressFinderOption, trackPageView, trackDeselectDressFinderOption, trackDressFinderCompletedSection } from '@common/analytics/analytics';
import { SearchModelRootState } from '@common/rematch/models/search';
import FullScreenLoader from '@components/base/FullScreenLoader';
import KeyListener from '@components/event-listener/KeyListener';
import { KeyCodes } from '@common/utils/key-codes';
import { CmsPageGlobalConfig } from '@components/cms/CmsPageGlobalConfig';
import { CmsElementState } from '@common/rematch/models/cms';

export const FACET_CONFIGURATION_TITLE = 'dressfinder';
const EMPTY_FACET_GROUP = {};
const FACET_GROUP_KEY = 'slug';

export const DRESSFINDER_SEARCH_ARGS: DocumentSearchArgs = {
    pageSize: 0,
    returnFacets: true,
    useSpree: false,
    boostPids: [],
    boostFacets: [],
};

interface Props extends RouteComponentProps<{ slug: string, components: string }> {
    siteVersion: SiteVersion;
    cmsPageConfig: CmsElementState<CmsPageGlobalConfig> | undefined;
    downloadDocument: (query: DocumentSearchArgs) => void;

    searchResult: SearchModelRootState;

    openCart: () => void;
    closeCart: () => void;
    removeFromCartAsync: (item: OrderCustomizedProduct) => void;

    user: User | null;
    cart: Order | null;
    isCartVisible: boolean;
    isErrorRemovingList: number[];
    isRemovingList: number[];
}

interface State {
    uncomittedDressOptions: string[];
    currentFacetGroup: FacetGroup;
    availableFacetGroups: FacetGroups;
}

class DressFinder extends React.Component<Props, State> {

    public state: State = {
        uncomittedDressOptions: getDressFinderComponentsFromUrl(this.props.match.params.components),
        currentFacetGroup: Object.keys(this.props.searchResult.facetConfigurations).includes(FACET_CONFIGURATION_TITLE)
            ? this.props.searchResult.facetGroups[this.props.match.params.slug || this.props.searchResult.facetConfigurations[FACET_CONFIGURATION_TITLE].flatMap((x) => x.facetGroupIds).first()!]
            : EMPTY_FACET_GROUP as FacetGroup,
        availableFacetGroups: Object.keys(this.props.searchResult.facetConfigurations).includes(FACET_CONFIGURATION_TITLE)
            ? DressFinder.extractFacetGroups(this.props.searchResult.facetConfigurations, this.props.searchResult.facetGroups)
            : {},
    };

    public static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> {
        // Get options from slug
        const { match: { params: { slug } }, searchResult: { facetConfigurations, facetGroups } } = nextProps;
        const { availableFacetGroups } = prevState;

        if (!Object.keys(facetConfigurations).includes(FACET_CONFIGURATION_TITLE)) {
            return {};
        }

        const updatedFacetGroups: FacetGroups = DressFinder.extractFacetGroups(facetConfigurations, facetGroups);

        // Don't change the rendered state so we don't have jumping icons
        const firstKey = facetConfigurations[FACET_CONFIGURATION_TITLE].flatMap((x) => x.facetGroupIds).first()!;
        const facetGroup = Object.keys(updatedFacetGroups).includes(slug)
            ? updatedFacetGroups[slug]
            : updatedFacetGroups[firstKey];

        return {
            currentFacetGroup: facetGroup,
            availableFacetGroups: updatedFacetGroups,
        };
    }

    private static extractFacetGroups(facetConfigurations: FacetConfiguration, facetGroups: FacetGroups) {
        return facetConfigurations[FACET_CONFIGURATION_TITLE]
                    .flatMap((x) => x.facetGroupIds)
                    .map((x) => (facetGroups[x]))
                    .filter((x) => x.facets.some((f) => f.docCount > 0))
                    .flattenToObject(FACET_GROUP_KEY);
    }

    public componentDidMount() {
        const { searchResult, downloadDocument } = this.props;

        if (Object.keys(!searchResult || searchResult.facetConfigurations).length === 0) {
            downloadDocument(DRESSFINDER_SEARCH_ARGS);
        }

        trackPageView(this.props.siteVersion, 'dressfinder', null, null, null);
    }

    // #region Navigation

    private goNext() {
        const { uncomittedDressOptions } = this.state;
        // const hasSelectedOption = this.state.currentFacetGroup.facets.map((f) => f.facetId).intersection(this.state.uncomittedDressOptions).length > 0;
        this.go(true, uncomittedDressOptions);
    }

    private goPrev() {
        // Deselect current facet
        const facetIds = this.state.currentFacetGroup.facets.map((f) => f.facetId);
        const uncomittedDressOptions = this.state.uncomittedDressOptions.filter((x) => !facetIds.includes(x));
        this.go(false, uncomittedDressOptions);
        this.setState({ uncomittedDressOptions });
    }

    private go(forward: boolean, uncomittedDressOptions: string[]) {
        const { history, match: { params: { slug } } } = this.props;
        const { availableFacetGroups } = this.state;

        this.props.downloadDocument({
            ...DRESSFINDER_SEARCH_ARGS,
            facets: uncomittedDressOptions,
        });

        // Recalculate availableFacetGroups as they may have changed on selection
        // FacetCount = 0 when Non FacetCategory changed.
        // Facet gone when FacetGategory changed.
        const facetGroupValues = Object.entries(availableFacetGroups).filter(([ _, value ]) => value.facets.length > 0).map(([ _, value ]) => value).filter((x) => x.facets.some((f) => f.docCount > 0)).flattenToObject(FACET_GROUP_KEY);

        trackDressFinderCompletedSection(
            this.state.currentFacetGroup,
            this.state.currentFacetGroup.facets.filter((f) => this.state.uncomittedDressOptions.includes(f.facetId))
        );

        const url = generateDressFinderUrl(facetGroupValues, forward, slug, uncomittedDressOptions);
        if (url) {
            history.push(url);
        } else {
            this.onComplete();
        }
    }

    // #endregion

    // #region Event Handlers
    private onSelected(option: string) {
        const { match: { params: { slug } } } = this.props;
        const { uncomittedDressOptions, currentFacetGroup } = this.state;

        let updatedDressOptions = [ ...uncomittedDressOptions ];
        const optionAlreadySelected = updatedDressOptions.includes(option);

        if (optionAlreadySelected) {
            trackDeselectDressFinderOption(option, currentFacetGroup);
            updatedDressOptions = updatedDressOptions.filter((x) => x !== option);
        }

        if (!currentFacetGroup.multiselect) {
            updatedDressOptions = uncomittedDressOptions.difference(currentFacetGroup.facets.map((f) => f.facetId));
        }

        if (!optionAlreadySelected) {
            // Now add this new one in
            trackSelectDressFinderOption(option, currentFacetGroup);
            updatedDressOptions.push(option);
        }

        if (slug === 'category') {
            // Categories clear out everything else
            updatedDressOptions = [option];
        }

        return this.setState({ uncomittedDressOptions: updatedDressOptions });

    }

    private onComplete() {
        const { history } = this.props;
        const { uncomittedDressOptions } = this.state;

        history.push(`${BASEURL_DRESS_SYSTEM_SEARCH}/${uncomittedDressOptions.join('/')}`);
    }

    private replaceColorOrFabricCode(f: Facet) {
        const { match: { params: { slug } } } = this.props;
        const { uncomittedDressOptions, availableFacetGroups, currentFacetGroup } = this.state;

        if (slug === 'color') {
            return f.previewImage;
        }

        const colorFacetGroup = 'color' in availableFacetGroups && availableFacetGroups.color;

        if (colorFacetGroup && currentFacetGroup.title !== colorFacetGroup.title) {
            const colorFacetIds = colorFacetGroup.facets.map((x) => x.facetId);
            let updatedPreviewImage = f.previewImage;
            const currentColorSelected = uncomittedDressOptions.intersection(colorFacetIds).first();

            if (currentColorSelected) {
                const colorCodes = colorFacetGroup.facets.map((x) => x.facetMeta!.code);
                const currentColorCode = colorFacetGroup.facets.find((x) => x.facetId === currentColorSelected)!.facetMeta!.code;

                const splitImageItems = f.previewImage.split('/');
                const previewImageCodes = splitImageItems.slice(splitImageItems.length - 1, splitImageItems.length).first()!;

                colorCodes.some((x) => {
                    const hasColor = previewImageCodes.includes(x);

                    updatedPreviewImage = updatedPreviewImage.replace(previewImageCodes, previewImageCodes.replace(x, currentColorCode));

                    return hasColor;
                });

                return updatedPreviewImage;
            }
        }

        return f.previewImage;
    }

    // #endregion

    // #region Render

    private renderStep() {
        const { currentFacetGroup, availableFacetGroups } = this.state;

        const facetGroupValues = Object.entries(availableFacetGroups).map(([ _, value ]) => value);

        const step = facetGroupValues.findIndex((x) => x.title === currentFacetGroup.title) + 1;

        return (
            <p className={'step'}>
                <style jsx>{`
                    @import 'vars';

                    .step {
                        @include text-style-title;
                        text-transform: uppercase;
                        margin: 0;
                    }
                `}</style>
                <FormattedMessage defaultMessage={'{step} of {length}'} id={'DressFinder.StepCount'} values={{ step, length: facetGroupValues.length }} />
            </p>
        );
    }

    private renderHeader() {
        const { user, siteVersion, cart, openCart, cmsPageConfig } = this.props;
        const cartItemCount = countCartItems(cart);

        return cmsPageConfig && cmsPageConfig.element && (
            <Header user={user} cartItemCount={cartItemCount} openShoppingCart={openCart} pageConfig={cmsPageConfig.element} />
        );
    }

    private renderFooter() {
        const { match: { params: { slug } } } = this.props;
        const { availableFacetGroups } = this.state;

        const keys = Object.keys(availableFacetGroups);
        const currentIndex = slug ? keys.indexOf(slug) : 0;

        const elements = [];

        if (currentIndex > 0) {
            elements.push(
                <Button
                    key="prev"
                    onClick={() => this.goPrev()}
                    className="action-buttons"
                    tertiary
                >
                    <FormattedMessage id="previous" defaultMessage="Previous" />
                </Button>
            );
        }

        if (currentIndex === keys.length - 1) {
            elements.push(
                <Button
                    key="done"
                    onClick={() => this.goNext()}
                    className="action-buttons"
                    secondary
                >
                    <FormattedMessage id="done" defaultMessage="Done" />
                </Button>
            );
        } else if (currentIndex >= 0) {
            elements.push(
                <Button
                    key="next"
                    className="action-buttons"
                    errorText={<FormattedMessage id={'DressFinder.Error.Unselected'} defaultMessage={'Please select an option.'} />}
                    onClick={() => this.goNext()}
                    secondary
                >
                    <FormattedMessage id="next" defaultMessage="Next" />
                </Button>
            );
        }

        return elements;
    }

    public render() {
        const {
            siteVersion,
            searchResult,
            cart,
            closeCart,
            removeFromCartAsync,
            isCartVisible,
            isErrorRemovingList,
            isRemovingList
        } = this.props;
        const { currentFacetGroup, uncomittedDressOptions } = this.state;

        if (Object.keys(currentFacetGroup).length === 0 || searchResult.isLoading) {
            return <FullScreenLoader />;
        }

        return (
            <Modal
                headerNodes={this.renderHeader()}
                footerNodes={this.renderFooter()}
                siteVersion={siteVersion}
            >
                <KeyListener
                    options={[
                        { keyCode: KeyCodes.Left, action: () => this.goPrev() },
                        { keyCode: KeyCodes.Right, action: () => this.goNext() },
                        { keyCode: KeyCodes.Return, action: () => this.goNext() },
                    ]}
                />
                <style jsx>{`
                    @import 'vars';

                    .DressFinder__Container {
                        height: calc(100% - #{$navbar-height} - #{$modal-footer-height});
                        width: 100%;

                        padding: 14*$space-base 0 0;

                        display: flex;
                        align-items: center;
                        flex-direction: column;

                        h1, h5 {
                            text-align: center;
                        }

                        @include mobile {
                            padding: 9*$space-base 0 0;
                        }
                    }

                    .DressFinder__Options__Container {
                        @include grid;
                        padding-top: 7*$space-base;
                        justify-content: center;

                        @include mobile {
                            padding-top: 0;
                        }

                        :global(.dress-finder-card) {
                            @include grid-column(2.4);
                            padding-bottom: 4*$space-base;

                            @include mobile {
                                @include grid-column(6);
                                padding-bottom: 2*$space-base;
                            }
                        }
                    }

                `}</style>
                <div className={'DressFinder__Container'}>
                    {/* {this.renderStep()} */}
                    <h1>{currentFacetGroup.title}</h1>
                    <h5>{currentFacetGroup.subtitle}</h5>

                    <div className={classnames('DressFinder__Options__Container')}>
                        {currentFacetGroup.facets.filter((x) => x.docCount > 0).map((f: Facet) => (
                            <DressFinderCard
                                key={f.facetId}
                                title={f.title}
                                subtitle={f.subtitle}
                                image={convertToProductMedia(f.previewImage, 0, 0)}
                                isSelected={uncomittedDressOptions.includes(f.facetId)}
                                onClick={() => this.onSelected(f.facetId)}
                            />
                        ))}
                    </div>
                </div>

                <CartContainer
                    siteVersion={siteVersion}
                    cart={cart}
                    isCartVisible={isCartVisible}
                    isErrorRemovingList={isErrorRemovingList}
                    isRemovingList={isRemovingList}
                    closeCart={closeCart}
                    removeFromCartAsync={removeFromCartAsync}
                />
            </Modal>
        );
    }

    // #endregion
}

export default DressFinder;
