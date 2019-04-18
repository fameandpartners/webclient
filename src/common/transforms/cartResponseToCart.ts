
import { SpreeOrder, Order, SpreeOrderLineItem, SpreeOrderComponent, OrderCustomizedProduct, OrderComponent } from '@typings';
import { ComponentType } from '@common/utils/component-type';
import { RETURN_INSURANCE_SKUS } from '@common/utils/product';
import { FabricationState, ShipmentState, ReturnsState } from '@common/enums/OrderEnums';

const transformComponent = (type: ComponentType) => ((component: SpreeOrderComponent, index: number): OrderComponent => {
    const price = parseInt(component.price, 10);

    return {
        title: component.presentation,
        code: component.name,
        componentTypeCategory: type,
        price,
        sortOrder: index,
        meta: {
            hex: 'hex' in component ? component.hex : undefined,
            image: 'image_url' in component  && component.image_url ? { url: component.image_url } : undefined
        }
    };
});

export default function transform(cartResponse: SpreeOrder): Order {
    return {
        items: cartResponse.line_items.map((product): OrderCustomizedProduct => ({
            lineItemId: product.id,
            url: product.url,
            price: parseInt(product.price, 10),
            product: {
                productId: product.sku,
                title: product.name,
                groups: [
                    {
                        title: 'Color',
                        sectionGroups: [
                            {
                                sections: [{
                                    options: product.color && !product.fabric ? [{code: product.color.name}] : []
                                }]
                            }
                        ]
                    },
                    {
                        title: 'Fabric & Color',
                        sectionGroups: [
                            {
                                sections: [{
                                    options: product.fabric ? [{code: product.fabric.name}] : []
                                }]
                            }
                        ]
                    },
                    {
                        title: 'Customizations',
                        sectionGroups: [
                            {
                                sections: [{
                                    options: product.customizations.map((x) => ({code: x.name}))
                                }]
                            }
                        ]
                    },
                    {
                        title: 'Size',
                        sectionGroups: [
                            {
                                sections: [{
                                    options: product.size ? [{ code: product.size.name }] : []
                                }]
                            }
                        ]
                    },
                    {
                        title: 'Delivery',
                        sectionGroups: [
                            {
                                sections: [{
                                    options: product.making_options.map((x) => ({code: x.name}))
                                }]
                            }
                        ]
                    }
                ].filter((group) => group.sectionGroups[0].sections[0].options.length > 0),
            },

            components: [
                ...(!product.fabric && product.color ? [product.color] : []).map(transformComponent(ComponentType.Color)),
                ...product.customizations.map(transformComponent(ComponentType.LegacyCustomization)),
                ...(product.size ? [product.size] : []).map(transformComponent(ComponentType.Size)),
                ...product.making_options.map(transformComponent(ComponentType.Making)),
                ...(product.fabric ? [product.fabric] : []).map(transformComponent(ComponentType.ColorAndFabric))
            ],
            returnEligable: product.return_eligible,

            image: product.image_url,
            height: product.height_value ? parseInt(product.height_value, 10) : null,
            heightUnit: product.height_unit as any,

            fabrication: product.fabrication ? {
                state: product.fabrication.state || FabricationState.Processing,
                date: product.fabrication.date ? new Date(product.fabrication.date) : null
            } : {
                state: FabricationState.Processing,
                date:  new Date()
            },

            projectedDeliveryDate: product.projected_delivery_date ? new Date(product.projected_delivery_date) : null,

            return: product.return ? {
                id: product.return.id,
                requestId: product.return.request_id,
                refundedDate: product.return.refunded_at ? new Date(product.return.refunded_at) : null,
                refundedAmount: product.return.refund_amount ? parseFloat(product.return.refund_amount) : null,
                status: (product.return.refund_status === 'Complete') ? ReturnsState.Refunded : product.return.acceptance_status as ReturnsState,
                createdDate: new Date(product.return.created_at),
                reason: product.return.comments,
                labelImageUrl: product.return.label_image_url,
                labelPdfUrl: product.return.label_pdf_url,
                labelUrl: product.return.label_url,
            } : null,

            shipment: product.shipment ? {
                trackingNumber: product.shipment.tracking_number,
                trackingUrl: product.shipment.tracking_url,
                state: product.shipment.state as ShipmentState,
                shipmentDate: product.shipment.shipped_at ? new Date(product.shipment.shipped_at) : null,
            } : {
                trackingNumber: null,
                trackingUrl: null,
                state: ShipmentState.Pending,
                shipmentDate: null
            }
        })),
        taxes: cartResponse.taxes.map((t) => ({
            label: t.label,
            price: parseInt(t.price, 10)
        })),
        itemsTotal: parseInt(cartResponse.item_total, 10),
        promoTotal: parseInt(cartResponse.promotion_total, 10),
        shippingTotal: parseInt(cartResponse.shipment_total, 10),
        total: parseInt(cartResponse.total, 10),
        number: cartResponse.number,

        orderDate: cartResponse.completed_at ? new Date(cartResponse.completed_at) : null,
        id: cartResponse.id,

        deliveryAddress: cartResponse.ship_address && {
            firstName: cartResponse.ship_address.firstname,
            lastName: cartResponse.ship_address.lastname,
            address1: cartResponse.ship_address.address1,
            address2: cartResponse.ship_address.address2,
            city: cartResponse.ship_address.city,
            areaCode: cartResponse.ship_address.zipcode,
            state: cartResponse.ship_address.state,
            country: cartResponse.ship_address.country,
        },
        billingAddress: cartResponse.billing_address && {
            firstName: cartResponse.billing_address.firstname,
            lastName: cartResponse.billing_address.lastname,
            address1: cartResponse.billing_address.address1,
            address2: cartResponse.billing_address.address2,
            city: cartResponse.billing_address.city,
            areaCode: cartResponse.billing_address.zipcode,
            state: cartResponse.billing_address.state,
            country: cartResponse.billing_address.country,
        },
        currency: cartResponse.currency,
        finalReturnByDate: cartResponse.final_return_by_date ? new Date(cartResponse.final_return_by_date) : null,
        isAustralianOrder: !!cartResponse.ship_address && cartResponse.ship_address.country === 'Australia',
        isInternationalOrder: !!cartResponse.ship_address && cartResponse.ship_address.country !== 'United States',
        isUSOrder: !!cartResponse.ship_address && cartResponse.ship_address.country === 'United States',
        lastUpdatedDate: new Date(cartResponse.updated_at),
        paymentState: cartResponse.payment_state,
        state: cartResponse.state
    };
}
