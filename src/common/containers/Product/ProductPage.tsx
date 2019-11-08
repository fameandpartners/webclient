import { RENDER_IMAGE_SIZES } from '@common/constants';
import { NotFoundError } from '@common/utils/error-reporting';
import { OrientationType } from '@common/utils/orientation-type';
import { PreviewType } from '@common/utils/preview-type';
import { getParentComponentCodes } from '@common/utils/product-component';
import { findImage, findImages, getMainImageUrlForRender, formatProductId, findSimilarSilhouetteImages } from '@common/utils/render-url-helper';
import { generateProductDetailUrl, isCustomDress, generateProductUrlForPid, URL_COMPONENT_SEPARATOR, isCCSDress } from '@common/utils/url-helper';
import { ZoomType } from '@common/utils/zoom-type';
import SEOIndexPage from '@components/base/Seo/SeoIndexPage';
import CustomizeInline from '@components/customization/CustomizeInline';
import ErrorPage from '@components/error-page/ErrorPage';
import GallerySlider from '@components/gallery-modal/GallerySlider';
import ProductImage from '@components/product/ProductImage';
import ProductInfo from '@components/product/ProductInfo';
import SimilarDresses from '@components/product/SimilarDresses';
import BaseLayout from '@containers/BaseLayout';
import classnames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router';
import { CustomizedProduct, Group, ProductMedia, SectionGroup, ProductListSummaries } from 'typings/product';
import { mapToCode, getDressLengthClass, isNewProduct } from '@common/utils/product';
import { isSizeSection } from '@common/utils/product-validation';
import GallerySection from '@components/product/GallerySection';
import { SiteVersionContext } from '@common/context/SiteVersionContext';
import { trackStartCustomize } from '@common/analytics/analytics';
import { Desktop, DesktopLarge, Mobile } from '@components/base/MediaQuerySSR';
import HideChatBubble from '@components/Chat/HideChatBubble';
import Sticky from '@components/base/Sticky';
import FullScreenLoader from '@components/base/FullScreenLoader';
import { RenderPositionId } from '@common/utils/render-position-id';
import { CmsPageGlobalConfig } from '@components/cms/CmsPageGlobalConfig';
import { CmsElementState } from '@common/rematch/models/cms';
import { transformToReactComponents } from '@containers/CmsPage/CmsPage';
import { User } from '@typings';
const FameLogo = require('@svg/i-fame-logo.svg').default;

interface Props extends RouteComponentProps<{}> {
  addToCart: (cp: CustomizedProduct) => void;
  isAddingToCart: boolean;
  isErrorAddingToCart: boolean;
  customizeBeforeAddingToCart: boolean;

  currentCustomizedProduct: CustomizedProduct;
  productListSummaries: ProductListSummaries;
  orientation: OrientationType;
  showOrientation: (orientation: OrientationType, trackEvent: boolean) => void;
  saveSelection: (customizedProduct: CustomizedProduct) => void;

  goToCustomizationStep: (group: Group, sectionGroup: SectionGroup | null, customizedProduct: CustomizedProduct, trackingLabel: string) => void;
  goToGallery: (position: number, customizedProduct: CustomizedProduct) => void;
  goToProductPage: (np: CustomizedProduct) => void;

  loadProductSummaries: (pids: string[]) => void;
  loadSimilarSilhouettes: (silhouette: string) => void;

  pageConfig?: CmsElementState<CmsPageGlobalConfig>;

  user: User | null;
}

interface State {
  currentImageIndex: number;
  initialCustomizedProduct: CustomizedProduct;
  uncomittedCustomizedProduct: CustomizedProduct;
  currentSectionGroup: SectionGroup | null;
  hasChatted: boolean;
}

class ProductPage extends React.PureComponent<Props, State> {
    public state: State = {
      currentImageIndex: 0,
      initialCustomizedProduct: this.props.currentCustomizedProduct,
      uncomittedCustomizedProduct: this.props.currentCustomizedProduct,
      currentSectionGroup: null,
      hasChatted: false
    };

    public static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> {
      const nextCodes = nextProps.currentCustomizedProduct.components.map(mapToCode);
      const currCodes = prevState.initialCustomizedProduct.components.map(mapToCode);
      if (nextCodes.allDifference(currCodes).length > 0) {
          const pid = formatProductId(nextProps.currentCustomizedProduct);

          if (nextProps.productListSummaries[pid]) {
              nextProps.loadSimilarSilhouettes(nextProps.productListSummaries[pid]!.primarySilhouetteId);
          }

          return {
              initialCustomizedProduct: nextProps.currentCustomizedProduct,
              uncomittedCustomizedProduct: nextProps.currentCustomizedProduct,
          };
      }
      return {};
    }

    private onStartChat = () => {
      this.setState({hasChatted: true});
      if ('$zopim' in global) {
          (global as any).$zopim.livechat.window.show();
      }
    }

    // #region Renders

    private renderImage() {
        const { goToGallery, showOrientation, orientation, currentCustomizedProduct, productListSummaries } = this.props;
        const { uncomittedCustomizedProduct, currentSectionGroup } = this.state;

        const isCurrentlyCustomizing = this.state.currentSectionGroup !== null;
        const customizedProduct = isCurrentlyCustomizing ? uncomittedCustomizedProduct : currentCustomizedProduct;

        // So what we can render is as follows
        // 1. Gallery scroll - Curated Images for this pid
        // 2. Gallery scroll - Curated Images for legacy dress // this pid
        // 3. Gallery scroll + orientation image - Render for this pid + similar styles

        const pid = formatProductId(customizedProduct);
        const currentSummary = productListSummaries[pid];

        const images = findImages(customizedProduct, currentSummary);
        const summaryHasCurations = currentSummary && Array.isArray(currentSummary!.media) && currentSummary!.media!.length > 0;

        const showCurations = (customizedProduct.product.previewType === PreviewType.Render && summaryHasCurations) || customizedProduct.product.previewType !== PreviewType.Render;
        const showRenders = customizedProduct.product.previewType === PreviewType.Render && !showCurations;
        const showStretchBg = showRenders;

        const image = showRenders && !summaryHasCurations
            ? getMainImageUrlForRender(customizedProduct, orientation, ZoomType.Top, RENDER_IMAGE_SIZES)
            : images.first()!;

        let hideOnMobile = false;
        if (currentSectionGroup) {
            if (currentSectionGroup.previewType === PreviewType.Cad || currentSectionGroup.previewType === PreviewType.Image) {
                hideOnMobile = true;
            } else {
                const firstSection = currentSectionGroup.sections.first();
                hideOnMobile = firstSection ? isSizeSection(firstSection) : false;
            }
        }

        return (
            <React.Fragment>
                <div
                    className={classnames(
                        'PDP__Column__MainImage',
                        {
                            'PDP__Column__MainImage--hide-on-mobile': hideOnMobile,
                            'PDP__Column__MainImage--render': showRenders,
                        })
                    }
                >
                    <style jsx>{`
                        @import 'vars';

                        .PDP__Column__MainImage {
                            @include grid-column(6);
                            padding: 0;

                            @include mobile {
                                position: relative;
                            }

                            @include desktop {
                                @include grid-offset-margin-right(0.5);
                            }

                            :global(.dress-length--KN) {
                                :global(picture) {
                                    margin-top:20%;
                                }
                            }

                            :global(.dress-length--MN) {
                                :global(picture) {
                                    margin-top:30%;
                                }
                            }
                            :global(.dress-length--MM) {
                                :global(picture) {
                                    margin-top:30%;
                                }
                            }

                            :global(.dress-length--MD) {
                                :global(picture) {
                                    margin-top:15%;
                                }
                            }

                            :global(.dress-length--AK) {
                                :global(picture) {
                                    margin-top:5%;
                                }
                            }
                            :global(.dress-length--FM) {
                                :global(picture) {
                                    margin-top:0%;
                                }
                            }
                            :global(.dress-length--CM) {
                                :global(picture) {
                                    margin-top:0%;
                                }
                            }

                            @include mobile {
                                @include grid-column(12);
                                padding: 0;
                            }

                            :global(.GallerySlider) {
                                width: 100%;
                            }

                            &--render {
                                background: $background-image-color;

                                text-align: center;
                            }


                            &--hide-on-mobile {
                                @include mobile {
                                    display: none;
                                    height: 0;
                                }
                            }

                            .SimilarStyles--header--top-spacer {
                                padding-top: space(6);
                            }

                            .SimilarStyles--header--bottom-spacer {
                                padding-bottom: space(6);
                            }

                            .SimilarStyles--header {
                                background-color: rgba(255,255,255,0.8);

                                padding: space(6) 0;

                                text-align: center;
                            }

                            :global(.SimilarStyles--header--sticky .SimilarStyles--header) {
                                padding: space(2) 0;

                                :global(h2) {
                                    @include text-style-h3;
                                    line-height: space(4);
                                    margin-bottom: space();
                                }

                                :global(p) {
                                    margin-bottom: space();
                                }

                                transition: font-size 200ms linear, padding 200ms linear;
                            }
                        }

                        :global(.OverlayText) {
                            position: absolute;
                            color: $color-white;

                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;

                            left: space(2);
                            right: space(2);
                            top: calc(100vh - #{$navbar-height} - #{space(5)});

                            @include mobile {
                                top: unset;
                                bottom: 0;
                            }
                        }

                        :global(.OverlayText--render) {
                            text-align: left;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            margin: space(-6) space(2) space(2);
                        }

                        :global(.OverlayText--style) {
                            position: absolute;
                            margin: 0;
                            bottom: space(3);
                            left: space(3);

                            text-decoration: underline;
                        }
                    `}</style>
                    {showRenders &&
                        <React.Fragment>
                            <ProductImage
                                image={image}
                                onClick={() => goToGallery(orientation  === OrientationType.Front ? 0 : 1, uncomittedCustomizedProduct)}
                                isRender
                                orientation={orientation}
                                showOrientation={showOrientation}
                                className={summaryHasCurations ? '' : getDressLengthClass(customizedProduct.components)}
                            />
                            {currentSummary && currentSummary.overlayText && <p className={'OverlayText--render'}>{currentSummary!.overlayText}</p>}
                        </React.Fragment>
                    }
                    {showCurations && (
                        <React.Fragment>
                            <Mobile>
                                <GallerySlider
                                    showBackground
                                    images={images}
                                    position={this.state.currentImageIndex}
                                    onLeft={() => {
                                        let prev = (this.state.currentImageIndex - 1);
                                        prev = prev < 0 ? images.length - 1 : prev;
                                        this.setState({ currentImageIndex: prev });
                                    }}
                                    onRight={() => {
                                        const next = (this.state.currentImageIndex + 1) % images.length;
                                        this.setState({ currentImageIndex:  next });
                                    }}
                                    close={() => null}
                                    useAspectRatio
                                    containerClass={summaryHasCurations ? '' : getDressLengthClass(customizedProduct.components)}
                                    onClick={() => goToGallery(this.state.currentImageIndex, uncomittedCustomizedProduct)}
                                />
                                {currentSummary && currentSummary.overlayText && <p className={'OverlayText'}>{currentSummary!.overlayText}</p>}
                            </Mobile>
                            <Desktop>
                                <GallerySection
                                    productMedia={images}
                                    currentPid={pid}
                                >
                                    {currentSummary && currentSummary.overlayText && <p className={'OverlayText'}>{currentSummary!.overlayText}</p>}
                                </GallerySection>
                            </Desktop>
                        </React.Fragment>
                    )}
                </div>
                {showStretchBg && <DesktopLarge><div className="PDP__BG__Stretch" /></DesktopLarge>}
            </React.Fragment>
        );
    }

    private renderLogo() {
        const { currentCustomizedProduct } = this.props;
        const { product } = currentCustomizedProduct;

        const pid = formatProductId(currentCustomizedProduct);
        const productListSummary = this.props.productListSummaries[pid];

        return (
            <React.Fragment>
                <style jsx>{`
                    @import 'vars';

                    h1 {
                        margin: 0;
                        text-align: center;
                        font-size: 14px;
                        line-height: 18px;
                        max-width: calc(100vw - 128px);
                    }
                `}</style>
                <Mobile><h1>{(productListSummary && productListSummary.name) || product.curationMeta.name}</h1></Mobile>
                <Desktop>
                    <div className={'logo-wrapper'}>
                        {/* TODO: React router */}
                        <a href="/" title="Go to homepage">
                            <FameLogo style={{ width: 200, height: 26 }} />
                        </a>
                    </div>
                </Desktop>
            </React.Fragment>
        );
    }

    private renderConfiguration() {
        const {
            currentCustomizedProduct,
            goToCustomizationStep,
            isAddingToCart,
            isErrorAddingToCart,
            goToProductPage,
            addToCart,
            customizeBeforeAddingToCart
        } = this.props;

        return (
            <Sticky desktopOnly className={'PDP__Column__Configuration'}>
                <style jsx>{`
                    @import 'vars';

                    :global(.PDP__Column__Configuration) {
                        @include grid-column(5);
                        display: flex;
                        position: relative;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;

                        @include mobile {
                            @include grid-column(12);
                            margin-top: 0;
                            margin-left: 0;
                        }

                        @include desktop {
                            height: calc(100vh - #{$navbar-height});
                        }

                        :global(.CustomizeInline),
                        :global(.ProductInfo) {
                            @include desktop {
                                margin: space(4) 0;
                                max-width: 579px;
                            }
                        }
                    }
                `}</style>
                <Switch>
                    <Route
                        path={this.props.match.path + '/customize/:groupSlug/:sectionGroupSlug?'}
                        render={({ match: submatch }) => {
                            const groupSlug = submatch.params.groupSlug;
                            const sectionGroupSlug = submatch.params.sectionGroupSlug;

                            const group = currentCustomizedProduct.product.groups.find((x) => x.slug === groupSlug);

                            if (!group) {
                                throw new NotFoundError();
                            }

                            const sectionGroup = sectionGroupSlug
                                ? group.sectionGroups.find((x) => x.slug === sectionGroupSlug)
                                : group.sectionGroups[0];
                            if (!sectionGroup) {
                                throw new NotFoundError();
                            }

                            if (
                                (this.state.currentSectionGroup && this.state.currentSectionGroup.slug !== sectionGroup.slug)
                                || !this.state.currentSectionGroup
                            ) {
                                this.props.showOrientation(sectionGroup.renderPositionId === RenderPositionId.BackTop ? OrientationType.Back : OrientationType.Front, false);
                                this.setState({ currentSectionGroup: sectionGroup });
                            }

                            return (
                                <CustomizeInline
                                    customizeBeforeAddingToCart={customizeBeforeAddingToCart}
                                    initialCustomizedProduct={currentCustomizedProduct}
                                    uncomittedCustomizedProduct={this.state.uncomittedCustomizedProduct}
                                    currentGroup={group}
                                    currentSectionGroup={sectionGroup}

                                    goToProductPage={goToProductPage}
                                    goToCustomizationStep={goToCustomizationStep}
                                    addToCart={addToCart}
                                    onCustomizationChange={(options, component) => {
                                        this.setState((prevState) => {
                                            const updatedUncomittedCustomizedProduct = {
                                                ...prevState.uncomittedCustomizedProduct,
                                                ...options,
                                            };

                                            // Handle getting updated product meta
                                            const pid = formatProductId(updatedUncomittedCustomizedProduct);
                                            if (isNewProduct(updatedUncomittedCustomizedProduct.product.productId) && !pid.endsWith(URL_COMPONENT_SEPARATOR)) {
                                                this.props.loadProductSummaries([pid]);
                                            }

                                            return {
                                                uncomittedCustomizedProduct: updatedUncomittedCustomizedProduct,
                                            };
                                        });

                                        // Handle orientation changes for extras
                                        if (component && component.renderPositionId && component.renderPositionId.includes('Back')) {
                                            this.props.showOrientation(OrientationType.Back, false);
                                        } else {
                                            this.props.showOrientation(OrientationType.Front, false);
                                        }
                                    }}
                                />
                            );
                        }}
                    />

                    <Route
                        path={this.props.match.path}

                        render={() => {
                            if (this.state.currentSectionGroup !== null) {
                                this.setState({ currentSectionGroup: null });
                            }

                            return (
                                <ProductInfo
                                currentCustomizedProduct={currentCustomizedProduct}
                                productListSummaries={this.props.productListSummaries}
                                goToCustomizationStep={(g, sg, cp, trackingLabel) => {
                                  trackStartCustomize(g, sg, cp, trackingLabel);
                                  goToCustomizationStep(g, sg, cp, trackingLabel);
                                }}
                                addToCart={addToCart}
                                isAddingToCart={isAddingToCart}
                                isErrorAddingToCart={isErrorAddingToCart}
                                onStartChat={this.onStartChat}
                                user={this.props.user}
                                />
                            );
                        }}
                    />
                    <Route render={() => <ErrorPage type={404} />} />
                </Switch>
            </Sticky>
        );
    }

    private renderCopy() {
        const images = findImages(this.props.currentCustomizedProduct);
        const { product, components } = this.props.currentCustomizedProduct;
        const fitDescription = images.length > 0 && images[0].fitDescription;
        const sizeDescription = images.length > 0 && images[0].sizeDescription;

        const fabricDescriptions = components
            .filter((x) => x.meta && x.meta.fabricDescription)
            .map((x) => x.meta.fabricDescription).uniqueMap();

        const careDescriptions = components
            .filter((x) => x.meta && x.meta.careDescription)
            .map((x) => x.meta.careDescription)
            .uniqueMap();

        const isCurrentlyCustomizing = this.state.currentSectionGroup !== null;

        const pid = formatProductId(this.props.currentCustomizedProduct);
        const productSummary = this.props.productListSummaries[pid];
        const productDescription = (productSummary && productSummary.description) || product.curationMeta.description;

        return (
            <div className={classnames('PDP__Section PDP__Section--Copy', { PDP__HideOnMobile: isCurrentlyCustomizing })}>
                <style jsx>{`
                    @import 'vars';

                    .PDP__Section--Copy {

                        text-align: center;

                        .PDP__Section__Copy--column {
                            .pre-line {
                                white-space: pre-line;
                                margin-bottom: 2 * $space-base;
                                width: 100%;

                                p::empty {
                                    display: none;
                                }
                                &::last-child {
                                    margin-bottom: 0;
                                }
                            }

                            @include mobile {
                                // Chrome requires this
                                width: 100%;
                            }

                            @include desktop {
                                @include grid-column(6);
                                .pre-line{
                                    max-width: 600px;
                                    margin-left:auto;
                                    margin-right:auto;
                                }
                            }
                        }

                        .copy-title {
                            @include text-style-form-label;
                            text-transform: uppercase;
                            margin-bottom: $space-base;
                        }

                        .PDP__Section__Copy--table {
                            margin-bottom: 6*$space-base;

                            &:last-child{
                                margin-bottom:0;
                            }

                            > strong {
                                width: 200px;
                            }

                            @include mobile {
                                text-align: center;
                            }
                        }
                    }
                `}</style>
                <div className="PDP__Section__Copy--column">
                    {(productDescription || fitDescription || sizeDescription) &&
                        <div className={'PDP__Section__Copy--table'}>
                            {productDescription &&
                                <React.Fragment>
                                    <p className="copy-title"><FormattedMessage id={'Description'} defaultMessage={'Description'} /></p>
                                    <div className="pre-line" dangerouslySetInnerHTML={{ __html: productDescription }} />
                                </React.Fragment>
                            }
                            {fitDescription && (
                                <div className="pre-line" dangerouslySetInnerHTML={{ __html: fitDescription }} />
                            )}
                            {sizeDescription && (
                                <div className="pre-line" dangerouslySetInnerHTML={{ __html: sizeDescription }} />
                            )}
                            {/* <p className="text-secondary">
                                $5 of each sale is donated to UN Women and Plan International.{' '}
                                <a href="/iequalchange" target="_blank">
                                    Learn more.
                                </a>
                            </p> */}
                        </div>
                    }

                    <div className={'PDP__Section__Copy--table'}>
                        <p className="copy-title"><FormattedMessage id={'PDP.Style'} defaultMessage={'Style'} /></p>
                        <p>{product.productId.toString().toUpperCase()}</p>
                    </div>
                </div>

                <div className="PDP__Section__Copy--column">
                    {fabricDescriptions.length > 0 && (
                        <div className={'PDP__Section__Copy--table'}>
                            <p className="copy-title"><FormattedMessage id={'Fabric'} defaultMessage={'Fabric'} /></p>
                            <div
                                className="pre-line"
                                dangerouslySetInnerHTML={{ __html: fabricDescriptions.join('\n') }}
                            />
                        </div>
                    )}

                    {careDescriptions.length > 0 && (
                        <div className={'PDP__Section__Copy--table'}>
                            <p className="copy-title"><FormattedMessage id={'Care'} defaultMessage={'Garment care'} /></p>
                            <div
                                className="pre-line"
                                dangerouslySetInnerHTML={{ __html: careDescriptions.join('\n') }}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    private renderAuxiliaryContent() {
        const {
            currentCustomizedProduct,
            productListSummaries,
        } = this.props;

        const { product } = currentCustomizedProduct;

        const pid = formatProductId(currentCustomizedProduct);

        const shouldShowSimilarDresses = product.previewType === PreviewType.Render && getParentComponentCodes(product).length > 1;
        let images: ProductMedia[] = [];

        const currentSummary = productListSummaries[pid];
        if (currentSummary) {
            images = findSimilarSilhouetteImages(currentSummary, productListSummaries);
        }

        return (
            <React.Fragment>
                <style jsx>{`
                    @import 'vars';

                    .PDP__Section--Similar-Dresses {

                        @include mobile {
                            display: block;
                            text-align: center;
                            overflow: hidden;
                        }

                        @include desktop {
                            @include grid-column(12);
                            padding:10*$space-base 0;
                            flex-direction: column;
                            align-items: center;
                        }

                        > div {
                            @include mobile {
                                padding-bottom: 2*$space-base;
                            }
                        }
                    }
                `}</style>
                <hr />

                {this.renderCopy()}

                <hr />

                {this.renderCmsContent()}

                <hr />

                {shouldShowSimilarDresses &&
                    <div className={classnames('PDP__Section PDP__Section--Similar-Dresses')}>
                        <SimilarDresses customizedProduct={currentCustomizedProduct} />
                    </div>
                }
            </React.Fragment>
        );
    }

    private renderCmsContent() {
        if (!this.props.pageConfig ||
            !this.props.pageConfig.element ||
            !this.props.pageConfig.element.pdpContent) {
            return null;
        }

        // We have some pdpContent settings so let's render them out
        const { pageConfig: { element: { pdpContent } } } = this.props;

        const isPreview = this.props.location.search ? this.props.location.search.includes('cmsEdit') : false;
        const output = pdpContent.map((content) => transformToReactComponents(content, isPreview));

        return output;
    }

    public render() {
        const {
            currentCustomizedProduct,
            productListSummaries
        } = this.props;

        const {product} = currentCustomizedProduct;

        const pid = formatProductId(currentCustomizedProduct);
        const productListSummary = this.props.productListSummaries[pid];

        const mainImage = findImage(currentCustomizedProduct);

        const isCurrentlyCustomizing = this.state.currentSectionGroup !== null;

        if (isNewProduct(pid) && !(pid in productListSummaries) && !isCurrentlyCustomizing) {
            return <FullScreenLoader />;
        }

        const shouldIndex = !isCustomDress(currentCustomizedProduct) || !isCCSDress(currentCustomizedProduct, productListSummary);

        return (
            <BaseLayout customLogo={this.renderLogo()} hideHeaderInMobile={isCurrentlyCustomizing}>
                <SiteVersionContext.Consumer>
                    {(siteVersion) => (
                        <SEOIndexPage
                            shouldIndex={shouldIndex as any}
                            title={(productListSummary && productListSummary.name) || product.curationMeta.name}
                            description={(productListSummary && productListSummary.description) || product.curationMeta.description}
                            canonicalUrl={generateProductDetailUrl(currentCustomizedProduct, '')}
                            image={mainImage}
                            customizedProduct={currentCustomizedProduct}
                            productListSummary={productListSummary}
                            keywords={product.curationMeta && product.curationMeta.keywords}
                            siteVersion={siteVersion}
                        />
                    )}
                </SiteVersionContext.Consumer>
                {!this.state.hasChatted && <HideChatBubble />}

                <style jsx>{`
                    @import 'vars';

                    :global(footer) {
                        @include mobile {
                            display: ${isCurrentlyCustomizing ? 'none' : 'block'};
                        }

                        @include media($iphoneX...) {
                            padding-bottom: 12*$space-base !important;
                        }
                    }

                    :global(.PDP__Section) {
                        @include grid;
                        padding-top: 10*$space-base;
                        padding-bottom: 10*$space-base;

                        @include mobile {
                            @include grid-column(12);
                            padding-top:3*$space-base;
                            padding-bottom:3*$space-base;
                        }
                    }
                    :global(.PDP__BG__Stretch) {
                        background: $background-image-color;
                        height: calc(100vh - #{$navbar-height});
                        position: absolute;
                        left: 0;
                        top: $navbar-height;
                        width: 50%;
                        z-index: $z-index-below-all;
                    }

                    .PDP__Section--Information {
                        margin: 0;
                        width: 100%;

                        @include mobile {
                            padding: 0;
                        }

                        @include desktop {
                            @include container-full-width;
                            margin: 0 auto;
                        }

                        &--customizing {
                            @include desktop {
                                :global(.PDP__Column__Configuration) {
                                    margin: 0 auto;
                                }
                            }

                            @include mobile {
                                @keyframes prod-info-slidein {
                                    from {
                                       top: $navbar-height;
                                    }

                                    to {
                                        top: 0px;
                                    }
                                }

                                animation: prod-info-slidein  250ms 1 ease-out;

                                flex-direction: column;
                                position: fixed;
                                top: 0;
                                bottom: 0;
                                right: 0;
                                left: 0;

                                :global(.PDP__Column__Configuration) {
                                    height: 0;
                                    flex: 1;
                                }
                            }
                        }

                    }
                `}</style>

                <div className={classnames('PDP__Section PDP__Section--Information', {'PDP__Section--Information--customizing': isCurrentlyCustomizing})}>
                    {this.renderImage()}

                    {this.renderConfiguration()}
                </div>

                <Mobile>
                    <Switch>
                        <Route
                            path={this.props.match.path + '/customize/:groupSlug/:sectionGroupSlug?'}
                            render={() => null}
                        />
                        <Route
                            path={this.props.match.path}

                            render={() => this.renderAuxiliaryContent()}
                        />
                    </Switch>
                </Mobile>

                <Desktop>
                    {this.renderAuxiliaryContent()}
                </Desktop>
            </BaseLayout>
        );
    }

    // #endregion
}

export default withRouter(ProductPage);
