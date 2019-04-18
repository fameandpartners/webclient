import { connect } from 'react-redux';
import { RootState, RootDispatch } from '@common/rematch';
import { connectProducts } from '@containers/CmsPage/DataLoader';
import FabricSwatchSection from '@components/cms/Section/FabricSwatchSection/FabricSwatchSection';

const mapStateToProps = (state: RootState) => ({
    isAddingToCart: state.CartModel.isLoading,
    isErrorAddingToCart: state.CartModel.isErrorLoading,
    cart: state.CartModel.cart,
    isRemovingFromCart: state.CartModel.isRemovingList.length > 0
});

const mapDispatchToProps = (dispatch: any) => ({
    addToCart: (dispatch as RootDispatch).CartModel.addToCartAsync,
    removeFromCart: (dispatch as RootDispatch).CartModel.removeFromCartAsync
});

export default connectProducts()(connect(mapStateToProps, mapDispatchToProps)(FabricSwatchSection));
