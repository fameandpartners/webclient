import { Order, OrderCustomizedProduct, CustomizedProduct, ProductListSummary } from '@typings';
import FameAPI from '@common/services/fameApi';
import { logHandledError } from '@common/utils/error-reporting';
import { trackAddToCart, trackRemoveFromCart, trackOpenCart, trackAbandondedCartRestore, trackOrderInProgress } from '@common/analytics/analytics';
import { createModel } from '@rematch/core';

export interface CartModelRootState {
    cart: Order | null;
    isVisible: boolean;
    isLoading: boolean;
    isErrorLoading: boolean;
    isRemovingList: number[];
    isErrorRemovingList: number[];
}

export type AddToCart = (payload: AddToCartPayload) => void;
export type RemoveFromCart = (cp: OrderCustomizedProduct) => void;

export interface AddToCartPayload {
    product: CustomizedProduct;
    summary: ProductListSummary | null;
}

const DEFAULT_STATE: CartModelRootState = {
    cart: null,
    isRemovingList: [],
    isErrorRemovingList: [],
    isVisible: false,
    isLoading: false,
    isErrorLoading: false
};

const CartModel = createModel({
    reducers: {
        update(state: CartModelRootState, payload: {order: Order|null}): CartModelRootState {
            const { order } = payload;
            return {
                ...state,
                cart: order,
                isRemovingList: [],
                isErrorRemovingList: [],
                isLoading: false,
                isErrorLoading: false
            };
        },
        setErrorLoading(state: CartModelRootState, isErrorLoading: boolean): CartModelRootState {
            return {
                ...state,
                isErrorLoading
            };
        },
        setLoading(state: CartModelRootState, isLoading: boolean): CartModelRootState {
            return {
                ...state,
                isLoading
            };
        },
        openCart(state: CartModelRootState): CartModelRootState {
            trackOpenCart();

            return {
                ...state,
                isVisible: true
            };
        },
        closeCart(state: CartModelRootState): CartModelRootState {
            return {
                ...state,
                isVisible: false
            };
        },
        setRemoving(state: CartModelRootState, item: OrderCustomizedProduct): CartModelRootState {
            return {
                ...state,
                isRemovingList: [
                    ...state.isRemovingList,
                    item.lineItemId
                ],
                isErrorRemovingList: state.isErrorRemovingList.filter((id) => id !== item.lineItemId)
            };
        },
        setErrorRemoving(state: CartModelRootState, item: OrderCustomizedProduct): CartModelRootState {
            return {
                ...state,
                isRemovingList: state.isRemovingList.filter((id) => id !== item.lineItemId),
                isErrorRemovingList: [
                    ...state.isErrorRemovingList,
                    item.lineItemId
                ]
            };
        },
        clear(): CartModelRootState {
            return DEFAULT_STATE;
        }
    },
    state: DEFAULT_STATE,
    effects: {
        async addToCartAsync(payload: AddToCartPayload, rootState: any) {
            const { product, summary } = payload;
            trackAddToCart(product, summary);

            this.setLoading(true);
            this.setErrorLoading(false);

            try {
                const fameApi = new FameAPI(rootState.SiteVersion);
                const cart = await fameApi.addToCart(product, summary);
                this.update({order: cart});
                this.openCart();
                trackOrderInProgress(cart, rootState.SiteVersion, rootState.UserModel);
            } catch (e) {
                logHandledError(e);
                this.setErrorLoading(true);
            }

            this.setLoading(false);
        },
        async removeFromCartAsync(payload: OrderCustomizedProduct, rootState: any) {
            trackRemoveFromCart(payload);

            this.setRemoving(payload);

            try {
                const fameApi = new FameAPI(rootState.SiteVersion);
                const cart = await fameApi.removeFromCart(payload);
                this.update({order: cart});
                trackOrderInProgress(cart, rootState.SiteVersion, rootState.UserModel);
            } catch (e) {
                logHandledError(e);
                this.setErrorRemoving(payload);
            }
        },
        async restoreAbandonedCartAsync(payload: string, rootState: any) {
            if (!payload) {
                return;
            }

            trackAbandondedCartRestore(payload);

            this.setLoading(true);
            this.setErrorLoading(false);

            try {
                const fameApi = new FameAPI(rootState.SiteVersion);
                const cart = await fameApi.restoreAbandonedCart(payload);
                this.update({order: cart});
            } catch (e) {
                logHandledError(e);
                this.setErrorLoading(true);
            }

            this.setLoading(false);
        }
    }
});

export default CartModel;
