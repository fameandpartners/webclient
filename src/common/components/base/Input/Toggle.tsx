import React from 'react';
import classnames from 'classnames';

interface Props {
    leftTitle?: React.ReactNode;
    leftValue?: any;
    leftActiveColor?: string;
    leftInactiveColor?: string;

    rightTitle?: React.ReactNode;
    rightValue?: any;
    rightActiveColor?: string;
    rightInactiveColor?: string;

    initialValue?: boolean;

    onToggle: (value: any) => void;
}

interface State {
    value: boolean;
}

class Toggle extends React.Component<Props, State> {
    public state: State = {
        value: this.props.initialValue ? this.props.initialValue : false,
    };

    private onToggle() {
        const toggledValue = !this.state.value;
        this.setState({ value: toggledValue });

        // Right is on (true)
        // Left is off (false)
        const propValue = toggledValue ? (this.props.rightValue ? this.props.rightValue : toggledValue) : (this.props.leftValue ? this.props.leftValue : toggledValue);
        this.props.onToggle(propValue);
    }

    public render() {
        const { leftTitle, rightTitle } = this.props;

        return (
            <div className={'Toggle__Wrapper'}>
                <style jsx>{`
                    @import 'vars';

                    .Toggle__Wrapper {
                        display: flex;
                        align-items: center;

                        .ToggleTitle--left {
                            margin-right: $space-base;
                        }

                        .ToggleTitle--right {
                            margin-left: $space-base;
                        }
                    }

                    .Toggle {
                        background-color: $color-white;
                        border: 1px solid $color-grey90;
                        border-radius: 3*$space-base;
                        display: inline-block;
                        height: 4*$space-base;
                        opacity: 1;
                        position: relative;
                        user-select: none;
                        width: 8*$space-base;
                        transition: 0.2s;

                        .Toggle__Switch {
                            background-color: $color-grey90;
                            border-radius: 100%;
                            display: inline-block;
                            height: 3*$space-base;
                            position: absolute;
                            top: calc((#{4*$space-base} - #{3*$space-base} - 2px)/2);
                            width: 3*$space-base;
                            transition: 0.2s;

                            // max: outerWidth - switchWidth, min: same as top calc
                            left: ${this.state.value ? '34px' : '4px'};

                            &.active {
                                background-color: $color-black;
                            }
                        }
                    }
                `}</style>
                {leftTitle && <span className={'ToggleTitle--left'}>{leftTitle}</span>}
                <span className={'Toggle'} onClick={() => this.onToggle()}>
                    <span className={classnames('Toggle__Switch', { active: this.state.value })} />
                </span>
                {rightTitle && <span className={'ToggleTitle--right'}>{rightTitle}</span>}
            </div>
        );
    }
}

export default Toggle;
