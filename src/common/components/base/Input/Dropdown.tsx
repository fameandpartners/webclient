import React, { SyntheticEvent, FocusEvent, MouseEvent } from 'react';
import Button from '@components/base/Button/Button';
import Select from '@components/base/Input/Select';

interface Option {
    name: string;
    value: string;
    disabled?: boolean;
}

interface OptionGroup {
    title: string;
    value: any;
    options: Option[];
}

interface Props {
    optionGroups: OptionGroup[];
    onSelect: (item: string) => void;
    onSelectOptionGroup?: (item: any) => void;
    selected: string | null;
    defaultOptionGroup?: OptionGroup;
    placeholder?: string;
    alwaysShowPlaceholder?: boolean;
    isError?: boolean;
    autoFocus?: boolean;
    defaultSelection?: any;
}

interface State {
    selectedOptionGroup: OptionGroup | null; 
    isOpen: boolean;
}

// TODO: Fix Dropdown in IE
class Dropdown extends React.Component<Props, State> {
    public state = {
        selectedOptionGroup: this.props.defaultOptionGroup || null,
        isOpen: this.props.autoFocus || false,
    };

    private onSelectOptionGroup(e: SyntheticEvent<any>, optionGroup: OptionGroup) {
        if (this.props.onSelectOptionGroup) {
            this.props.onSelectOptionGroup(optionGroup.value);
        }
        this.setState({selectedOptionGroup: optionGroup});
    }

    private onSelectOption(e: SyntheticEvent<any>, value: string) {
        this.props.onSelect(value);
        this.setState({ isOpen: false });
    }

    private onBlurCapture(e: FocusEvent<any>) {
        let relatedTarget = e.relatedTarget;
        if (!relatedTarget) {
            relatedTarget = document.activeElement;
        }

        const externalElement = !(e.currentTarget as HTMLElement).contains(relatedTarget as HTMLElement);
        if (externalElement) {
            this.setState({ isOpen: false });
        }
    }

    private onClick(e: MouseEvent<any>) {
        e.preventDefault();
        this.setState((state) => ({ isOpen: !state.isOpen }));
    }

    private renderButton(name: string, value: string, disabled?: boolean) {
        return (
            <Button
                key={name}
                fullwidth
                noBorder
                formSelection={value === this.props.selected}
                onClick={(e) => this.onSelectOption(e, value)}
                normalCase
                disabled={disabled}
            >
                {name}
            </Button>);

    }

    public render() {
        const optionGroup = this.state.selectedOptionGroup || this.props.optionGroups[0];
        const showOpenGroupSelection = this.props.optionGroups.length > 1;

        return <div
            className="dropdown-container"
            tabIndex={0}
            onBlurCapture={(e) => this.onBlurCapture(e)}
        >
            <style jsx>{`
                @import 'vars';

                .dropdown-container {
                    position: ${this.state.isOpen ? 'relative' : 'inherit'};
                    
                    :global(select) {
                        pointer-events: none;
                    }

                    &:hover, &:focus {
                        .styled-dropdown,
                        :global(.select-wrapper) {
                            border-color: $color-black;
                        }
                    }
                }
                
                .styled-dropdown {
                    position: absolute;
                    z-index: 1;
                    height: 250px;
                    overflow: scroll;
                    width: 100%;

                    box-shadow: 0 $space-base 12px -10px rgba($color-white, 0.08);
                    background-color: $color-white;
                    border: solid 1px $color-grey90;
                    border-top: none;
                }

                .option-group-selection {
                    display: flex;
                    width: 100%;
                    margin-bottom: $space-base*2;
                    text-align: center;

                    :global(.button) {
                        width: 50%;
                    }
                }
                .options {
                    display: flex;
                    flex-wrap: wrap;

                    :global(.button) {
                        @include text-style-body;
                        background: $color-white;
                        text-align:left;
                        justify-content:flex-start;

                        width: calc(100%/3 - 2*$space-base);

                        border-bottom: 1px solid $color-grey90;

                        &:not(.Button--form-selection) {
                            color: $color-grey60;
                        }

                        &:hover,
                        &:active,
                        &:focus {
                            border-bottom: 1px solid $color-grey90;
                        }
                    }
                }
            `}</style>
            <Select
                placeholder={this.props.placeholder}
                alwaysShowPlaceholder={this.props.alwaysShowPlaceholder}
                options={optionGroup.options}
                isError={this.props.isError}
                selected={this.props.selected || ''}
                defaultValue={this.props.defaultSelection}
                onChange={() => null}
                onClick={(e) => this.onClick(e)}
            />
            { this.state.isOpen && 
                <div className="styled-dropdown">
                    { showOpenGroupSelection && 
                        <div className="option-group-selection">
                            {this.props.optionGroups.map((og) => <Button 
                                key={og.title}
                                slim
                                fullwidth
                                secondary={og.value !== optionGroup.value}
                                normalCase
                                onClick={(e) => this.onSelectOptionGroup(e, og)}
                            >
                                {og.title}
                            </Button>)}
                        </div>
                    }

                    <div className="options">
                        {this.props.alwaysShowPlaceholder && this.renderButton(this.props.placeholder || '', '', false)}
                        {optionGroup.options.map((option) => this.renderButton(option.name, option.value, option.disabled))}
                    </div>
                </div>
            }
        </div>;
    }
}

export default Dropdown;