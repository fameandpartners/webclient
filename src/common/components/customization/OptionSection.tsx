import { sortBySelectedThenByOrderOnMobile, mapToCode } from '@common/utils/product';
import { Component, CustomizedProduct, Section, SectionGroup, SectionComponent } from '@typings';
import React from 'react';
import { getVisibleComponentsForSection } from '@common/utils/product-visibility';
import OptionsList from '@components/customization/OptionsList';

interface Props {
    section: Section;
    componentsList: Component[];
    selectedComponents: Component[];
    onSelected: (sectionComponents: SectionComponent[]) => void;
    customizedProduct: CustomizedProduct;
    sectionGroup: SectionGroup;

}

interface State {
    components: Component[];
}

class OptionSection extends React.Component<Props, State> {
    public state: State = {
        components: getVisibleComponentsForSection(this.props.customizedProduct.product, this.props.section, this.props.selectedComponents).sort(sortBySelectedThenByOrderOnMobile(this.props.selectedComponents)),
    };

    public static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> {
        const { section, customizedProduct: { product }, selectedComponents } = nextProps;

        const newComponents = getVisibleComponentsForSection(product, section, selectedComponents).sort(sortBySelectedThenByOrderOnMobile(selectedComponents));

        if (newComponents.difference(prevState.components).length > 0) {
            return { components: newComponents };
        }

        return { };
    }

    public shouldComponentUpdate(nextProps: Props, nextState: State) {
        if (nextProps.section.componentTypeId !== this.props.section.componentTypeId) {
            return true;
        }

        if (nextProps.selectedComponents.difference(this.props.selectedComponents).length > 0
            || this.props.selectedComponents.difference(nextProps.selectedComponents).length > 0) {
            return true;
        }

        if (nextState.components.difference(this.state.components).length > 0) {
            return true;
        }

        return false;
    }

    public render() {
        const { section } = this.props;
        const { components } = this.state;

        return (
            <React.Fragment>
                <style jsx>{`
                    @import 'vars';

                    hr {
                        margin-bottom: 3*$space-base;

                        &:last-child {
                            display: none;
                        }
                    }
                `}</style>
                <OptionsList
                    key={section.title}
                    title={null}
                    {...this.props}
                    componentsList={components}
                />

                {/* <hr /> */}
            </React.Fragment>
        );
    }
}

export default OptionSection;
