export type GTMSiteVersion =  'au' | 'us';
export type GTMPageType = 'product' | 'collection' | 'content' | 'search' | 'dressfinder';

export interface GTMProduct {
    id: string
    name: string
    sku: string
    price: number
    type: string;
    isCuration: boolean;
}

export interface GTMListProduct {
    id: string
    name: string
    sku: string
    price: number
    type: string;
}

export interface GTMAddToCartEvent {
    event: 'Cart - Product Added',
    eventDetail: {
        product: GTMProduct;
    }
}

export interface GTMRemoveFromCartEvent {
    event: 'Cart - Product Removed',
    eventDetail: {
        product: GTMProduct;
    }
}

export interface GTMBrontoCartLineItem {
    sku: string,
    name: string,
    description: string,
    category: string,
    variant_price: number,
    quantity: number,
    total_amount: number,
    image_url: string|null,
    product_url: string,
    line_item_id: number,
}

export interface GTMBrontoCart {
    tid?: string,
    phase: 'SHOPPING',
    currency: 'AUD' | 'USD',
    total_amount: number,
    number: string,
    email?: string,
    line_items: Array<GTMBrontoCartLineItem>,
}

export interface GTMOrderEvent {
    event: 'order_in_progress' | 'order_complete',
    order: GTMBrontoCart;
}

export interface GTMSocialSharedEvent {
    event: 'Social Shared',
    socialShared: {
        url: string,
        platform: string
    }
}

export interface GTMPageView {
    event: 'Page Loaded',
    product: GTMProduct | null,
    collection: GTMProduct[] | null,
    page: {
        type: GTMPageType
    }

}

export interface GTMGenericEvent {
    event: string,
    ecommerce?: null,
    eventDetail: {
        category: string;
        label: string;
        product?: {
            id: string
            sku: string
        }
        step?: string;
        facet?: string;
        component?: string;
        context?: string;
    }
}

export interface GTMMeta {
    user: {
        id: number | null,
        loggedIn: boolean,
        name: string | null,
        firstName: string | null,
        lastName: string | null
        email: string | null
    }
    site: {
        version: GTMSiteVersion;
    }
}

export type GTMStuff = GTMMeta | GTMGenericEvent | GTMAddToCartEvent | GTMPageView | GTMRemoveFromCartEvent | GTMSiteVersion | GTMSocialSharedEvent | GTMOrderEvent;

export type DataLayer = Array<GTMStuff>