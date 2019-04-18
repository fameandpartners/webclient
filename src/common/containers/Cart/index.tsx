import { connect } from 'react-redux';
import CartOverview from './CartOverview';
import { RootState, RootDispatch } from '@common/rematch';
import { withRouter } from 'react-router';

const mapStateToProps = (state: RootState) => ({
    siteVersion: state.SiteVersion,
    cart: state.CartModel.cart,
    isErrorRemovingList: state.CartModel.isErrorRemovingList,
    isRemovingList: state.CartModel.isRemovingList,
    isAdding: state.CartModel.isLoading,
    isErrorAdding: state.CartModel.isErrorLoading,
});

const mapDispatchToProps = (dispatch: any) => ({
    openCart: (dispatch as RootDispatch).CartModel.openCart,
    closeCart: (dispatch as RootDispatch).CartModel.closeCart,
    removeFromCartAsync: (dispatch as RootDispatch).CartModel.removeFromCartAsync,
    restoreAbandonedCartAsync: (dispatch as RootDispatch).CartModel.restoreAbandonedCartAsync,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CartOverview));
