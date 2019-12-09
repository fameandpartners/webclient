import { COMPONENT_IMAGE_SIZES } from '@common/constants';
import { getComponentImageUrlsForRender } from '@common/utils/render-url-helper';
import CurrencyAmount from '@components/base/CurrencyAmount/CurrencyAmount';
import OptionCard, { TickColor } from '@components/product/OptionCard';
import classnames from 'classnames';
import React from 'react';
import { Component, CustomizedProduct } from 'typings';

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

                        &.selected {
                            border: 1px solid $color-black;
                        }
                    }
                `}</style>
                <p>
                  <input type="radio" id={component.code}
                    name="radio_com" value={component.code}></input>
                  <label htmlFor={component.code}>{component.title}: {component.description}</label>
                </p>
                <span>
                    {component.display_price}
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
