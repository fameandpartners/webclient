import React from 'react';
import { User, OrderCustomizedProduct, Order } from '@typings';
import Header from '@components/layout/Header/Header';
import Footer from '@components/layout/Footer/Footer';
import BaseMetaTags from '@components/base/Seo/BaseMetaTags';
import CartContainer from '@components/layout/Cart/CartContainer';
import { SiteVersion } from '@common/constants';
import { countCartItems } from '@common/utils/cart-helper';
import { CmsPageGlobalConfig } from '@components/cms/CmsPageGlobalConfig';
import { CmsElementState } from '@common/rematch/models/cms';
import SitewideBanner from '@components/layout/SitewideBanner';

interface Props {
    user: User | null;
    siteVersion: SiteVersion;
    cart: Order | null;
    isCartVisible: boolean;
    isErrorRemovingList: number[];
    isRemovingList: number[];
    cmsPageConfig: CmsElementState<CmsPageGlobalConfig> | undefined;

    openCart: () => void;
    closeCart: () => void;
    changeSiteVersion: (siteVersion: SiteVersion) => void;
    removeFromCartAsync: (item: OrderCustomizedProduct) => void;

    customLogo?: React.ReactNode;
    transparentHeader?: boolean;
    headerTextColorWhenTransparent?: 'white' | 'black';
    headerBackgroundColor?: 'White' | 'Light Pink';
    hideHeaderInMobile?: boolean;
}

class BaseLayout extends React.PureComponent<Props> {
    public render() {
        const {
            user,
            siteVersion,
            cart,
            openCart,
            closeCart,
            changeSiteVersion,
            children,
            removeFromCartAsync,
            isCartVisible,
            isErrorRemovingList,
            isRemovingList,
            customLogo,
            transparentHeader,
            headerTextColorWhenTransparent,
            headerBackgroundColor,
            hideHeaderInMobile,
            cmsPageConfig
        } = this.props;

        const cartItemCount = countCartItems(cart);

        return (
            <React.Fragment>
                <style jsx>{`
                    @import 'vars';

                    main {
                        min-height: calc(100vh - #{$navbar-height} - #{$footer-height});

                        &.transparent-header {
                            margin-top: -$navbar-height;
                        }
                    }
                `}</style>
                <BaseMetaTags siteVersion={siteVersion} />

                {cmsPageConfig && cmsPageConfig.element && (cmsPageConfig.element.sitewideBanners || []).map((banner) => <SitewideBanner key={banner.id} config={banner}  hideInMobile={hideHeaderInMobile} />)}

                { cmsPageConfig && cmsPageConfig.element &&
                    <Header
                        pageConfig={cmsPageConfig.element}
                        user={user}
                        cartItemCount={cartItemCount}
                        openShoppingCart={openCart}
                        customLogo={customLogo}
                        transparent={transparentHeader}
                        textColorWhenTransparent={headerTextColorWhenTransparent}
                        backgroundColor={headerBackgroundColor}
                        hideInMobile={hideHeaderInMobile}
                    />
                }

                <main className={transparentHeader ? 'transparent-header' : ''}>
                    {children}
                </main>

                <CartContainer
                    siteVersion={siteVersion}
                    cart={cart}
                    isCartVisible={isCartVisible}
                    isErrorRemovingList={isErrorRemovingList}
                    isRemovingList={isRemovingList}
                    closeCart={closeCart}
                    removeFromCartAsync={removeFromCartAsync}
                />

                { cmsPageConfig && cmsPageConfig.element &&
                    <Footer pageConfig={cmsPageConfig.element} siteVersion={siteVersion} changeSiteVersion={changeSiteVersion} />
                }

            </React.Fragment>
        );
    }
}

export default BaseLayout;
