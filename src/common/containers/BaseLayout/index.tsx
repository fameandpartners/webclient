import { connect } from 'react-redux';
import BaseLayout from './BaseLayout';
import { RootState, RootDispatch } from '@common/rematch';

const mapStateToProps = (state: RootState) => ({
    user: state.UserModel,
    siteVersion: state.SiteVersion,
    cart: state.CartModel.cart,
    isCartVisible: state.CartModel.isVisible,
    isErrorRemovingList: state.CartModel.isErrorRemovingList,
    isRemovingList: state.CartModel.isRemovingList,
    cmsPageConfig: state.CmsModel.elements.find((x) => x.slug === 'global-page')
});

const mapDispatchToProps = (dispatch: any) => ({
    changeSiteVersion: (dispatch as RootDispatch).SiteVersion.changeSiteVersion as any,
    openCart: (dispatch as RootDispatch).CartModel.openCart,
    closeCart: (dispatch as RootDispatch).CartModel.closeCart,
    removeFromCartAsync: (dispatch as RootDispatch).CartModel.removeFromCartAsync
});

export { BaseLayout };

export default connect(mapStateToProps, mapDispatchToProps)(BaseLayout);