import { COMPONENT_IMAGE_SIZES } from '@common/constants';
import { getComponentImageUrlsForRender } from '@common/utils/render-url-helper';
import CurrencyAmount from '@components/base/CurrencyAmount/CurrencyAmount';
import OptionCard, { TickColor } from '@components/product/OptionCard';
import classnames from 'classnames';
import React from 'react';
import { Component, CustomizedProduct } from 'typings';

const RadioIcon = require('@svg/i-radio.svg').default;

interface Props {
    customizedProduct: CustomizedProduct;
    component: Component;

    onSelected: (component: Component) => void;
    isSelected: boolean;
    tickColor?: TickColor.Light | TickColor.Dark;
}

class RadioSelection extends React.PureComponent<Props> {

    private onSelectedComponent = () => {
        this.props.onSelected(this.props.component);
    }

    private renderItem() {
        const { component, isSelected, onSelected } = this.props;
        return (
            <div key={component.code} className={classnames('component-radio', { selected: isSelected })} onClick={this.onSelectedComponent}>
                <style jsx>{`
                    @import 'vars';
                    .component-radio {
                        @include border-transition;

                        width: 100%;
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

                        span {
                          display: flex;
                          justify-content: flex-end;
                          margin-right: 6 * $space-base;
                        }

                        fill: $color-grey79;
                        &.selected {
                            fill: $color-black;
                        }
                    }
                `}</style>
                <p>
                  <RadioIcon alt="Radio" style={{ marginBottom: 2, verticalAlign: 'bottom', display: 'inline', width: 45, height: 16 }}/>
                  <label>{component.title}: {component.meta.deliveryTimeDescription}</label>
                </p>
                <span>
                    <React.Fragment>{' '}<CurrencyAmount value={component.price} /></React.Fragment>
                </span>
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
                    this.renderItem()
                }
            </React.Fragment>
        );
    }
}

export default RadioSelection;
