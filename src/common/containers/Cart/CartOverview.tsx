import React from 'react';
import { SiteVersion } from '@common/constants';
import BaseLayout from '@containers/BaseLayout';
import Cart from '@components/layout/Cart/Cart';
import { RouteComponentProps } from 'react-router';
import FullScreenLoader from '@components/base/FullScreenLoader';
import { FormattedMessage } from 'react-intl';
import { OrderCustomizedProduct, Order } from '@typings';

interface Props extends RouteComponentProps<{ cartId?: string }> {
    siteVersion: SiteVersion;
    cart: Order | null;
    openCart: () => void;
    closeCart: () => void;
    removeFromCartAsync: (item: OrderCustomizedProduct) => void;
    restoreAbandonedCartAsync: (cartId: string) => void;
    applyPromotionCodeAsync: (promotionCode: string) => void;
    isErrorRemovingList: number[];
    isRemovingList: number[];
    isAdding: boolean;
    isErrorAdding: boolean;
}

class CartOverview extends React.PureComponent<Props> {

    public componentDidMount() {
        if (this.props.match.params.cartId) {
            this.props.restoreAbandonedCartAsync(this.props.match.params.cartId);
        }
    }

    public render() {
        const { siteVersion, cart, removeFromCartAsync, applyPromotionCodeAsync, isErrorRemovingList, isRemovingList, isAdding, isErrorAdding } = this.props;

        if (isAdding) {
            return <FullScreenLoader />;
        }

        return (
            <BaseLayout>
                <style jsx>{`
                    @import 'vars';

                    .CartOverview {
                        :global(.Cart) {
                            max-width: 1024px;
                            margin: 0 auto;
                            padding: 0;
                            border: none !important;

                            :global(.LineItem__ImageContainer) {
                                width: 20% !important;
                            }

                            :global(.Button) {
                                @include desktop {
                                    max-width: 25%;
                                }

                                // display: inline-flex;
                            }

                            :global(.Cart__Content) {
                                @include desktop {
                                    padding: 0;
                                }
                            }

                            :global(.Cart__Footer) {
                                @include desktop {
                                    padding-left: 0 !important;
                                    padding-right: 0 !important;
                                }
                            }
                        }

                        h2 {
                            text-align: center;
                            padding-top: space(5);
                        }
                    }
                `}</style>
                <div className={'CartOverview'}>
                    <h2><FormattedMessage id={'CartOverview.title'} defaultMessage={'Shopping Bag'} /></h2>
                    <Cart
                        siteVersion={siteVersion}
                        cart={cart}
                        removeFromCartAsync={removeFromCartAsync}
                        closeCart={() => null}
                        isErrorRemovingList={isErrorRemovingList}
                        isRemovingList={isRemovingList}
                        hideHeader
                        fullwidthCheckoutButton={false}
                        applePaySupport={true}
                        applyPromotionCodeAsync={applyPromotionCodeAsync}
                    />
                </div>
            </BaseLayout>
        );
    }
}

export default CartOverview;
