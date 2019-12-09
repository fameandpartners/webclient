import '@hellohuman/array-exts';
import { CustomizedProduct, SectionGroup, Section, Group, SectionComponent } from 'typings';
import { SelectionType } from '@common/utils/selection-type';
import { ComponentType } from '@common/utils/component-type';
import { HeightUnitType } from '@common/constants';
import { getVisibleOptionsForSection } from '@common/utils/product-visibility';
import { mapToCode } from '@common/utils/product';

// #region Validators

export function getFirstInvalidSectionGroup(customziedProduct: CustomizedProduct) {
    for (const group of customziedProduct.product.groups) {
        for (const sectionGroup of group.sectionGroups) {
            if (!isSectionGroupValid(sectionGroup, customziedProduct)) {
                return { group, sectionGroup };
            }
        }
    }

    return null;
}

export function isGroupValid(group: Group, customziedProduct: CustomizedProduct) {
    const invalidCount = group.sectionGroups.filter((s) => !isSectionGroupValid(s, customziedProduct)).length;

    return invalidCount === 0;
}

export function isSectionGroupValid(sectionGroup: SectionGroup, customziedProduct: CustomizedProduct) {
    const invalidCount = sectionGroup.sections.filter((s) => !isSectionValid(s, customziedProduct)).length;

    return invalidCount === 0;
}

export function isSectionValid(section: Section, customziedProduct: CustomizedProduct) {
    const selectedComponents = customziedProduct.components.map((c) => c.code).intersection(section.options.map(mapToCode));

    if (isSizeSection(section)) {
        return selectedComponents.length === 1 && isHeightValid(customziedProduct);
    } else {
        const visibleOptions = getVisibleOptionsForSection(section, customziedProduct.components);

        if (visibleOptions.length === 0) {
            return true;
        }

        return section.selectionType === SelectionType.RequiredOne ? selectedComponents.length > 0 : true;
    }
}

export function isSizeValid(customizedProduct: CustomizedProduct) {
    return customizedProduct.components.filter((x) => x.componentTypeCategory === ComponentType.Size).length === 1;
}

export function isHeightValid(customizedProduct: CustomizedProduct) {
    if (!customizedProduct.height) {
        return false;
    }

    if (customizedProduct.heightUnit === HeightUnitType.CM) {
        const heightMinValid = customizedProduct.height >= customizedProduct.product.size.minHeightCm;
        const heightMaxValid = customizedProduct.height <= customizedProduct.product.size.maxHeightCm;
        return heightMinValid && heightMaxValid;
    } else if (customizedProduct.heightUnit === HeightUnitType.INCH) {
        const heightMinValid = customizedProduct.height >= customizedProduct.product.size.minHeightInch;
        const heightMaxValid = customizedProduct.height <= customizedProduct.product.size.maxHeightInch;
        return heightMinValid && heightMaxValid;
    } else {
        return false;
    }
}

// #endregion

// #region To Refactor / Remove

export function isSilhouetteGroup(group: Group) {
    return group.slug === 'silhouette';
}

export function isSizeSection(section: Section) {
    return section.componentTypeCategory === ComponentType.Size;
}

export function isColorAndFabricSection(section: Section) {
    return section.componentTypeCategory === ComponentType.ColorAndFabric;
}

export function isColorOrFabricSection(section: Section) {
    return section.componentTypeCategory === ComponentType.Color || section.componentTypeCategory === ComponentType.Fabric;
}

export function isFabricSection(section: Section) {
    return section.componentTypeCategory === ComponentType.Fabric;
}

export function isSizeSectionComponent(sectionedComponents: SectionComponent[]) {
    return sectionedComponents.some((x) => x.section.componentTypeCategory === ComponentType.Size);
}

export function isColorAndFabricSectionComponent(sectionedComponents: SectionComponent[]) {
    return sectionedComponents.some((x) => x.section.componentTypeCategory === ComponentType.ColorAndFabric);
}

export function isColorOrFabricSectionComponent(sectionedComponents: SectionComponent[]) {
    return sectionedComponents.some((x) => x.section.componentTypeCategory === ComponentType.Color || x.section.componentTypeCategory === ComponentType.Fabric);
}

export function isFabricSectionComponent(sectionedComponents: SectionComponent[]) {
    return sectionedComponents.some((x) => x.section.componentTypeCategory === ComponentType.Fabric);
}

export function isMakingSection(section: Section) {
  return section.componentTypeCategory === ComponentType.Making;
}

// #endregion
