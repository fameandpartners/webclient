import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import Footer from '@components/layout/Footer/Footer';
import Header from '@components/layout/Header/Header';
import configureStore, { RootState, RootDispatch } from '@common/rematch';
import { countCartItems } from '@common/utils/cart-helper';
import cartResponseToCart from '@common/transforms/cartResponseToCart';
import userResponseToUser from '@common/transforms/userResponseToUser';
import { SiteVersion } from '@common/constants';
import { User, Order, OrderCustomizedProduct } from '@typings';
import CartContainer from '@components/layout/Cart/CartContainer';

const spreeState = (window as any).ApplicationStateData;
const preloadedData = {
  SiteVersion: spreeState.currentSiteVeresion === 'USA' ? 'en-US' : 'en-AU',
  CmsModel: {
    elements: [
      {
        isLoading: false,
        slug: 'global-page',
        element: spreeState.cmsGlobalPageConfig
      }
    ],
    contentfulService: null
  }
};

const store = configureStore(preloadedData);
store.dispatch.CartModel.update({ order: cartResponseToCart(spreeState.CartData) });
if (spreeState.UserData) {
  const user = userResponseToUser(spreeState.UserData);
  if (user) {
    store.dispatch.UserModel.update(user);
  }
}

const mapStateToProps = (state: RootState) => {
  const cmsConfig = state.CmsModel.elements.find(x => x.slug === 'global-page');

  return {
    user: state.UserModel,
    siteVersion: state.SiteVersion,
    cart: state.CartModel.cart,
    isCartVisible: state.CartModel.isVisible,
    isErrorRemovingList: state.CartModel.isErrorRemovingList,
    isRemovingList: state.CartModel.isRemovingList,
    cmsPageConfig: cmsConfig && cmsConfig.element,
    cartItemCount: countCartItems(state.CartModel.cart)
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  changeSiteVersion: (dispatch as RootDispatch).SiteVersion.changeSiteVersion as any,
  openShoppingCart: (dispatch as RootDispatch).CartModel.openCart,
  closeCart: (dispatch as RootDispatch).CartModel.closeCart,
  removeFromCartAsync: (dispatch as RootDispatch).CartModel.removeFromCartAsync
});

function renderComponent(component: JSX.Element, idSelectorStr: string) {
  const el = document.getElementById(idSelectorStr);
  if (el) {
    ReactDOM.render(component, el);
  }
}

interface Props {
  user: User | null;
  siteVersion: SiteVersion;
  cart: Order | null;
  isCartVisible: boolean;
  isErrorRemovingList: number[];
  isRemovingList: number[];
  cmsPageConfig: any;
  cartItemCount: number;
  changeSiteVersion: (sv: SiteVersion) => void;
  openShoppingCart: () => void;
  closeCart: () => void;
  removeFromCartAsync: (item: OrderCustomizedProduct) => void;
}

// HEADER
const WrappedHeader = (props: Props) => {
  return (
    <React.Fragment>
      <style jsx global>{`
        .__react_root_relaunch__ {
          @import 'styles.scss';
        }
      `}</style>
      <Header user={props.user} cartItemCount={props.cartItemCount} openShoppingCart={props.openShoppingCart} pageConfig={props.cmsPageConfig} />
    </React.Fragment>
  );
};
const ConnectedHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedHeader);
const HeaderComponent = (
  <IntlProvider>
    <Provider store={store}>
      <ConnectedHeader />
    </Provider>
  </IntlProvider>
);
renderComponent(HeaderComponent, 'react-header');

// CART DRAWER
const WrapedCart = (props: Props) => {
  return (
    <React.Fragment>
      <CartContainer siteVersion={props.siteVersion} cart={props.cart} removeFromCartAsync={props.removeFromCartAsync} closeCart={props.closeCart} isErrorRemovingList={props.isErrorRemovingList} isRemovingList={props.isRemovingList} isCartVisible={props.isCartVisible} />
    </React.Fragment>
  );
};
const ConnectedCart = connect(
  mapStateToProps,
  mapDispatchToProps
)(WrapedCart);
const CartComponent = (
  <IntlProvider>
    <Provider store={store}>
      <ConnectedCart />
    </Provider>
  </IntlProvider>
);
renderComponent(CartComponent, 'react-cart');

// FOOTER
const WrappedFooter = (props: Props) => <Footer changeSiteVersion={props.changeSiteVersion} pageConfig={props.cmsPageConfig} siteVersion={props.siteVersion} />;
const ConnectedFooter = connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedFooter);
const FooterComponent = (
  <IntlProvider>
    <Provider store={store}>
      <ConnectedFooter />
    </Provider>
  </IntlProvider>
);
renderComponent(FooterComponent, 'react-footer');
