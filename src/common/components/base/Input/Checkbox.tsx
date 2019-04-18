import React, { ChangeEvent } from 'react';
import classnames from 'classnames';
import { isExtremeLightLuminance, isDarkLuminance } from '@common/utils/color';
const TickIcon = require('@svg/i-tick.svg').default;

interface Props extends React.InputHTMLAttributes<any> {
    label?: string;
    disabled?: boolean;
    isCircle?: boolean;
    fillColor?: string;
    fillImage?: string;
}

class Checkbox extends React.PureComponent<Props> {
    public render() {
        const { label, disabled, checked } = this.props;
        const { isCircle, fillColor, fillImage, ...passThroughProps } = this.props;

        const isActive = !disabled || checked;

        return (
            <div 
                className={classnames('Checkbox', {
                    'Checkbox--disabled': disabled,
                    'Checkbox--checked': checked,
                    'Checkbox--circle': isCircle,
                    'Checkbox--light-background' : fillColor ? isExtremeLightLuminance(fillColor) : true,
                    'Checkbox--dark-background' : fillColor ? isDarkLuminance(fillColor) : false
                })}
                onClick={isActive ? this.props.onChange : () => null}
            >
                <style jsx>{`
                    @import "vars";

                    .Checkbox {
                        position:relative;
                        display:inline-block;
                        padding-left: 3*$space-base;
                        line-height:16px;

                        &:hover, &:focus, &:active {
                            .styled {
                                border-color: $color-grey60;
                            }
                        }

                        input {
                            display: none;
                        }
    
                        .styled {
                            position:absolute;
                            left:0;
                            width: 2*$space-base;
                            height: 2*$space-base;
                            border: 1px solid $color-grey90;
                            color: $color-black;
                            cursor: pointer;
                            background-size: contain;
    
                            &:hover, &:focus, &:active {
                                border-color: $color-grey60;
                            }

                            @include mobile {
                                width: 3*$space-base;
                                height: 3*$space-base;
                            }
                        }
    
                        label {
                            cursor: pointer;
                            min-width:50%;
                            line-height: 2*$space-base;

                            @include mobile {
                                line-height: 3*$space-base;
                            }
                        }

                        @include mobile {
                            display:block;
                            padding: $space-base 5*$space-base 0;
                        }

                        &--circle {
                            opacity: 0.8;

                            .styled {
                                border-radius: 50%;
                                border-color: transparent;
                            }

                            &.Checkbox--light-background{
                                .styled{
                                    border-color: $color-grey79;
                                }
                            }
                            &.Checkbox--dark-background{
                                .styled{
                                    border-color: $color-grey20;
                                }
                            }

                            &.Checkbox--checked {
                                opacity: 1;
                                font-weight: 500;

                                .styled {
                                    border: 1px solid $color-black;
                                }
                            }

                            &:hover, &:active {
                                opacity:1;
                                border-color: $color-grey47;
                            }
                        }

                        &.Checkbox--checked {
                            .styled {
                                background-color: $color-black;
                            }
                        }

                        &.Checkbox--disabled {
                            opacity: 0.6;

                            label, .styled {
                                cursor: not-allowed;
                            }

                            &:hover, &:focus, &:active {
                                opacity: 0.6;
                                .styled {
                                    border-color: $color-grey90;
                                }

                                &.Checkbox--circle {
                                    .styled{
                                        border-color: transparent;
                                    }
                                }

                                &.Checkbox--light-background{
                                    .styled{
                                        border-color: $color-grey79;
                                    }
                                }
                                &.Checkbox--dark-background{
                                    .styled{
                                        border-color: $color-grey20;
                                    }
                                }
                            }
                        }
                    }

                    
                `}</style>
                <input type="checkbox" {...passThroughProps}/>
                <span className="styled" style={{ backgroundColor: fillColor, backgroundImage: fillImage && `url(${fillImage})` }} />
                {label ? <label>{label}</label> : <label>&nbsp;</label>}
            </div>
        );
    }
}

export default Checkbox;