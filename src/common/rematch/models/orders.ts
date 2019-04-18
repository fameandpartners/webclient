import { createModel } from '@rematch/core';
import { Order } from '@typings';
import FameAPI from '@common/services/fameApi';
import { logHandledError } from '@common/utils/error-reporting';
import { OrderReturnLineItemRequest } from 'typings/fame_api/returns';

export interface OrdersRootState {
    orders: Order[] | null;
    orderReturn: number | null;
    error: boolean;
}

const OrdersModel = createModel({
    reducers: {
        update(state: OrdersRootState, orders: Order[]): OrdersRootState {
            return {
                ...state,
                orderReturn: null,
                orders,
            };
        },
        setOrderReturn(state: OrdersRootState, orderReturn: number): OrdersRootState {
            return {
                ...state,
                orderReturn,
            };
        },
        setError(state: OrdersRootState, error: boolean): OrdersRootState {
            return {
                orderReturn: null,
                orders: null,
                error: true,
            };
        }
    },
    state: {
        orders: null,
        orderReturn: null,
        error: false,
    },
    effects: {
        async getOrder(payload: { orderNumber: string, cookies?: string }, rootState: any) {
            try {
                const fameApi = new FameAPI(rootState.SiteVersion);
                const order = await fameApi.fetchOrder(payload.orderNumber, payload.cookies);
                this.update([order]);
            } catch (e) {
                logHandledError(e);
            }
        },
        async getOrders(payload: string, rootState: any) {
            try {
                const fameApi = new FameAPI(rootState.SiteVersion);
                const orders = await fameApi.fetchOrders(payload);
                this.update(orders);
            } catch (e) {
                logHandledError(e);
            }
        },
        async getGuestOrder(payload: { orderNumber: string, email: string, cookies?: string }, rootState: any) {
            try {
                const fameApi = new FameAPI(rootState.SiteVersion);
                const order = await fameApi.fetchGuestOrder(payload.orderNumber, payload.email, payload.cookies);
                this.update([order]);
            } catch (e) {
                this.setError(true);
                logHandledError(e);
            }
        },
        async submitReturnRequest(payload: { orderNumber: string, lineItems: Array<{ id: number, category: string, reason: string }>, email: string, cookies?: string }, rootState: any) {
            try {
                const fameApi = new FameAPI(rootState.SiteVersion);

                const lineItemTransformed = payload.lineItems.map((li) => ({
                    line_item_id: li.id,
                    action: 'Return',
                    reason_category: li.category,
                    reason: li.reason,
                }));

                const orderReturnResponse = await fameApi.submitReturnRequest(
                    payload.orderNumber,
                    lineItemTransformed as OrderReturnLineItemRequest[],
                    payload.email,
                    payload.cookies,
                );

                const order = await fameApi.fetchOrder(payload.orderNumber, payload.cookies);
                this.update([order]);

                this.setOrderReturn(orderReturnResponse.request_id);
            } catch (e) {
                this.setError(true);
                logHandledError(e);
            }
        }
    }
});

export default OrdersModel;
