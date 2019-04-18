import { connect } from 'react-redux';
import DressFinder from './DressFinder';
import { RootState, RootDispatch } from '@common/rematch';
import { withRouter } from 'react-router';
import { DocumentSearchResponse } from 'typings/fame_api/product_document';

const mapStateToProps = (state: RootState) => ({
    siteVersion: state.SiteVersion,
    searchResult: state.SearchModel,
    user: state.UserModel,
    cart: state.CartModel.cart,
    isCartVisible: state.CartModel.isVisible,
    isErrorRemovingList: state.CartModel.isErrorRemovingList,
    isRemovingList: state.CartModel.isRemovingList,
    cmsPageConfig: state.CmsModel.elements.find((x) => x.slug === 'global-page')
});

const mapDispatchToProps = (dispatch: any) => ({
    downloadDocument: (dispatch as RootDispatch).SearchModel.downloadDocumentAsync,
    openCart: (dispatch as RootDispatch).CartModel.openCart,
    closeCart: (dispatch as RootDispatch).CartModel.closeCart,
    removeFromCartAsync: (dispatch as RootDispatch).CartModel.removeFromCartAsync
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DressFinder));
