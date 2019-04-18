import { SpreeOrder } from "./order";

export interface OrderReturnLineItemRequest {
    line_item_id: number,
    action: 'Return',
    reason_category: string,
    reason: string,
}
