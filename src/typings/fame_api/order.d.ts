import { User } from "../user";
import { createFactory } from "react";
import { ShipmentState, OrderPaymentState, OrderState, FabricationState } from "@common/enums/OrderEnums";

export type SpreeOrderFabric = {
    presentation: string,
    name: string,
    price: string,
    image_url: string|null
}

export type SpreeOrderColor = {
    presentation: string,
    name: string,
    price: string,
    image_url: string|null
    hex?: string
}

export type SpreeOrderMakingOption = {
    presentation: string,
    name: string,
    price: string
    delivery_period: string
}

export type SpreeOrderCustomization = {
    presentation: string,
    price: string,
    name: string
}

export type SpreeOrderSize = {
    presentation: string,
    name: string,
    price: string,
}

type SpreeOrderComponent = SpreeOrderFabric | SpreeOrderColor | SpreeOrderMakingOption | SpreeOrderCustomization | SpreeOrderSize;

export type SpreeOrderLineItem = {
    id: number,
    price: string,
    sku: string,
    name: string,
    url: string,
    height_value: string,
    height_unit: string,
    size?: SpreeOrderSize,
    making_options: Array<SpreeOrderMakingOption>,
    customizations: Array<SpreeOrderCustomization>,
    fabric?: SpreeOrderFabric,
    color?: SpreeOrderColor,
    image_url: string | null,
    return_eligible: boolean,
    projected_delivery_date: string | null,

    fabrication: {
        state: FabricationState
        date: string | null
    }

    return?: {
        id: number,
        request_id: number|null,
        refunded_at: string|null
        refund_amount: string|null
        comments: string|null
        label_image_url: string|null
        label_pdf_url: string|null
        label_url: string|null
        created_at: string
        refund_status: string
        acceptance_status: string
    }

    shipment?: {
        tracking_number: string | null;
        tracking_url: string | null;
        state: ShipmentState | null;
        shipped_at: string | null;
    }
}

export type SpreeOrderAddress = {
    firstname: string | null | undefined,
    lastname: string | null | undefined,
    address1: string | null | undefined,
    address2: string | null | undefined,
    city: string | null | undefined,
    zipcode: string | null | undefined,
    state: string | null | undefined,
    country: string | null | undefined,
}

export type SpreeOrder = {
    id: number,
    line_items: Array<SpreeOrderLineItem>,
    number: string,
    total: string
    shipment_total: string
    promotion_total: string
    item_total: string
    completed_at: string | null
    updated_at: string
    final_return_by_date: string | null
    currency: string
    state: OrderState
    payment_state: OrderPaymentState
    ship_address: SpreeOrderAddress | null
    billing_address: SpreeOrderAddress | null
    taxes: Array<{
        label: string;
        price: string;
    }>
}
