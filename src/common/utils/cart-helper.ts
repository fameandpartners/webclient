import { mapToCode, filterByComponentType, RETURN_INSURANCE_SKUS } from '@common/utils/product';
import { ComponentType } from '@common/utils/component-type';
import { CustomizedProduct, OrderCustomizedProduct, Order } from '@typings';

export function countCartItems(cart: Order | null) {
    if (!cart) {
        return 0;
    }

    return cart.items.filter((lineItem) => !RETURN_INSURANCE_SKUS.includes(lineItem.product.title)).length;
}

export function isInCart(cart: Order | null, cp: CustomizedProduct): OrderCustomizedProduct | undefined {
    if (!cart) {
        return undefined;
    }
    
    return cart.items.find((item) => {
        if (item.product.productId.toLowerCase() !== cp.product.productId.toLowerCase()) {
            return false;
        }

        let cartItemCodes = item.components.map(mapToCode);
        const itemCodes = cp.components.map(mapToCode);

        if (!!cp.components.filter(filterByComponentType(ComponentType.Color))
            && !!cp.components.filter(filterByComponentType(ComponentType.Fabric))) {
            cartItemCodes = cartItemCodes.flatMap((x) => x.split('-'));
        }

        if (cartItemCodes.length !== itemCodes.length) {
            return false;
        }

        return cartItemCodes.difference(itemCodes).length === 0;
    });
}
