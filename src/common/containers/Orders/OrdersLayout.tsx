import React from 'react';
import classnames from 'classnames';
import BaseLayout from '@containers/BaseLayout';
import { Desktop } from '@components/base/MediaQuerySSR';

interface Props {
    heading: React.ReactNode;

    noBorder?: boolean;
}

class OrdersLayout extends React.PureComponent<Props> {
    public render() {
        const { heading, children } = this.props;

        return (
            <BaseLayout>
                <style jsx>{`
                    @import 'vars';

                    @mixin orders-column {
                        @include grid-column(6);
                        padding: space(3) space(5);

                        flex-grow: 1;

                        @include mobile {
                            @include grid-column(12);
                            padding: space(3) space(3);
                        }
                    }

                    .OrdersLayout {
                        flex-direction: column;
                        align-items: center;
                        margin: space(10) 0;

                        @include mobile {
                            margin: space(4) 0;
                        }

                        &--no-border {
                            :global(.OrdersLayout--container) {
                                border: none;
                            }
                        }

                        :global(&--container) {
                            @include grid;
                            padding: 0;

                            margin: space(10) auto;
                            width: 90%;

                            border: 1px solid $color-grey90;

                            @include mobile {
                                margin: space(4) auto 0;
                            }
                        }

                        :global(&--left) {
                            border-right: 1px solid $color-grey90;
                            @include orders-column();

                            @include mobile {
                                border-right: none;
                            }
                        }

                        :global(&--right) {
                            @include orders-column();
                        }

                        :global(&--full) {
                            @include grid-column(12);
                            padding: 0;
                        }

                        > :global(h1) {
                            text-align: center;
                        }

                        > :global(h2) {
                            text-align: center;
                            padding: 0 0 space(10);

                            @include mobile {
                                padding: 0 0 space(4);
                            }
                        }

                        :global(p), :global(li) {
                            font-size: 16px;
                        }

                        :global(svg) {
                            width: 32px;
                            height: 32px;
                            min-width: 32px;
                            min-height: 32px;
                        }

                        :global(.positive) {
                            color: $color-green;
                        }

                        :global(.neutral) {
                            color: $color-orange;
                        }

                        :global(.negative) {
                            color: $color-red;
                        }
                    }

                `}</style>

                <div
                    className={classnames('OrdersLayout', {
                        'OrdersLayout--no-border': this.props.noBorder,
                    })}
                >
                    {heading}

                    {children}
                </div>
            </BaseLayout>
        );
    }
}

export default OrdersLayout;
