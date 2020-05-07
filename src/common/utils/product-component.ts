//import '@hellohuman/array-exts';
import { Section, Component, Product } from 'typings';
import { mapToCode } from '@common/utils/product';
import { mapComponentCodeToComponent } from '@common/transforms/componentCodeToComponent';

// #region Get Component Helpers

export function onlyParentSelected(section: Section, component: Component, selectedComponents: Component[]): Component | null {
    if (selectedComponents.length !== 1) {
        return null;
    }

    const parentOptions = section.options
        .map((o) => o.parentOptionId)
        .uniqueMap()
        .filter((x) => !!x);

    return parentOptions.length > 0 ? selectedComponents.filter((x) => parentOptions.includes(x.code))[0] : component;
}

export function getDefaultParent(product: Product): Component | null {
    return getParentComponentCodes(product).map(mapComponentCodeToComponent(product.components))[0];
}

export function getParentComponentCodes(product: Product): string[] {
    // Parent components are based on anything in a sectionOption with parentOptionId
    return product.groups
        .flatMap((x) => x.sectionGroups)
        .flatMap((x) => x.sections)
        .flatMap((x) => x.options)
        .map((o) => o.parentOptionId)
        .uniqueMap()
        .notNullOrUndefined();
}

export function getParentFromSelection(product: Product, selectedComponents: Component[], currentComponent?: Component): Component {
    const parentCodes = getParentComponentCodes(product);
    const currentComponentIsParent = currentComponent && parentCodes.includes(currentComponent.code);

    if (currentComponentIsParent) {
        return currentComponent!;
    }

    const parents = selectedComponents.filter((x) => (currentComponent ? x.code !== currentComponent.code : true)).filter((x) => parentCodes.includes(x.code));

    return parents[0];
}

export function getOptionsForParent(product: Product, parent?: Component): string[] {
    if (!parent) {
        return [];
    }

    // TODO: Disclude any parent codes that may appear here from !x.parentOptionId

    return product.groups
        .flatMap((x) => x.sectionGroups)
        .flatMap((x) => x.sections)
        .flatMap((x) => x.options)
        .filter((x) => x.parentOptionId === parent.code || !x.parentOptionId)
        .map(mapToCode);
}

export function getSectionForComponentCode(product: Product, componentCode: string): Section {
    return product.groups
        .flatMap((group) => group.sectionGroups)
        .flatMap((sg) => sg.sections)
        .filter((section) => section.options.map((so) => so.code).includes(componentCode))[0];
}

export function getComponentFromComponentCode(product: Product, componentCode: string): Component {
    return product.components.filter((component) => component.code === componentCode)[0];
}

// #endregion
