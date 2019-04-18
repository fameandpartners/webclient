import React from 'react';
import classnames from 'classnames';

interface Props {
    active: boolean;
    title: string;
    onClick?: () => void;

    borderless?: boolean;
}

class Pill extends React.PureComponent<Props> {
    public render() {
        const { active, borderless, title, onClick } = this.props;

        return (
            <React.Fragment>
                <style jsx>{`
                    @import 'vars';

                    .Pill {
                        border: 1px solid $color-grey79;
                        cursor: pointer;
                        user-select: none;
                        

                        color: $color-grey79;

                        &:nth-child(n+2) {
                            border-left-color: transparent;
                        }

                        &.active {
                            color: $color-black;
                        }

                        &.borderless {
                            border: none;
                            line-height: 3*$space-base;
                            margin-bottom:3*$space-base;

                            @include mobile {
                                margin-bottom:$space-base;
                            }

                            &:last-child{
                                margin-bottom:0;
                            }
                        }
                    }
                `}</style>
                <div className={classnames('Pill', { active, borderless })} onClick={onClick}>
                    {title}
                </div>
            </React.Fragment>
        );
    }
}

export default Pill;
