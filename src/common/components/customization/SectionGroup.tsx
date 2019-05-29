import { isSizeSection, isFabricSection, isColorAndFabricSection, isColorOrFabricSection } from '@common/utils/product-validation';
import OptionSection from '@components/customization/OptionSection';
import SizeSelectionSection from '@components/customization/SizeSelectionSection';
import React from 'react';
import { Component, CustomizedProduct, SectionGroup as ISectionGroup, Section, SectionComponent } from 'typings';
import ColorAndFabricSection from '@components/customization/ColorAndFabricSection';
import ColorOrFabricSection from '@components/customization/ColorOrFabricSection';
import { SiteVersionContext } from '@common/context/SiteVersionContext';
interface Props {
  sectionGroup: ISectionGroup;
  componentsList: Component[];
  selectedComponents: Component[];
  initialCustomizedProduct: CustomizedProduct;
  currentCustomizedProduct: CustomizedProduct;
  onSelected: (sectionComponents: SectionComponent[]) => void;
  saveSize: (size: Partial<CustomizedProduct>) => void;
  showErrors: boolean;
}

class SectionGroup extends React.PureComponent<Props> {
  public render() {
    const { sectionGroup, initialCustomizedProduct, currentCustomizedProduct, onSelected, saveSize, componentsList, showErrors, selectedComponents } = this.props;

    return (
      <React.Fragment>
        {sectionGroup.sections
          .filter((s) => s.options.length > 0)
          .map((s) => {
            const commonProps = {
              componentsList,
              onSelected,
              section: s,
              customizedProduct: currentCustomizedProduct,
              key: s.componentTypeId,
              sectionGroup
            };

            if (isFabricSection(s)) {
              return null;
            }

            if (isSizeSection(s)) {
              return <SiteVersionContext.Consumer>{(siteVersion) => <SizeSelectionSection saveSize={saveSize} showErrors={showErrors} siteVersion={siteVersion} {...commonProps} />}</SiteVersionContext.Consumer>;
            } else if (isColorOrFabricSection(s)) {
              return <ColorOrFabricSection initalCustomizedProduct={initialCustomizedProduct} {...commonProps} />;
            } else if (isColorAndFabricSection(s)) {
              return <ColorAndFabricSection initalCustomizedProduct={initialCustomizedProduct} {...commonProps} />;
            } else {
              return <OptionSection selectedComponents={selectedComponents} {...commonProps} customizedProduct={initialCustomizedProduct} />;
            }
          })}
      </React.Fragment>
    );
  }
}

export default SectionGroup;
