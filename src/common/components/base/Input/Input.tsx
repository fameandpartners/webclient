import React, { PureComponent, Ref } from 'react';
import classnames from 'classnames';
import InputWrapper from '@components/base/Input/InputWrapper';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
    inlineError?: React.ReactNode;
    inlineMeta?: React.ReactNode;
    label?: string;
    noBorder?: boolean;
    onlyBorderBottom?: boolean;
    slim?: boolean;
    transparent?: boolean;
    wrapperClassName?: string;
    white?: boolean;
  }

class Input extends PureComponent<InputProps> {
    private root: HTMLInputElement | null;

    constructor(props: InputProps) {
        super(props);
        this.root = null;
    }

    public focus() {
        if (this.root) {
            this.root.focus();
        }
    }

    public select() {
        if (this.root) {
            this.root.select();
        }
    }

    public render() {
        const {
            noBorder,
            onlyBorderBottom,
            slim,
            error,
            inlineError,
            inlineMeta,
            label,
            className,
            wrapperClassName,
            transparent,
            white,
            ...inputProps
        } = this.props;

        const {
            id
        } = this.props;

        return (
            <React.Fragment>
                <style jsx>{`
                    @import "vars";
                    input {
                        width: 100%;
                        height: 5*$space-base;
                        padding: 9px 16px 9px;
                        line-height: 16px;
                        font-size: 16px;
                        border: 1px solid $color-grey90;
                        font-family: inherit;

                        // Safari Fixes
                        border-radius: 0;
                        -webkit-appearance: none;

                        &:hover, &:active, &:focus {
                            border-color: $color-grey60;
                            outline: none;
                        }

                        &::placeholder {
                            @include text-style-form-placeholder;
                        }
                    }
                    

                    .input--error {
                        border-color: $color-red;
                    }

                    .input--no-border {
                        border-color: transparent;
                        &:hover, &:active, &:focus {
                            border-color: transparent;
                        }
                    }

                    .input--only-border-bottom {
                        border-left: none;
                        border-right: none;
                        border-top: none;
                    }

                    .input--slim {
                        padding: 13px 16px;
                        font-size: 14px;
                        line-height: 14px;
                    }

                    .input--transparent {
                        border-color: $color-black;
                        background-color: transparent;
                    }

                    .input--white {
                        color: $color-white;
                        border-color: $color-white;

                        &:hover, &:active, &:focus {
                            border-color: $color-white;
                        }

                        &::placeholder {
                            color: $color-white;
                        }
                    }                    
                `}</style>

                <InputWrapper
                    inlineError={inlineError}
                    inlineMeta={inlineMeta}
                    error={error}
                    label={label}
                    id={id}
                    className={wrapperClassName}
                >

                    <input
                        className={classnames(
                            className,
                            {
                            'input--error': error,
                            'input--slim': slim,
                            'input--no-border': noBorder,
                            'input--only-border-bottom': onlyBorderBottom,
                            'input--transparent': transparent,
                            'input--white': white,
                            },
                        )}
                        {...inputProps}
                    />
                </InputWrapper>
        </React.Fragment>);
    }
}

export default Input;
