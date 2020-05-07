//import '@hellohuman/array-exts';
import { Section, Component, SectionOption, Group, Product } from 'typings';
import { getParentFromSelection } from '@common/utils/product-component';
import { filterIncompatbilities, mapToCode } from '@common/utils/product';
import { mapComponentCodeToComponent } from '@common/transforms/componentCodeToComponent';

export function getVisibleOptionsForSection(section: Section, selectedComponents: Component[]): SectionOption[] {
    // const parentOptions = section.options.map((o) => o.parentOptionId).filter((x) => x !== null).uniqueMap();
    const parentOptions = section.options
        .map((o) => o.parentOptionId)
        .uniqueMap()
        .notNullOrUndefined();
    const parentOptionSelected = parentOptions.length > 0 ? selectedComponents.filter((x) => parentOptions.includes(x.code))[0] : null;

    // Options with no parents should always be available
    const optionsWithoutParents = section.options.filter((o) => !o.parentOptionId);

    // Return all valid options against the selected parent
    const optionsWithSelectedParent = parentOptionSelected ? section.options.filter((o) => o.parentOptionId === parentOptionSelected.code) : [];

    return [...optionsWithoutParents, ...optionsWithSelectedParent];
}

export function getVisibleOptions(groups: Group[], selectedComponents: Component[]): SectionOption[] {
    return groups
        .flatMap((x) => x.sectionGroups)
        .flatMap((x) => x.sections)
        .map((x) => getVisibleOptionsForSection(x, selectedComponents))
        .flatMap((x) => x);
}

export function getVisibleComponentsForSection(product: Product, section: Section, selectedComponents: Component[]): Component[] {
    const parentOptions = section.options
        .map((o) => o.parentOptionId)
        .uniqueMap()
        .notNullOrUndefined();
    const parent = getParentFromSelection(product, selectedComponents);

    return getVisibleOptionsForSection(section, selectedComponents)
        .filter(filterIncompatbilities(product.components, selectedComponents, parentOptions.length === 0 ? null : parent))
        .map(mapToCode)
        .map(mapComponentCodeToComponent(product.components))
        .notNullOrUndefined()
        .uniqueMap();
}

export function getVisibleComponents(product: Product, selectedComponents: Component[]): Component[] {
    return product.groups
        .flatMap((x) => x.sectionGroups)
        .flatMap((x) => x.sections)
        .map((x) => getVisibleComponentsForSection(product, x, selectedComponents))
        .flatMap((x) => x);
}
