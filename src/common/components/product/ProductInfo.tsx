import React from 'react';
import CurrencyAmount from '@components/base/CurrencyAmount/CurrencyAmount';
import ProductUnavailable from '@components/auxiliary-product-info/ProductUnavailable';
import CustomizationOverview from '@components/customization-overview/CustomizationOverview';
import { CustomizedProduct, Group, SectionGroup, ProductListSummaries } from 'typings/product';
import { mapToCode, sortByOrder, filterByComponentType, filterByCompatibleWithSelection, totalPrice, isNewProduct, totalStrikeThroughPrice, isIncompatibleIn } from '@common/utils/product';
import { ComponentType } from '@common/utils/component-type';
import { FormattedMessage } from 'react-intl';
import Button from '@components/base/Button/Button';
import AfterpayTeaser from '@components/auxiliary-product-info/AfterpayTeaser';
import QuadpayTeaser from '@components/auxiliary-product-info/QuadpayTeaser';
import ShareModal from '@components/share-modal/ShareModal';
import { getBaseUrl } from '@common/services/fameApi';
import { generateProductDetailUrl } from '@common/utils/url-helper';
import { findImage, formatProductId } from '@common/utils/render-url-helper';
import { Link } from 'react-router-dom';
import { SiteVersionContext } from '@common/context/SiteVersionContext';
import { Desktop, Mobile } from '@components/base/MediaQuerySSR';
import { DEFAULT_GLOBAL_OPTIONS_NAME } from '@common/constants';

const ShareArrowIcon = require('@svg/i-share-arrow.svg').default;
const SwatchesIcon = require('@svg/i-swatches.svg').default;
const ChatIcon = require('@svg/i-chat.svg').default;

interface Props {
  currentCustomizedProduct: CustomizedProduct;
  productListSummaries: ProductListSummaries;
  onStartChat: () => void;

  goToCustomizationStep: (group: Group, sectionGroup: SectionGroup | null, customizedProduct: CustomizedProduct, trackingLabel: string) => void;

  addToCart: (cp: CustomizedProduct) => void;
  isAddingToCart: boolean;
  isErrorAddingToCart: boolean;
}

interface State {
  showShare: boolean;
}

class ProductInfo extends React.PureComponent<Props, State> {
  public state: State = {
    showShare: false
  };

  private getDressTitle() {
    const { currentCustomizedProduct, productListSummaries } = this.props;
    const pid = formatProductId(currentCustomizedProduct);
    const productSummary = this.props.productListSummaries[pid];

    return (productSummary && productSummary.name) || currentCustomizedProduct.product.curationMeta.name;
  }

  public render() {
    const { currentCustomizedProduct, goToCustomizationStep, addToCart, isAddingToCart, isErrorAddingToCart } = this.props;
    const { product, components } = currentCustomizedProduct;

    const { isAvailable } = product;

    const returnComponent = product.components
      .filter(filterByComponentType(ComponentType.Return))
      .sort(sortByOrder)
      .filter(filterByCompatibleWithSelection(components))[0];

    const returnText = returnComponent ? returnComponent.meta.returnDescription : product.returnDescription;

    const makingComponents = product.components
      .filter(filterByComponentType(ComponentType.Making))
      .sort(sortByOrder)
      .filter((c) => !isIncompatibleIn(c, DEFAULT_GLOBAL_OPTIONS_NAME, components.map(mapToCode)));
    const makingComponent = makingComponents.find((c) => c.isRecommended || false);

    const total = totalPrice(currentCustomizedProduct);
    const totalStrikeThrough = totalStrikeThroughPrice(currentCustomizedProduct);

    const showAuxInfo = isAvailable && (product.paymentMethods.afterPay || returnText || makingComponent);

    const showBuySwatch = isNewProduct(product.productId);

    const mainImage = findImage(currentCustomizedProduct);

    const dressTitle = this.getDressTitle();

    return (
      <div className={'ProductInfo'}>
        <style jsx>{`
          @import 'vars';

          .ProductInfo {
            width: 100%;
          }

          .price {
            font-weight: normal;
          }

          .DressTitleWrapper {
            display: flex;
            align-items: center;
            padding-bottom: 6 * $space-base;

            &__Title {
              margin: 0;
              width: 0;
              flex: 1;
              @include text-style-h3;
            }

            &__Price {
              @include text-style-h3;
              margin-left: space(4);
              font-style: normal;
              align-self: flex-start;

              :global(.CurrencyAmount--StrikeThroughPrice) {
                font-size: 20px;
              }
            }
          }

          .auxilary-info {
            text-align: center;
            margin: space(2) 0 0;

            :global(a) {
              white-space: nowrap;
            }

            + .auxilary-info {
              margin-top: 0;
            }
          }

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

          .share-moodboard {
            text-align: center;
            margin: space(3) 0 space(2);
            display: flex;
            padding-top: space(1);

            @include mobile {
              border-top: 1px solid $color-grey90;
            }

            :global(a) {
              display: block;
              width: 0;
              padding: 8px;
              flex: 1;

              :global(svg) {
                display: block !important;
                margin: space(1) auto space(1);
              }
            }
          }

          .customization-overview {
            margin-bottom: 3 * $space-base;
          }

          .express-making {
            margin: space(3) 0;
          }

          .product-unavailable {
            flex-grow: 1;
            display: flex;
          }

          :global(.add-to-cart-button) {
            @include mobile {
              position: fixed;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 1;
            }

            @include media($iphoneX...) {
              height: $button-height + 2 * $space-base !important;
              padding-bottom: 2 * $space-base !important;
            }
          }

          .express-making {
            @include mobile {
              padding: 0 $page-padding-mobile;
            }
          }

          :global(.GroupRow__Wrapper) {
            @include mobile {
              padding: $space-base $page-padding-mobile;
              margin: 0 (-$gutter/2);
            }
          }
        `}</style>

        {isAvailable && (
          <Desktop>
            <div className="DressTitleWrapper">
              <h1 className="DressTitleWrapper__Title">{dressTitle}</h1>
              <em className="DressTitleWrapper__Price">
                {' '}
                <CurrencyAmount value={total} hideSign strikeThroughValue={totalStrikeThrough} />
              </em>
            </div>
          </Desktop>
        )}

        {!isAvailable && (
          <div className="product-unavailable">
            <ProductUnavailable dressTitle={dressTitle} />
          </div>
        )}

        {isAvailable && (
          <div className="customization-overview">
            <CustomizationOverview includeSeparators={true} customizedProduct={currentCustomizedProduct} canCustomize={isAvailable} startCustomize={(group) => goToCustomizationStep(group, null, currentCustomizedProduct, 'Customization Overview')} />
          </div>
        )}

        {isAvailable && (
          <Button
            fullwidth
            className="add-to-cart-button"
            onClick={() => addToCart(currentCustomizedProduct)}
            spinner={isAddingToCart}
            error={isErrorAddingToCart}
            errorText={<FormattedMessage id="Pdp.AddToCart.Error" defaultMessage="Oh no, there was a problem adding this to your bag. Why don't you try that again?" />}
          >
            <Desktop>
              <FormattedMessage id="Pdp.AddToCart" defaultMessage="ADD TO BAG" />
            </Desktop>
            <Mobile>
              <FormattedMessage id="Pdp.AddToCart.WithPrice" defaultMessage="{price} - ADD TO BAG" values={{ price: `$${(total / 100).toFixed(2)}` }} />
            </Mobile>
          </Button>
        )}

        {product.paymentMethods.afterPay && (
          <p className="auxilary-info">
            <AfterpayTeaser total={total} />
          </p>
        )}

        {1 && (
          <p className="auxilary-info">
            <QuadpayTeaser total={total} />
          </p>
        )}

        {returnText && <p className="auxilary-info">{returnText && <span dangerouslySetInnerHTML={{ __html: returnText }} />}</p>}

        {isAvailable && (
          <div className="share-moodboard">
            <a className="no-underline icon-text" onClick={() => this.setState({ showShare: true })}>
              <ShareArrowIcon alt="" style={{ width: 16, height: 16 }} />
              <FormattedMessage id={'ProductPage.Share.Title'} defaultMessage={'Share this dress'} />
            </a>
            {showBuySwatch && (
              <Link className="no-underline icon-text" to="/custom-clothes/order-swatches" target="_blank">
                <SwatchesIcon alt="" style={{ width: 16, height: 16 }} />
                <FormattedMessage id={'ProductPage.Swatches.Title'} defaultMessage={'Order Swatches'} />
              </Link>
            )}

            <a className="no-underline  icon-text" onClick={this.props.onStartChat}>
              <ChatIcon alt="" style={{ width: 16, height: 16 }} />
              <FormattedMessage id={'ProductPage.Chat.Start'} defaultMessage={'Need help? Chat now.'} />
            </a>
          </div>
        )}

        <SiteVersionContext.Consumer>
          {(siteVersion) => <ShareModal isVisible={this.state.showShare} url={`${getBaseUrl(siteVersion).frontend}${generateProductDetailUrl(currentCustomizedProduct, '')}`} onClose={() => this.setState({ showShare: false })} dressTitle={dressTitle} image={mainImage} />}
        </SiteVersionContext.Consumer>
      </div>
    );
  }
}

export default ProductInfo;
