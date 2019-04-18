import React from 'react';
import Curtain from '@components/base/Curtain';
import SlideInOutTransition from '@components/animation/SlideInOutTransition';
import Cart from '@components/layout/Cart/Cart';
import { SiteVersion } from '@common/constants';
import KeyListener from '@components/event-listener/KeyListener';
import { KeyCodes } from '@common/utils/key-codes';
import { OrderCustomizedProduct, Order } from '@typings';

interface Props {
    siteVersion: SiteVersion;
    cart: Order | null;
    isCartVisible: boolean;
    isErrorRemovingList: number[];
    isRemovingList: number[];
    closeCart: () => void;
    removeFromCartAsync: (item: OrderCustomizedProduct) => void;
}

class CartContainer extends React.PureComponent<Props> {
    public render() {
        const {
            siteVersion,
            cart,
            closeCart,
            removeFromCartAsync,
            isCartVisible,
            isErrorRemovingList,
            isRemovingList
        } = this.props;

        return (
            <React.Fragment>
                <style jsx>{`
                    @import 'vars';

                    .cart-container {
                        position: fixed;
                        right: 0;
                        top: 0;
                        bottom: 0;
                        width: 100vw;
                        max-width: 500px;
                        z-index: $z-index-above-curtain;
                    }
                `}</style>

                <KeyListener
                    options={[
                        { keyCode: KeyCodes.Esc, action: () => isCartVisible ? closeCart() : null }
                    ]}
                />

                <Curtain isVisible={isCartVisible} onClick={() => closeCart()}>
                    <SlideInOutTransition
                        isVisible={isCartVisible}
                        slideInFrom="right"
                    >
                        {(styles) => (
                            <div className="cart-container" style={styles}>
                                <Cart
                                    siteVersion={siteVersion}
                                    cart={cart}
                                    removeFromCartAsync={removeFromCartAsync}
                                    closeCart={closeCart}
                                    isErrorRemovingList={isErrorRemovingList}
                                    isRemovingList={isRemovingList}
                                />
                            </div>
                        )}
                    </SlideInOutTransition>
                </Curtain>
            </React.Fragment>
        );
    }
}

export default CartContainer;
