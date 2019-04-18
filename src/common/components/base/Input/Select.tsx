import React from 'react';
import classnames from 'classnames';

const DownIcon = require('@svg/i-down.svg').default;

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: Array<{
        name: string,
        value: string,
    }>;
    noBorder?: boolean;
    transparent?: boolean;
    slim?: boolean;
    className?: string;
    isError?: boolean;
    selected?: string;
    alwaysShowPlaceholder?: boolean;
}

class Select extends React.PureComponent<SelectProps> {
    public render() {
        const {
            value,
            options,
            className,
            noBorder,
            transparent,
            slim,
            placeholder,
            isError,
            selected,
            onClick,
            alwaysShowPlaceholder,
            ...inputProps
        } = this.props;

        const classNames = classnames(
            'select-wrapper', 
            className, 
            {
                'select--no-border': noBorder, 
                'select--is-error': isError,
                'select--transparent': transparent,
                slim,
            });

        return (
            <div className={classNames} onClick={onClick as any}>
                <style jsx>{`
                    @import 'vars';

                    .select-wrapper {
                        border: 1px solid $color-grey90;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: $space-base 2*$space-base;
                        padding-right: 0;

                        &.slim {
                            padding: 0;
                        }

                        &:hover, &:active, &:focus {
                            border-color: $color-grey60;
                            outline: none;
                        }

                        &.select--is-error {
                            border-color: $color-red;
                        }
                        
                        &.select--no-border {
                            border-color: transparent;
                        }

                        &.select--transparent {
                            background-color: transparent;

                            .select {
                                background-color: transparent;
                            }
                        }
                    }

                    .select {
                        background-color: $color-white;
                        border-radius: 0;
                        appearance: none;
                        border: none;
                        width: 100%;
                        @include text-style-form-label;

                        &::-ms-expand {
                            display: none;
                        }

                        .placeholder {
                            @include text-style-form-placeholder;
                        }
                    }
                `}</style>
                <select className={'select'} value={selected || ''} {...inputProps}>
                    {(!selected || alwaysShowPlaceholder) && <option className={'placeholder'} value="">{placeholder}</option>}
                    {options.map((o) => <option key={o.name} value={o.value}>{o.name}</option>)}
                </select>
                <DownIcon
                    style={{
                        width: 12,
                        minWidth: 12,
                        height: 12,
                        minHeight: 12,
                        // height: '100%',
                        margin: '0 16px',
                    }} 
                />
            </div>
        );
    }
}

export default Select;
