
import { filterByComponentType } from '@common/utils/product';
import { ComponentType } from '@common/utils/component-type';
import { CustomizedProduct, ProductListSummary, LineItem } from '@typings';

export default function transform(item: CustomizedProduct, summary: ProductListSummary|null): LineItem {
    const color =  item.components.find(filterByComponentType(ComponentType.Color));
    const fabric =  item.components.find(filterByComponentType(ComponentType.Fabric));
    const fabricAndColor =  item.components.find(filterByComponentType(ComponentType.ColorAndFabric));

    const makingOption =  item.components.find(filterByComponentType(ComponentType.Making));
    const size =  item.components.find(filterByComponentType(ComponentType.Size));

    const customizations = item.components.filter((x) => x !== color && x !== makingOption && x !== size && x !== fabric && x !== fabricAndColor);

    let fabricId;
    if (fabricAndColor) {
        fabricId = fabricAndColor.cartId;
    } else if (color && fabric) {
        fabricId = `${fabric.cartId}-${color.cartId}`;
    }

    return {
        color_id: color && color.cartId,
        size_id: size && size.cartId,
        making_options_ids: makingOption && makingOption.cartId,
        height_value: item.height,
        height_unit: item.heightUnit as string,
        customizations_ids: customizations.map((x) => x.cartId),
        variant_id: item.product.cartId,
        dress_variant_id: undefined, // set to null so it doesn't trigger flash message
        fabric_id: fabricId,
        curation_name: summary && summary.name
    };
}
