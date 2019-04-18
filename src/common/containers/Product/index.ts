import { connect } from 'react-redux';
import Product from './Product';
import { RootState, RootDispatch } from '@common/rematch';
import { withRouter } from 'react-router';
import { getIdFromSlug, getPidFromSlug, URL_COMPONENT_SEPARATOR } from '@common/utils/url-helper';
import { isNewProduct } from '@common/utils/product';

const mapStateToProps = (state: RootState) => ({
    products: state.ProductsModel,
    isAddingToCart: state.CartModel.isLoading,
    isErrorAddingToCart: state.CartModel.isErrorLoading,
    siteVersion: state.SiteVersion,
    user: state.UserModel,
    pageConfig: state.CmsModel.elements.find((x) => x.slug === 'global-page'),
});

const mapDispatchToProps = (dispatch: any) => ({
    loadProduct: (dispatch as RootDispatch).ProductsModel.loadProductAsync,
    addToCart: (dispatch as RootDispatch).CartModel.addToCartAsync,
    loadProductSummaries: (dispatch as RootDispatch).ProductsModel.loadProductSummaryAsync,
    loadSimilarSilhouettes: (dispatch as RootDispatch).ProductsModel.loadSimilarSilhouettesAsync,
});

export async function preloadProductData(dispatch: RootDispatch, getState: () => RootState, slug: string): Promise<any> {
    const productId = getIdFromSlug(slug);
    const pm =  dispatch.ProductsModel.loadProductAsync(productId);

    if (isNewProduct(productId)) {
        const pid = getPidFromSlug(slug);
        if (pid && !pid.endsWith(URL_COMPONENT_SEPARATOR)) {
            const summaries = await dispatch.ProductsModel.loadProductSummaryAsync([pid]);

            if (summaries.length === 1 && summaries[0]) {
                await dispatch.ProductsModel.loadSimilarSilhouettesAsync(summaries[0].primarySilhouetteId);
            }
        }
    }

    await pm;
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Product));
