import React from 'react';
import { Section, Component, CustomizedProduct, SectionGroup, SectionComponent } from 'typings/product';
import { filterByComponentType, sortBySelectedThenByOrderOnMobile } from '@common/utils/product';
import { ComponentType } from '@common/utils/component-type';
import OptionsList from '@components/customization/OptionsList';
import Accordion from '@components/base/Accordion';

interface Props {
    section: Section;
    sectionGroup: SectionGroup;
    componentsList: Component[];
    onSelected: (sectionComponents: SectionComponent[]) => void;
    customizedProduct: CustomizedProduct;
    initalCustomizedProduct: CustomizedProduct;
}

class ColorAndFabricSection extends React.PureComponent<Props> {

    public render() {
        const { componentsList, initalCustomizedProduct, sectionGroup } = this.props;
        const allColorAndFabric = componentsList.filter(filterByComponentType(ComponentType.ColorAndFabric)).sort(sortBySelectedThenByOrderOnMobile(initalCustomizedProduct.components));

        const recommended = allColorAndFabric.filter((x) => x.isRecommended);
        const groupedByFabric = allColorAndFabric.groupBy((x) => x.meta.materialTitle);

        const showFlatList = (
            (recommended.length === 0 && groupedByFabric.size === 1) ||
            (recommended.length === allColorAndFabric.length && groupedByFabric.size === 1)
        );

        const recommendedOpen = recommended.some((rC) => this.props.customizedProduct.components.includes(rC));

        return (
            <div className="ColorAndFabricSection">
                <style jsx>{`
                    @import 'vars';
                    .ColorAndFabricSection {

                        @include desktop {
                            padding-top: space(2);
                        }

                        h4 {
                            text-align: center;
                            @include mobile {
                                margin: space(2) 0 space(1);
                            }
                            @include desktop {
                                margin: space(0) 0 space(3);
                            }
                        }

                        :global(.Accordion):last-of-type {
                            border-bottom: 1px solid $color-grey90;
                        }

                        :global(.OptionsList) {
                            margin-bottom: 0;
                        }
                    }
                `}</style>

                {showFlatList &&
                    <React.Fragment>
                        {allColorAndFabric[0].meta.materialTitle && <h4>{allColorAndFabric[0].meta.materialTitle}</h4>}

                        <OptionsList
                            title={''}
                            sectionGroup={sectionGroup}
                            section={this.props.section}
                            componentsList={allColorAndFabric}
                            onSelected={this.props.onSelected}
                            customizedProduct={this.props.customizedProduct}
                            selectedComponents={this.props.customizedProduct.components}
                        />
                    </React.Fragment>
                }

                {!showFlatList && recommended.length > 0 &&
                    <Accordion title={'Recommended'} openOnLoad={recommendedOpen}>
                        <OptionsList
                            title={''}
                            sectionGroup={sectionGroup}
                            section={this.props.section}
                            componentsList={recommended}
                            onSelected={this.props.onSelected}
                            customizedProduct={this.props.customizedProduct}
                            selectedComponents={this.props.customizedProduct.components}
                        />
                    </Accordion>
                }

                { !showFlatList &&
                    Array.from(groupedByFabric.entries()).map(([title, c], i) => (
                        <Accordion title={title || 'Additional'} openOnLoad={!recommendedOpen && i === 0}>
                            <OptionsList
                                title={''}
                                sectionGroup={sectionGroup}
                                section={this.props.section}
                                componentsList={c}
                                onSelected={this.props.onSelected}
                                customizedProduct={this.props.customizedProduct}
                                selectedComponents={this.props.customizedProduct.components}
                            />
                        </Accordion>
                    ))
                }
            </div>
        );
    }
}

export default ColorAndFabricSection;
