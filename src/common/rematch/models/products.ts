import { Product, ProductListSummaries, ProductListSummary } from '@typings';
import FameAPI from '@common/services/fameApi';
import { createModel } from '@rematch/core';

export interface ProductsModelRootState {
    products: { [key: string]: Product | null };
    productListSummmaries: ProductListSummaries;
}

export const DEFAULT_STATE: ProductsModelRootState = {
    products: {},
    productListSummmaries: {}
};

export type ProductIdentifier = string | number;

const ProductsModel = createModel({
    state: DEFAULT_STATE,
    reducers: {
        updateProducts(state: ProductsModelRootState, id: string, payload: Product): ProductsModelRootState {
            return {
                ...state,
                products: {
                    ...state.products,
                    [id]: payload
                }
            };
        },
        updateProductListSummaries(state: ProductsModelRootState, payload: ProductListSummary[]): ProductsModelRootState {
            return {
                ...state,
                productListSummmaries: {
                    ...state.productListSummmaries,
                    ...payload.reduce(
                        (result, item) => {
                            result[item.pid] = item;
                            return result;
                        },
                        {}
                    )
                }
            };
        },
    },
    effects: {
        async loadProductAsync(id: string, rootState: any) {
          if (rootState.ProductsModel[id] === undefined) {
                const fameApi = new FameAPI(rootState.SiteVersion);
                const product = await fameApi.getProduct(id);
                this.updateProducts(id, product);
          }
        },
        async loadProductSummaryAsync(payload: string[], rootState: any): Promise<ProductListSummary[]> {
            const toLoad = payload.filter((pid) => !rootState.ProductsModel.productListSummmaries[pid]);

            if (toLoad.length > 0) {
                const fameApi = new FameAPI(rootState.SiteVersion);
                const products = await fameApi.getProductSummaries(toLoad);
                this.updateProductListSummaries(products);
                return products;
            }
            return [];
        },
        async loadSimilarSilhouettesAsync(payload: string, rootState: any) {
            const fameApi = new FameAPI(rootState.SiteVersion);
            const similarSilhouettes = await fameApi.getSimilarSilhouttes(payload);
            this.updateProductListSummaries(similarSilhouettes);
        }
    },
});

export default ProductsModel;
