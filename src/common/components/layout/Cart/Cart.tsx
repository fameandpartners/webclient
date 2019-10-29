import React, { Component } from 'react';
import Button from '@components/base/Button/Button';
import CurrencyAmount from '@components/base/CurrencyAmount/CurrencyAmount';
import CartEmpty from '@components/layout/Cart/CartEmpty';
import { SiteVersion } from '@common/constants';
import CustomizationOverview from '@components/customization-overview/CustomizationOverview';
import Spinner from '@components/base/Spinner';
import { FormattedMessage } from 'react-intl';
import { countCartItems } from '@common/utils/cart-helper';
import LineItem from '@components/layout/Cart/LineItem';
import { isBrowser } from '@common/utils/server-client-helpers';
import { OrderCustomizedProduct, Order } from '@typings';
import { RETURN_INSURANCE_SKUS } from '@common/utils/product';
import QuadpayTeaser from '@components/auxiliary-product-info/QuadpayTeaser';

const CloseCrossIcon = require('@svg/i-close-cross.svg').default;
const ShoppingBagIcon = require('@svg/i-shopping-bag.svg').default;

interface CartProps {
    siteVersion: SiteVersion;
    cart: Order | null;
    isRemovingList: number[];
    isErrorRemovingList: number[];
    removeFromCartAsync: (item: OrderCustomizedProduct) => void;
    closeCart: () => void;
    hideHeader: boolean;
    fullwidthCheckoutButton: boolean;
}

class Cart extends Component<CartProps> {

    public static defaultProps: Partial<CartProps> = {
        hideHeader: false,
        fullwidthCheckoutButton: true,
    };

    private generateLineItems() {
        const { cart, isRemovingList, isErrorRemovingList } = this.props;

        if (!cart) {
            return [];
        }

        return cart.items
        .filter((lineItem) => !RETURN_INSURANCE_SKUS.includes(lineItem.product.title))
        .map((lineItem) => {
            const { lineItemId, product, image, price } = lineItem;
            const isRemoving = isRemovingList.includes(lineItem.lineItemId);
            const isErrorRemoving = isErrorRemovingList.includes(lineItem.lineItemId);

            return (
                <LineItem
                    key={lineItemId}
                    id={lineItemId}
                    itemUrl={lineItem.url}
                    image={image}
                    title={product.title}
                    price={price}
                    customizedProduct={lineItem}
                >
                    {isRemoving && (
                        <span className="LineItem__RemoveSpinner">
                            <Spinner width={14} height={14} color="black" />
                        </span>
                    )}
                    {isErrorRemoving && (
                        <span className="LineItem__RemoveError">
                            <FormattedMessage
                                id="Cart.Remove.Error"
                                defaultMessage="There was an error removing this item from your bag"
                            />
                        </span>
                    )}
                    {!isRemoving && (
                            <a className="LineItem__Remove" onClick={() => this.props.removeFromCartAsync(lineItem)}>
                            <FormattedMessage id="Cart.Item.Remove" defaultMessage="Remove" />
                        </a>
                    )}
                </LineItem>
            );
        });
    }

    public render() {
        // const { complementaryProducts } = this.props;

        const cartItemCount = countCartItems(this.props.cart);
        const returnInsurance = this.props.cart && this.props.cart.items.find((lineItem) => RETURN_INSURANCE_SKUS.includes(lineItem.product.title));

        return (
            <div className="Cart">
                <style jsx>{`
                    @import 'vars';

                    @mixin cart-padding() {
                        padding: 0 4*$space-base;

                        @include media("<tablet") {
                            padding: 0 $page-padding-mobile;
                        }
                    }

                    .Cart {
                        height: 100%;
                        display: flex;
                        background: $color-white;
                        flex-direction: column;
                        border-left: 1px solid $color-grey79;

                        &__Header {
                            height: $navbar-height;
                            border-bottom: 1px solid $color-grey79;
                            display: flex;
                            align-items: center;
                            @include cart-padding;

                            h4 {
                                text-align: center;
                                flex-grow: 1;
                                margin: 0;
                                font-weight: light;
                            }

                            &__Count {
                                margin-left: $space-base;
                                @include text-style-navigation-item;
                            }
                        }

                        &__Content {
                            overflow: auto;
                            scroll-behavior: smooth;
                            flex: 1;
                            @include cart-padding;

                            :global(.GroupTitle) {
                                @include text-style-form-label;
                                margin: 0;
                            }
                            :global(.GroupContent) {
                                @include text-style-form-option;
                            }

                            :global(.LineItem__Remove),
                            :global(.LineItem__RemoveError),
                            :global(.LineItem__RemoveSpinner) {
                                @include text-style-form-option;
                                display: block;
                                margin-top: $space-base;
                            }

                            :global(.LineItem__RemoveError) {
                                color: $color-red;
                            }

                            :global(.LineItem__RemoveSpinner) {
                                :global(.spinner) {
                                    margin: 2px auto;
                                }
                            }
                        }


                        .Cart__SubTotal {
                            margin: 0 0 $space-base * 2;

                            .Cart__SubTotal__Amount {
                                float: right;
                            }
                        }

                        .Cart__Total {
                            margin: 0 0 $space-base * 3;
                            font-weight: bold;

                            .Cart__Total__Amount {
                                float: right;
                            }
                        }


                        .Cart__Footer {
                            border-top: 1px solid $color-grey79;
                            @include cart-padding;
                            padding-top: 3*$space-base;
                            padding-bottom:  4*$space-base;
                        }

                        .Cart__Empty {
                            flex-grow: 1;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                `}</style>

                {!this.props.hideHeader && <div className="Cart__Header">
                    <ShoppingBagIcon width={18} height={16} />
                    {cartItemCount > 0 && <span className="Cart__Header__Count">{cartItemCount}</span>}

                    <h4>
                        <FormattedMessage id="Cart.Title" defaultMessage="Shopping bag" />
                    </h4>

                    <a onClick={this.props.closeCart}>
                        <CloseCrossIcon width={16} height={16} />
                    </a>
                </div>}

                {cartItemCount === 0 ? (
                    <div className="Cart__Empty">
                        <CartEmpty closeCartDrawer={this.props.closeCart} />
                    </div>
                ) : (
                    <React.Fragment>
                        <ul className="Cart__Content">{this.generateLineItems()}</ul>

                        <div className="Cart__Footer">

                            { returnInsurance &&
                                <div className="Cart__SubTotal">
                                    <span className="Cart__SubTotal__Amount">
                                        <CurrencyAmount hideSign value={returnInsurance.price} />
                                    </span>
                                    <FormattedMessage id="Cart.ReturnInsurance" defaultMessage="Return insurance" />
                                </div>
                            }

                            <div className="Cart__Total">
                                <FormattedMessage id="Cart.Subtotal" defaultMessage="Subtotal" />
                                <span className="Cart__Total__Amount">
                                    <CurrencyAmount hideSign value={this.props.cart ? this.props.cart.itemsTotal : 0} />
                      </span>
                            {this.props.siteVersion == 'en-US' && <span className="Cart__Total__Amount">
                                    <QuadpayTeaser total={this.props.cart ? this.props.cart.itemsTotal : 0} />
                                 </span>}
                             </div>

                            <Button fullwidth={this.props.fullwidthCheckoutButton} url={`/checkout${isBrowser() && window.location.search ? window.location.search : ''}`}>
                                <FormattedMessage id="Cart.Checkout" defaultMessage="CHECKOUT" />
                            </Button>
                        </div>
                    </React.Fragment>
                )}
            </div>
        );
    }
}

export default Cart;
