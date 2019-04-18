
import React from 'react';
import { AddToCart, RemoveFromCart } from '@common/rematch/models/cart';
import OptionCard from '@components/product/OptionCard';
import { totalPrice, filterByComponentType } from '@common/utils/product';
import { COMPONENT_IMAGE_SIZES } from '@common/constants';
import { ZoomType } from '@common/utils/zoom-type';
import { OrientationType } from '@common/utils/orientation-type';
import Spinner from '@components/base/Spinner';
import CurrencyAmount from '@components/base/CurrencyAmount/CurrencyAmount';
import { FormattedMessage } from 'react-intl';
import Curtain from '@components/base/Curtain';
import { isInCart } from '@common/utils/cart-helper';
import { getMainImageUrlForRender } from '@common/utils/render-url-helper';
import BaseSectionGrid, { BaseSectionGridConfiguration, BaseSectionGridGutter } from '@components/cms/Section/BaseSectionGrid';
import BaseSection, { SectionWidth, BaseSectionGridSpacingBottom } from '@components/cms/Section/BaseSection';
import { ComponentType } from '@common/utils/component-type';
import { CustomizedProduct, Order } from '@typings';

interface Props {
    addToCart: AddToCart;
    removeFromCart: RemoveFromCart;
    isAddingToCart: boolean;
    isRemovingFromCart: boolean;
    isErrorAddingToCart: boolean;
    pids: string[];
    products: CustomizedProduct[];
    cart: Order|null;
    gridConfiguration:  BaseSectionGridConfiguration;
    mobileGridConfiguration: BaseSectionGridConfiguration;
    width: SectionWidth;
    mobileWidth: SectionWidth;
    spacingBottom: BaseSectionGridSpacingBottom;
    mobileSpacingBottom: BaseSectionGridSpacingBottom;
    gridGutter: BaseSectionGridGutter;
    mobileGridGutter: BaseSectionGridGutter;
}

class FabricSwatchSection extends React.Component<Props> {
    private getImage(customizedProduct: CustomizedProduct) {
        return getMainImageUrlForRender(customizedProduct, OrientationType.Front, ZoomType.None, COMPONENT_IMAGE_SIZES);
    }

    public render() {
        const { isAddingToCart, isRemovingFromCart, spacingBottom, mobileSpacingBottom, gridGutter, mobileGridGutter } = this.props;
        const showSpinner = isAddingToCart || isRemovingFromCart;

        return (
            <BaseSection spacingBottom={spacingBottom} mobileSpacingBottom={mobileSpacingBottom} width={this.props.width} mobileWidth={this.props.mobileWidth}>
                <style jsx>{`
                    @import 'vars';

                    .spinner-container {
                        position: fixed;
                        z-index: $z-index-above-curtain;
                        top: calc(50%);
                        left: calc(50%);
                        transform: translate(-50%, -50%);
                        text-align: center;

                        h2 {
                            color: $color-white;
                            margin-bottom: 24px;
                        }
                        :global(.spinner) {
                            margin: 0 auto;
                        }
                    }
                `}</style>

                <Curtain isVisible={showSpinner}>
                    <div className="spinner-container">
                        {isAddingToCart && <h2><FormattedMessage id="FabricSwatchSection.Spinner.Adding" defaultMessage="Adding to your bag" /></h2>}
                        {isRemovingFromCart && <h2><FormattedMessage id="FabricSwatchSection.Spinner.Removing" defaultMessage="Removing from your bag" /></h2>}
                        <Spinner width={64} height={64} color="white" />
                    </div>
                </Curtain>

                <BaseSectionGrid gridConfiguration={this.props.gridConfiguration} mobileGridConfiguration={this.props.mobileGridConfiguration} gridGutter={gridGutter} mobileGridGutter={mobileGridGutter}>
                    {this.props.products && this.props.products.map((swatch, index) => {
                        const image = this.getImage(swatch);
                        const color = swatch.components.find(filterByComponentType(ComponentType.Color));

                        const inCart = isInCart(this.props.cart, swatch);

                        return <OptionCard
                            key={index}
                            title={color && color.title}
                            onClick={inCart ? () => this.props.removeFromCart(inCart) : () => this.props.addToCart({product: swatch, summary: null})}
                            subtitle={
                                inCart
                                ? <a>
                                    <FormattedMessage id="Swatch.RemoveFromCart" defaultMessage="Remove from Bag" /> - <CurrencyAmount value={totalPrice(swatch)} hideSign hideDecimalIfDollarAmount/>
                                  </a>
                                : <a>
                                    <FormattedMessage id="Swatch.AddToCart" defaultMessage="Add to Bag" /> - <CurrencyAmount value={totalPrice(swatch)} hideSign hideDecimalIfDollarAmount/>
                                  </a>
                            }
                            image={image}
                            color={color && color.meta.hex || null}
                            isSelected={inCart ? false : null as any}
                        />;
                    })}
                </BaseSectionGrid>
            </BaseSection>
        );
    }
}

export default FabricSwatchSection;
