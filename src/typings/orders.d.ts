import { Component, SectionGroup } from "typings/product";
import { HeightUnitType } from "@common/constants";
import { DeepPartial } from "@typings";
import { FabricationState, OrderPaymentState, ShipmentState, ReturnsState, OrderState } from "@common/enums/OrderEnums";
import { ComponentType } from "@common/utils/component-type";
import { number } from "prop-types";

export interface OrderComponent {
    title: string;
    code: string;
    price: number;
    componentTypeCategory: ComponentType;
    sortOrder: number
    meta: {
        hex?: string;
        image?: {
            url: string
        };
    }
}

export interface OrderSectionGroup {
    aggregateTitle?: string;
    sections: OrderSection[];
}

export interface OrderSection {
    options: Array<{ code: string}>;
}

export interface OrderGroup {
    title: string;
    sectionGroups: Array<OrderSectionGroup>;
}

export interface OrderProduct {
    productId: string;
    groups: OrderGroup[];
    title: string;
}

export interface OrderTax {
    label: string;
    price: number;
}

export interface OrderCustomizedProduct {
    product: OrderProduct;
    url: string;
    image: string|null;
    price: number;
    lineItemId: number;

    components: OrderComponent[];

    height: number | null;
    heightUnit: HeightUnitType | null;

    projectedDeliveryDate: Date | null;
    returnEligable: boolean;


    fabrication: {
        state: FabricationState, // 'purchase_order_placed' | 'purchase_order_confirmed' | 'fabric_assigned' | 'fabric_assigned' | 'make' | 'qc' | 'shipped' | 'customer_feedback_required' | 'processing'
        date: Date|null,
    },

    shipment: {
        trackingNumber: string | null,
        trackingUrl: string | null,
        state: ShipmentState, // | 'backorder' | 'canceled' | 'partial' | 'pending' | 'ready' | 'shipped',
        shipmentDate: Date | null,
    },

    return: {
        id: number,
        requestId: number | null,
        refundedDate: Date | null,
        refundedAmount: number| null,
        status: ReturnsState,
        createdDate: Date,
        reason: string | null,
        labelUrl: string | null,
        labelImageUrl: string | null,
        labelPdfUrl: string | null,
    } | null
}

export interface Order {
    id: number,
    number: string,
    orderDate: Date | null,
    lastUpdatedDate: Date,
    state: OrderState,
    paymentState: OrderPaymentState, //  | 'balance_due' | 'credit_owed' | 'failed' | 'paid' | 'void'
    total: number,
    promoTotal: number,
    shippingTotal: number,
    itemsTotal: number,
    currency: string,

    isAustralianOrder: boolean;
    isInternationalOrder: boolean;
    isUSOrder: boolean;
    finalReturnByDate: Date|null;

    deliveryAddress: {
        firstName: string | null | undefined,
        lastName: string | null | undefined,
        address1: string | null | undefined,
        address2: string | null | undefined,
        city: string | null | undefined,
        areaCode: string | null | undefined,
        state: string | null | undefined,
        country: string | null | undefined,
    } | null,

    billingAddress: {
        firstName: string | null | undefined,
        lastName: string | null | undefined,
        address1: string | null | undefined,
        address2: string | null | undefined,
        city: string | null | undefined,
        areaCode: string | null | undefined,
        state: string | null | undefined,
        country: string | null | undefined,
    } | null

    items: OrderCustomizedProduct[];

    taxes: OrderTax[];
}

export interface ReturnItemsResponse {
    request_id: number,
    status: number,
}
