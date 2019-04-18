import React from 'react';
import { Section, Component, CustomizedProduct, SectionGroup, SectionComponent } from 'typings/product';
import { filterByComponentType, sortBySelectedThenByOrderOnMobile, isIncompatibleIn } from '@common/utils/product';
import { ComponentType } from '@common/utils/component-type';
import OptionsList from '@components/customization/OptionsList';
import Accordion from '@components/base/Accordion';
import { DEFAULT_GLOBAL_OPTIONS_NAME } from '@common/constants';

interface Props {
    section: Section;
    sectionGroup: SectionGroup;
    componentsList: Component[];
    onSelected: (sectionComponents: SectionComponent[]) => void;
    customizedProduct: CustomizedProduct;
    initalCustomizedProduct: CustomizedProduct;
}

interface State {
    fabrics: Component[];
    colors: Component[];
}

class ColorOrFabricSection extends React.PureComponent<Props, State> {
    //  ASSUMPTION
    // - All colors and compatible with all fabrics

    public static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> {
        return {
            fabrics: nextProps.componentsList!!.filter(filterByComponentType(ComponentType.Fabric)),
            colors: nextProps.componentsList!!.filter(filterByComponentType(ComponentType.Color)).sort(sortBySelectedThenByOrderOnMobile(nextProps.initalCustomizedProduct.components)),
        };
    }

    private isSelected(color: Component, fabric: Component) {
        // Custom logic because of color codes duplicated in all fabrics.
        // The colour is only selected if this fabric is selected.

        const selectedComponents = this.props.customizedProduct.components;

        return selectedComponents.includes(fabric) && selectedComponents.includes(color);
    }

    public render() {
        const { fabrics, colors } = this.state;
        const { sectionGroup } = this.props;

        const useAccordion = fabrics.length > 1;

        return (
            <div>
                <style jsx>{`
                    @import 'vars';

                    h4 {
                        text-align: center;

                        @include mobile {
                            margin: space(2) 0 space(1);
                        }
                        @include desktop {
                            margin: space(0) 0 space(3);
                        }
                    }
                `}</style>
                {!useAccordion && fabrics.map((fabric) => (
                    <React.Fragment>
                        {fabric.title && <h4>{fabric.title}</h4>}
                        <OptionsList
                            sectionGroup={sectionGroup}
                            title={''}
                            section={this.props.section}
                            componentsList={colors}
                            onSelected={(sc) => this.props.onSelected([ ...sc, { section: sectionGroup.sections.filter((s) => s.componentTypeCategory === ComponentType.Fabric).first()!, components: [fabric] }])}
                            customizedProduct={{ ...this.props.customizedProduct, components: this.props.customizedProduct.components.map((x) => {
                                if (x.componentTypeCategory === fabric.componentTypeCategory) {
                                    // We need to fake this fabric as the selected fabric to render it properly :(
                                    return fabric;
                                }

                                return x;
                            })}}
                            selectedComponents={this.props.customizedProduct.components}
                            isSelected={(c) => this.isSelected(c, fabric)}
                        />
                    </React.Fragment>
                ))}
                {useAccordion && fabrics.map((fabric) => (
                    <Accordion title={fabric.title} key={fabric.code} openOnLoad={this.props.customizedProduct.components.includes(fabric)}>
                        <OptionsList
                            sectionGroup={sectionGroup}
                            title={''}
                            section={this.props.section}
                            componentsList={colors.filter((c) => !isIncompatibleIn(c, DEFAULT_GLOBAL_OPTIONS_NAME, [fabric.code]))}
                            onSelected={(sc) => this.props.onSelected([ ...sc, { section: sectionGroup.sections.filter((s) => s.componentTypeCategory === ComponentType.Fabric).first()!, components: [fabric] }])}
                            customizedProduct={{ ...this.props.customizedProduct, components: this.props.customizedProduct.components.map((x) => {
                                if (x.componentTypeCategory === fabric.componentTypeCategory) {
                                    // We need to fake this fabric as the selected fabric to render it properly :(
                                    return fabric;
                                }

                                return x;
                            })}}
                            selectedComponents={this.props.customizedProduct.components}
                            isSelected={(c) => this.isSelected(c, fabric)}
                        />
                    </Accordion>
                ))}
                {fabrics.length === 0 && (
                    <OptionsList
                        sectionGroup={sectionGroup}
                        title={''}
                        section={this.props.section}
                        componentsList={colors}
                        onSelected={this.props.onSelected}
                        customizedProduct={this.props.customizedProduct}
                        selectedComponents={this.props.customizedProduct.components}
                    />
                )}
            </div>
        );
    }
}

export default ColorOrFabricSection;
