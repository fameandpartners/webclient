import 'array-ext';
import { Component, Group, Product, CustomizedProduct, SectionGroup, Section, SectionOption, ProductListSummaries, OrderComponent } from 'typings';
import { ComponentType } from '@common/utils/component-type';
import { SelectionType } from '@common/utils/selection-type';
import { DEFAULT_GLOBAL_OPTIONS_NAME, MediaQueryBreakpoint } from '@common/constants';
import { getParentFromSelection, getOptionsForParent, getSectionForComponentCode } from '@common/utils/product-component';
import { componentCodeToComponent } from '@common/transforms/componentCodeToComponent';
import { trackSelectCustomization, trackDeselectCustomization } from '@common/analytics/analytics';
import { formatProductId } from '@common/utils/render-url-helper';
import { PreviewType } from '@common/utils/preview-type';
import { isBrowser } from './server-client-helpers';

// #region General Helpers

export const RETURN_INSURANCE_SKUS = ['DELIVERY_INSURANCE', 'RETURN_INSURANCE'];

export function isNewProduct(productId: string | number) {
  return productId.toString().startsWith('FPG');
}

export function isSwatchProduct(productId: string | number) {
  return productId.toString().startsWith('SW');
}

export function convertToKebabCase(input: string) {
  return input.toLocaleLowerCase().replace(' ', '-');
}

export function hasCuratedImages(customizedProduct: CustomizedProduct, productListSummaries?: ProductListSummaries) {
  const pid = formatProductId(customizedProduct);
  return customizedProduct.product.previewType === PreviewType.Render && productListSummaries && pid in productListSummaries && Array.isArray(productListSummaries[pid]!.media) && productListSummaries[pid]!.media!.length > 0;
}

// #endregion

// #region Filter and Sorts

export const mapToCode = (component: Partial<Component> | Partial<OrderComponent>): string => component.code!;

export const filterComponentInGroup = (group: Group) => (component: Component) =>
  group.sectionGroups
    .flatMap((g) => g.sections)
    .flatMap((s) => s.options)
    .map(mapToCode)
    .includes(component.code);

export const filterComponentInSectionGroup = (sectionGroup: SectionGroup) => (component: Component) =>
  sectionGroup.sections
    .flatMap((s) => s.options)
    .map(mapToCode)
    .includes(component.code);

export const sortByOrder = (a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder;

export const sortBySelectedThenByOrderOnMobile = (selectedComponents: Component[]) => (a: Component, b: Component) => {
  // Only sort by selected on mobile
  if (isBrowser() && window.innerWidth > MediaQueryBreakpoint.TABLET_LARGE) {
    return a.sortOrder - b.sortOrder;
  }

  if (selectedComponents.includes(a)) {
    return -1;
  } else if (selectedComponents.includes(b)) {
    return 1;
  }

  return a.sortOrder - b.sortOrder;
};

// find sizeComponent
export const findSizeComponent = (components: Component[], sizeAu: string, sizeUs: string) => {
  return components.find((component: Component) => {
    const metaData = component.meta;
    return component.componentTypeCategory === ComponentType.Size && metaData && metaData.sizeAu === sizeAu && metaData.sizeUs === sizeUs;
  });
};

export const filterByComponentType = (type: ComponentType) => (component: Component) => component.componentTypeCategory === type;

export const filterByCompatibleWithSelection = (selection: Component[]) => (component: Component) => true;

export const filterByIncompatibleWith = (parentCode: string) => (component: Component) => parentCode in component.incompatibleWith || DEFAULT_GLOBAL_OPTIONS_NAME in component.incompatibleWith;

export const sortByCode = (a: Component, b: Component) => {
  const aLower = a.code.toLowerCase();
  const bLower = b.code.toLowerCase();
  if (aLower < bLower) {
    return -1;
  } else if (aLower > bLower) {
    return 1;
  }
  return 0;
};

const filterByParent = (parent: Component) => (option: SectionOption) => option.parentOptionId === parent.code || option.parentOptionId === null;
const filterByParentAndDefault = (parent: Component) => (option: SectionOption) => (option.parentOptionId === parent.code || option.parentOptionId === null) && option.isDefault;

export const isIncompatibleIn = (component: Component, category: string, componentCodes: string[]) => {
  return category in component.incompatibleWith && component.incompatibleWith[category].some((x) => x.every((incompat) => componentCodes.includes(incompat)));
};

const isIncompatibleWith = (category: string, componentCodes: string[], selectedComponent: Component, checkingComponent: Component) => {
  return category in selectedComponent.incompatibleWith && selectedComponent.incompatibleWith[category].filter((x) => x.includes(checkingComponent.code)).some((x) => x.every((incompat) => componentCodes.includes(incompat)));
};

/**
 * Filter out incompatibilties in the currently selected list
 * @param components Complete list of system components
 * @param currentSelectedComponents List of currently selected components
 * @param parent The parent component e.g. strappy
 */
export const filterIncompatbilities = (components: Component[], currentSelectedComponents?: Component[], parent?: Component | null) => (option: Partial<SectionOption> | Partial<Component>) => {
  const component = componentCodeToComponent(option.code as string, components);

  if (component && currentSelectedComponents) {
    const selectedComponentCodes = currentSelectedComponents.map(mapToCode);

    // FIRST PASS: Check to see if anything selected is incompatible with this component (this incompatible with that)
    let isSelectionIncompatibleWithCurrentComponent = parent ? isIncompatibleIn(component, parent.code, selectedComponentCodes) : isIncompatibleIn(component, DEFAULT_GLOBAL_OPTIONS_NAME, selectedComponentCodes);

    // Ensure we always check default options if we have a parent
    if (parent && !isSelectionIncompatibleWithCurrentComponent) {
      isSelectionIncompatibleWithCurrentComponent = isIncompatibleIn(component, DEFAULT_GLOBAL_OPTIONS_NAME, selectedComponentCodes);
    }

    // SECOND PASS: Check to see if anything selected is incompatbile with this component (that incompatible with this)
    const isCurrentComponentIncompatibleWithSelection = currentSelectedComponents.some((x) => {
      let isIncompatibleWithParent = false;

      if (parent) {
        isIncompatibleWithParent = isIncompatibleWith(parent.code, [...selectedComponentCodes, component.code], x, component);
      }

      if (!isIncompatibleWithParent) {
        isIncompatibleWithParent = isIncompatibleWith(DEFAULT_GLOBAL_OPTIONS_NAME, [...selectedComponentCodes, component.code], x, component);
      }

      return isIncompatibleWithParent;
    });

    const isIncompatible = isSelectionIncompatibleWithCurrentComponent || isCurrentComponentIncompatibleWithSelection;

    return !isIncompatible;
  }

  // This is a compatible component
  return true;
};

// #endregion

export const totalPrice = ({ product, components }: CustomizedProduct) => {
  return product.price + components.map((p) => p.price).reduce((a, b) => a + b, 0);
};

export const totalStrikeThroughPrice = ({ product, components }: CustomizedProduct) => {
  const basePrice = product.strikeThroughPrice;
  let total = basePrice;

  if (total) {
    const componentStrikeThroughTotals = components
      .filter((x) => x.strikeThroughPrice && x.strikeThroughPrice > 0)
      .map((x) => x.strikeThroughPrice)
      .notNullOrUndefined()
      .reduce((a, b) => a + b, 0);
    total += componentStrikeThroughTotals;
  }

  return total;
};

export function getDressLengthClass(components: Component[]): string {
  const dl = components.filter(filterByComponentType(ComponentType.Length)).first();
  return dl ? `dress-length--${dl.code}` : '';
}

// #region Component / Incompatibilities core logic

function getRelevantComponentsFromParent(product: Product, selectedComponents: Component[], parent: Component) {
  const relevantOptions = getOptionsForParent(product, parent);
  const relevantCustomizationSelectedComponents = selectedComponents.filter(filterByComponentType(ComponentType.Customization)).filter((x) => relevantOptions.includes(x.code));

  return [...selectedComponents.filter((x) => x.componentTypeCategory !== ComponentType.Customization), ...relevantCustomizationSelectedComponents];
}

function getRelevantComponentsFromComponentPerspective(product: Product, relevantComponents: Component[], parent?: Component, additionalComponent?: Component) {
  let updatedRelevantComponents = [...relevantComponents];

  // If we are targeting an additional component e.g. during customisation selections we need to adjust the incompatibilities list
  if (additionalComponent) {
    // Ensure we keep the state of this additional component in tact
    const isSelected = updatedRelevantComponents.includes(additionalComponent);

    // Add in the additional component so that the incompatibility checks are correct (this basically covers component selection / rendering)
    if (!isSelected) {
      // Handle removing any existing things that are incompatible or conflict (as in same section in a ReuqiredOne capacity)
      const section = getSectionForComponentCode(product, additionalComponent.code);
      if (section.selectionType === SelectionType.RequiredOne) {
        // Remove any others that are selected
        updatedRelevantComponents = updatedRelevantComponents.filter((x) => x.componentTypeId !== additionalComponent.componentTypeId);
      }

      updatedRelevantComponents.push(additionalComponent);
    }

    // FIXME: Can optimise this due to the loop continuing on removed elements
    updatedRelevantComponents.forEach((c) => {
      const updatedRelevantComponentCodes = updatedRelevantComponents.map(mapToCode);
      // isIncompatibleWith for multiple, isIncompatibleIn for singluar and this should cover both directions
      let a = false;
      if (parent) {
        a = isIncompatibleWith(parent.code, updatedRelevantComponentCodes, c, additionalComponent) || isIncompatibleIn(additionalComponent, parent.code, [c.code]);
      }
      const b = isIncompatibleWith(DEFAULT_GLOBAL_OPTIONS_NAME, updatedRelevantComponentCodes, c, additionalComponent) || isIncompatibleIn(additionalComponent, DEFAULT_GLOBAL_OPTIONS_NAME, [c.code]);

      if (a || b) {
        updatedRelevantComponents = updatedRelevantComponents.filter((x) => x.code !== c.code);
      }
    });

    if (!isSelected) {
      // Remove the component if it wasn't originally selected.
      updatedRelevantComponents = updatedRelevantComponents.filter((x) => x.code !== additionalComponent.code);
    }
  }

  // Now put in default selections
  return getDefaultSelectedComponents(product, updatedRelevantComponents, parent, additionalComponent);
}

function getMissingRequiredSections(sections: Section[], relevantComponents: Component[]) {
  const requiredSections = sections.filter((x) => x.selectionType === SelectionType.RequiredOne).filter((x) => x.componentTypeCategory !== ComponentType.Size);

  const relevantComponentTypes = relevantComponents.map((x) => x.componentTypeId);
  return requiredSections
    .map((x) => x.componentTypeId)
    .difference(relevantComponentTypes)
    .map((x) => requiredSections.find((s) => s.componentTypeId === x))
    .notNullOrUndefined() as Section[];
}

/**
 * Gets the selected components for a product based on the current selected components in relevancy
 *
 * @param product
 * @param relevantComponents
 * @param parent
 * @param additionalComponent
 */
export function getDefaultSelectedComponents(product: Product, relevantComponents: Component[], parent?: Component, additionalComponent?: Component): Component[] {
  const sections = product.groups.flatMap((x) => x.sectionGroups).flatMap((x) => x.sections);
  let relevantWithAdditionalComponents = [...relevantComponents, additionalComponent].notNullOrUndefined().uniqueMap();

  // On default selection for an empty entry e.g. when just entering custom-dress-FPG1001
  // We need to ensure that the parent is under the selected components as all selections are
  // based off of this parent
  if (relevantWithAdditionalComponents.length === 0 && parent) {
    relevantWithAdditionalComponents.push(parent);
  }

  let missingRequiredSections = getMissingRequiredSections(sections, relevantWithAdditionalComponents);

  let defaultSelectionsForMissingRequiredSections: Component[] = [];
  let retry = false;

  // We need to do this in n passes to ensure we end up with a full selection as there are scenarios e.g
  // - All components in a section are incompatible with the relevant selection + newly selected component
  // - Extras are incompatible
  // - The newly selected component is incompatible with 0..n previously relevant selected components
  do {
    // Something has gone wrong, i.e. there is an extra with a incompatibility with something prior to it.
    defaultSelectionsForMissingRequiredSections = missingRequiredSections
      .map((x) => sections.find((s) => s === x))
      .notNullOrUndefined()
      .map((x) => {
        if (x.options.length === 0) {
          return undefined;
        }

        // Get a new list of potentional options if the default options are incompatible
        let potentionalOptions = x.options.filterIf(!!parent, filterByParentAndDefault(parent!));

        if (potentionalOptions.length === 0) {
          // If the default selections have issues with the relevant components, then we need to expand the potential options
          potentionalOptions = x.options.filterIf(!!parent, filterByParent(parent!));
        }

        // Merge the two arrays once we have completed our initial pass for default selections
        const relevantComponentsWithDefaultSelections = [...relevantWithAdditionalComponents, ...defaultSelectionsForMissingRequiredSections];

        // Do the second pass for default selection
        const validOption = potentionalOptions
          .filter(filterIncompatbilities(product.components, relevantComponentsWithDefaultSelections, parent))
          .map(mapToCode)
          .first();

        if (validOption) {
          // We have an option that is compatible with everything, so lets use that
          const component = componentCodeToComponent(validOption, product.components);

          if (component) {
            // Insert to array to allow the next component to correctly identify incompatibilities
            defaultSelectionsForMissingRequiredSections.push(component);
            return component;
          }
        } else {
          // Select the first option that is compatible and doesn't remove an option that is in a previous step to this one
          const currentSectionIndex = sections.findIndex((s) => s.componentTypeId === x.componentTypeId);
          const sectionsBeforeCurrent = sections.slice(0, currentSectionIndex);
          const componentsBeforeCurrent = relevantComponentsWithDefaultSelections.filter((c) => sectionsBeforeCurrent.some((sbc) => sbc.options.map(mapToCode).includes(c.code)));

          // Because default options are not valid anymore, we need to ensure we check only against parent options
          const validFallbackOption = x.options
            .filterIf(!!parent, filterByParent(parent!))
            .filter(filterIncompatbilities(product.components, componentsBeforeCurrent, parent))
            .first();

          if (validFallbackOption) {
            const validFallbackComponent = componentCodeToComponent(validFallbackOption.code, product.components)!;

            // Remove the incompatibilities after current.
            const sectionsAfterCurrent = sections.slice(currentSectionIndex, sections.length - 1);
            const componentsAfterCurrent = relevantComponentsWithDefaultSelections.filter((c) => sectionsAfterCurrent.some((sac) => sac.options.map(mapToCode).includes(c.code)));
            const componentsAfterCurrentWithoutIncompatibilities = componentsAfterCurrent.filter(filterIncompatbilities(product.components, [...componentsBeforeCurrent, validFallbackComponent], parent));

            // Update the list of relevant components for the next pass
            relevantWithAdditionalComponents = [...componentsBeforeCurrent, validFallbackComponent, ...componentsAfterCurrentWithoutIncompatibilities];

            // Use this selection
            return validFallbackComponent;
          }
        }

        // Shouldn't happen
        return undefined;
      })
      .notNullOrUndefined()
      .map((x) => componentCodeToComponent(x.code, product.components))
      .notNullOrUndefined();

    // We need to now check to see if there were any crazy incompatibilities in case we need to do more passes
    missingRequiredSections = getMissingRequiredSections(sections, relevantWithAdditionalComponents);

    const missingRequiredSectionsNotFound = missingRequiredSections.map((x) => x!.componentTypeId).difference(defaultSelectionsForMissingRequiredSections.map((x) => x.componentTypeId));

    retry = missingRequiredSectionsNotFound.length > 0;
  } while (retry);

  const updatedRelevantComponents = relevantWithAdditionalComponents.filterIf(additionalComponent !== undefined && !relevantComponents.includes(additionalComponent), (x) => x.code !== additionalComponent!.code);

  return [...updatedRelevantComponents, ...defaultSelectionsForMissingRequiredSections].uniqueMap();
}

/**
 * Gets the selected components that include and are PRIOR to the current section group as we disregard any successive component as previous sections have the priority
 * @param
 */
export function getSelectedComponents({ groups, currentSelectedGroup, currentSelectedSectionGroup, currentSelectedComponents }: { groups: Group[]; currentSelectedGroup: Group; currentSelectedSectionGroup: SectionGroup; currentSelectedComponents: Component[] }): Component[] {
  const currentSelectedSectionGroupIndex = currentSelectedGroup.sectionGroups.indexOf(currentSelectedSectionGroup);
  const currentSelectedGroupIndex = groups.indexOf(currentSelectedGroup);

  const sgEndIndex = currentSelectedSectionGroupIndex + 1; // Increment by 1 to include the current sectionGroup
  const groupEndIndex = currentSelectedGroupIndex;

  const product: Partial<Product> = { groups };
  const parent = getParentFromSelection(product as Product, currentSelectedComponents);

  // Otherwise lets find the selected components that are above the current group id
  const selectedWithinGroup = currentSelectedGroup.sectionGroups
    .slice(0, sgEndIndex)
    .flatMap((x) => x.sections)
    .flatMap((x) => x.options)
    .filterIf(parent !== undefined, (x) => x.parentOptionId === parent.code || !x.parentOptionId)
    .map((o) => currentSelectedComponents.find((sc) => sc.code === o.code)!)
    .notNullOrUndefined();

  const selectedWithinPreviousGroups = groups
    .slice(0, groupEndIndex)
    .flatMap((x) => x.sectionGroups)
    .flatMap((x) => x.sections)
    .flatMap((x) => x.options)
    .filterIf(parent !== undefined, (x) => x.parentOptionId === parent.code || !x.parentOptionId)
    .map((o) => currentSelectedComponents.find((sc) => sc.code === o.code)!)
    .notNullOrUndefined();

  return [...selectedWithinGroup, ...selectedWithinPreviousGroups];
}

export function getRelevantComponents(options: { product: Product; selectedComponents: Component[]; additionalComponent?: Component; defaultParent?: Component | null; ignoreParent?: boolean }): Component[] {
  const { product, selectedComponents, additionalComponent, defaultParent, ignoreParent } = options;

  if (ignoreParent) {
    // If we are ignoring parents, then this should have no parents in the group/product

    /*
            1. Do getRelevantComponentsFromComponentPerspective but without a parent
            ?? What would be the base relevant components?
            Everything until there is an incompatibility with the current component

        */

    return getRelevantComponentsFromComponentPerspective(product, selectedComponents, undefined, additionalComponent);
  }

  const parent = defaultParent || getParentFromSelection(product, selectedComponents, additionalComponent);

  if (!parent) {
    // If we don't have a parent, then this is probably an empty dress. Return default selections.
    return getDefaultSelectedComponents(product, selectedComponents);
  }

  // Get the relevant components by filtering out incompatibilities and only options relevant for this parent
  const relevantComponents = getRelevantComponentsFromParent(product, selectedComponents, parent);

  // Get relevant components using the additional component incompatibility
  return getRelevantComponentsFromComponentPerspective(product, relevantComponents, parent, additionalComponent);
}

/**
 * This determines whether to select or deselect the element and adjusts the selected components list accordingly
 * @param section Current section
 * @param component Current component to check
 * @param selectedComponents List of selected components
 * @param customizedProduct Current customizedProduct
 * @param track Track events in analytics
 */
export function auditSelectionType(section: Section, component: Component, selectedComponents: Component[], customizedProduct: CustomizedProduct, track: boolean): Component[] {
  let audited = [...selectedComponents];
  if (section.selectionType === SelectionType.OptionalMultiple) {
    // Deselect if it exists
    const componentExists = audited.includes(component);

    if (componentExists && track) {
      trackDeselectCustomization(section, component, customizedProduct);
    } else if (!componentExists && track) {
      trackSelectCustomization(section, component, customizedProduct);
    }

    audited = componentExists ? audited.filter((x) => x.code !== component.code) : [...audited, component];
  } else {
    // There are 0 - 1, therefore we remove the old component for this 'type' then add this new one
    const oldComponents = audited.filter(filterByComponentType(component.componentTypeCategory));
    if (oldComponents.includes(component)) {
      if (section.selectionType === SelectionType.RequiredOne) {
        // Do nothing as there is a requirement of 1 selection
      } else {
        // Its the same component, so we don't need to add it back
        if (track) {
          trackDeselectCustomization(section, component, customizedProduct);
        }

        audited = audited.filter((c) => c.code !== component.code);
      }
    } else {
      // Remove all of that type within the section
      const oldComponentInSection = audited.filter((x) => section.options.map(mapToCode).includes(x.code));
      const needToRemoveOldComponentInSection = oldComponentInSection.length > 0;
      if (needToRemoveOldComponentInSection) {
        audited = audited.filter((x) => !oldComponentInSection.includes(x));
      }

      if (track) {
        trackSelectCustomization(section, component, customizedProduct);
      }
      audited.push(component);
    }
  }

  return audited;
}

// #endregion
