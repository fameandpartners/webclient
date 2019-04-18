import React from 'react';
import classnames from 'classnames';
import Button, { ButtonProps } from '@components/base/Button/Button';

interface Props extends ButtonProps {
    icon?: React.ReactNode;
    white?: boolean;
}

class IconButton extends React.PureComponent<Props> {
    public render() {
        const { icon, white, ...buttonProps } = this.props;

        return (
            <div className={classnames('IconButton', { 'IconButton--white': white })}>
                <style jsx>{`
                    @import 'vars';
                    .IconButton {
                        position: relative;

                        :global(svg) {
                            width: 2*$space-base;
                            height: 2*$space-base;

                            position: absolute;
                            top: 2*$space-base;
                            left: 2*$space-base;

                            display: inline-block;
                        }

                        &--white {
                            color: $color-white;

                            :global(svg) {
                                color: $color-white;
                            }
                        }
                    }
                `}</style>
                {icon && icon}

                <Button
                    {...buttonProps}
                    inline
                />
            </div>
        );
    }
}

export default IconButton;
