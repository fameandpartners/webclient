import React from 'react';
import { TickColor } from '@components/product/OptionCard';
import OptionSelection from '@components/customization/OptionSelection';
import { ComponentType } from '@common/utils/component-type';
import { Component, Section, SectionGroup, CustomizedProduct, SectionComponent } from 'typings';
import SlideInOutTransition from '@components/animation/SlideInOutTransition';
import { UserContext } from '@common/context/UserContext';
import { Desktop } from '@components/base/MediaQuerySSR';
import classnames from 'classnames';
import { PreviewType } from '@common/utils/preview-type';
import { RenderPositionId } from '@common/utils/render-position-id';
import RadioSelection from '@components/customization/RadioSelection';

interface Props {
    title: React.ReactNode;
    subtitle?: React.ReactNode;

    section: Section;
    sectionGroup: SectionGroup;
    componentsList: Component[];
    selectedComponents: Component[];
    onSelected: (sectionComponents: SectionComponent[]) => void;
    customizedProduct: CustomizedProduct;

    isSelected?: (c: Component) => boolean;
}

class OptionsList extends React.PureComponent<Props> {

    private isSelected(c: Component) {
        const { selectedComponents, isSelected } = this.props;

        if (isSelected) {
            return isSelected(c);
        }

        return selectedComponents.includes(c);
    }
    public render() {
        const { title, sectionGroup, componentsList, section, onSelected, customizedProduct, selectedComponents } = this.props;

        // This allow us to determine if it is a dress from spree (which uses cads) or is part of the resorts collection (which also uses cads but in the new style).
        const isCadStyle = sectionGroup.renderPositionId === RenderPositionId.CadNone || componentsList.some((x) => x.componentTypeCategory === ComponentType.LegacyCustomization)
        const isRadioStyle = componentsList.some((x) => x.componentTypeCategory === ComponentType.Making);

        return (
            <div className="OptionsList">
                <style jsx>{`
                    @import 'vars';

                    .OptionsList__List {
                        display: flex;
                        flex-wrap: wrap;

                        @include mobile {
                            flex-direction: ${isCadStyle ? 'column' : 'row'};
                        }

                        &--MobileVerticalScroll {
                            @include mobile {
                                flex-wrap: nowrap;
                                overflow-x: visible;
                                overflow-y: hidden;
                                scroll-behavior: smooth;
                                margin-bottom: 0;
                            }
                        }
                    }

                    h4 {
                        text-align: center;
                    }
                `}</style>
                <Desktop>{title && <h4>{title}</h4>}</Desktop>
                <SlideInOutTransition
                    slideInFrom="bottom"
                    animateIn={false}
                    isVisible={true}
                    positiveValue={10}
                >
                    {(style) => (
                        <div className={classnames('OptionsList__List', {'OptionsList__List--MobileVerticalScroll': sectionGroup.previewType === PreviewType.Render})}  key={section.title} style={{...style}}>
                            {
                                componentsList.notNullOrUndefined().map((c) => (
                                    <UserContext.Consumer key={c.code}>
                                        {(user) => (
                                          isRadioStyle ?
                                            <RadioSelection
                                              component={c}
                                              isSelected={this.isSelected(c)}
                                              onSelected={() => onSelected([{ section, components: [c]}])}
                                              tickColor={TickColor.Dark}
                                              customizedProduct={customizedProduct}
                                            />
                                            :
                                            <OptionSelection
                                                component={c}
                                                isSelected={this.isSelected(c)}
                                                onSelected={() => onSelected([{ section, components: [c]}])}
                                                tickColor={TickColor.Dark}
                                                customizedProduct={customizedProduct}
                                                user={user}
                                                showLegacyCustomization={isCadStyle}
                                            />
                                        )}
                                    </UserContext.Consumer>
                                ))
                            }
                        </div>
                    )}
                </SlideInOutTransition>
            </div>
        );
    }
}

export default OptionsList;
