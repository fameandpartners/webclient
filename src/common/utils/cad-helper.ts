import { Component, LayerCAD, LayerCADActive, CustomizedProduct } from 'typings';
import { LayerCadType } from '@common/utils/layer-cad-types';
import { getFallbackMedia } from './render-url-helper';
import { ImageSizeType } from './image-size-type';
import { mapToCode } from './product';
import { RenderPositionId } from '@common/utils/render-position-id';

export const sortByComponentLength = (a: LayerCAD, b: LayerCAD) => b.components.length - a.components.length;

export function getRenderableBaseCads(cads: LayerCAD[], selectedComponents: Component[] | null): LayerCADActive[] {
    // Filter by Base CADs
    const base = cads.filter((x) => x.type === LayerCadType.Base).sort((a, b) => a.sortOrder - b.sortOrder);

    // Get currently selected Base components
    const selected = base.filter((x) => x.components.intersection(selectedComponents!.map((c) => c.code)).length > 0);

    // Find the base that is active
    const visibleCad = selected.length === 0 ? base[base.length - 1] : selected[0];

    // Create a LayerCADActive array to add isActive to the object for rendering
    return base.map((cad) => ({ ...cad, isActive: visibleCad.url === cad.url }));
}

export function getRenderableLayerCads(cads: LayerCAD[], selectedComponents: Component[] | null): LayerCADActive[] {
    // Get the layer cads in the correct order
    const layerCads = cads.filter((x) => x.type === LayerCadType.Layer).sort((a, b) => b.sortOrder - a.sortOrder);

    // Get the selected cads
    const selected = layerCads.filter((x) => x.components.every((customization) => selectedComponents!.map((component) => component.code).includes(customization)));

    // Find the components that are duplicated across cads
    const codesDuplicated = layerCads.flatMap((x) => x.components).duplication();

    // Find the cad which should be rendered for the duplicated components
    // Basically the selected cad that has the higher number of components required while containing the duplicated one should be rendered
    const hash = {};
    codesDuplicated.forEach((cd) => {
        const selectedCadsWithDuplicated = selected.filter((s) => s.components.includes(cd));
        selectedCadsWithDuplicated.forEach((scwd) => {
            const currentLength = scwd.components.length;
            if (!(cd in hash) || currentLength > hash[cd]) {
                hash[cd] = currentLength;
            }
        });
    });

    // Create the map of components setting which are active and which aren't
    const active = layerCads.map((x) => {
        const isSelected = selected.filter((s) => s.url === x.url).length > 0;

        // If this component isn't selected, don't render
        if (!isSelected) {
            return { ...x, isActive: false };
        }

        // Find the duplications if they exist for this component
        const dupes = x.components.intersection(codesDuplicated);

        // If they don't exist, then keep it as active
        if (dupes.length === 0) {
            return { ...x, isActive: true };
        }

        // This component contains duplications. So make sure this is the one with the highest component count
        return {
            ...x,
            isActive: x.components.length === hash[dupes[0]],
        };
    });

    return active;
}

export function getRenderableCads(cads: LayerCAD[], selectedComponents: Component[] | null): LayerCADActive[] {
    return [
        ...getRenderableBaseCads(cads.filter((x) => x.type === LayerCadType.Base), selectedComponents),
        ...getRenderableLayerCads(cads.filter((x) => x.type === LayerCadType.Layer), selectedComponents),
    ].sort((a, b) => b.sortOrder - a.sortOrder);
}

export function getCads(customizedProduct: CustomizedProduct): LayerCADActive[] {
    if (Array.isArray(customizedProduct.product.layerCads) && customizedProduct.product.layerCads.length > 0) {
        return getRenderableCads(customizedProduct.product.layerCads, customizedProduct.components);
    }

    // If we get to here that means it's probably a resort cad so we need to generate the users for it instead.
    // This is a stop gap until the dresses are imported over, then this should make the rest of the cad logic redundant
    // There will only be one element here which is the active element.

    const cadActive: Partial<LayerCADActive> = {
        isActive: true,
        src: getFallbackMedia({
            productId: customizedProduct.product.productId,
            components: customizedProduct.components.map(mapToCode),
            renderPositionId: RenderPositionId.CadNone,
            sizes: [ImageSizeType.Option704, ImageSizeType.Option1056],
            productVersionId: customizedProduct.product.productVersionId
        }),
    };

    return [
        cadActive as LayerCADActive
    ];
}
