import { COMPONENT_IMAGE_SIZES } from '@common/constants';
import { getComponentImageUrlsForRender } from '@common/utils/render-url-helper';
import CurrencyAmount from '@components/base/CurrencyAmount/CurrencyAmount';
import OptionCard, { TickColor } from '@components/product/OptionCard';
import classnames from 'classnames';
import React from 'react';
import { Component, User, CustomizedProduct } from 'typings';

const Tick = require('@svg/i-tick.svg').default;

interface Props {
    customizedProduct: CustomizedProduct;
    component: Component;

    onSelected: (component: Component) => void;
    isSelected: boolean;
    tickColor?: TickColor.Light | TickColor.Dark;

    user: User | null;
    showLegacyCustomization: boolean;
}

class OptionSelection extends React.PureComponent<Props> {

    private onSelectedComponent = () => {
        this.props.onSelected(this.props.component);
    }

    private renderLegacyCustomization() {
        const { component, isSelected, onSelected } = this.props;
        return (
            <div key={component.code} className={classnames('component-wrapper', { selected: isSelected })} onClick={this.onSelectedComponent}>
                <style jsx>{`
                    @import 'vars';
                    .component-wrapper {
                        @include border-transition;

                        width: 100%;
                        border: 1px solid $color-grey79;
                        padding: 2 * $space-base;
                        margin-bottom: $space-base;
                        cursor: pointer;

                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        p {
                            margin-bottom: 0;
                            @include text-style-form-option;
                        }

                        &.selected {
                            border: 1px solid $color-black;
                        }
                    }
                `}</style>
                <p>
                    {component.title}
                    {component.price > 0 &&
                        <React.Fragment>{' '}<CurrencyAmount value={component.price} /></React.Fragment>
                    }
                </p>
                {
                    isSelected &&
                    <Tick
                        style={{
                            height: 9,
                            width: 8,
                        }}
                    />
                }
            </div>
        );
    }

    private getImage() {
        const { component, customizedProduct } = this.props;

        return getComponentImageUrlsForRender(component, customizedProduct, COMPONENT_IMAGE_SIZES);
    }

    private renderComponent() {
        const { component, isSelected, tickColor, user } = this.props;

        const image = this.getImage();

        const isAdmin = user && user.isAdmin;
        const subtitle = (
                <React.Fragment>
                    {component.price > 0 && <CurrencyAmount hideSign value={component.price} />}
                    {isAdmin && <p>{component.code}</p>}
                </React.Fragment>
        );

        return (
            <div className={'component-container'}>
                <style jsx>{`
                    @import 'vars';


                    .component-container {
                        padding: $space-base;
                        flex-shrink: 0;

                        @include media('<=tabletLarge') {
                            width: 33.3%;

                            :global(.OptionsList__List--MobileVerticalScroll) & {
                                width: 30%;
                            }
                        }

                        @include media('>tabletLarge', '<=desktopSmall') {
                            width: 150px;
                        }

                        @include desktop {
                            width: 33.3%;
                        }
                    }
                `}</style>
                <OptionCard
                    key={component.code}
                    title={component.meta.colorTitle || component.title}
                    subtitle={subtitle}
                    image={image}
                    color={component.meta.hex || null}
                    isSelected={isSelected}
                    tickColor={tickColor}
                    onClick={this.onSelectedComponent}
                />
            </div>
        );
    }

    public render() {
        const { component, customizedProduct } = this.props;

        return (
            <React.Fragment>
                <style jsx>{`
                    @import 'vars';
                    :global(.tick-light) {
                        fill: $color-white;
                        color: $color-white;
                    }
                `}</style>
                {
                    this.props.showLegacyCustomization
                        ? this.renderLegacyCustomization()
                        : this.renderComponent()
                }
            </React.Fragment>
        );
    }
}

export default OptionSelection;
