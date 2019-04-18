import React from 'react';
import classnames from 'classnames';

export type BaseSectionGridConfiguration = 'One column' | 'Two column' | 'Three column' | 'Four column';
export type BaseSectionGridGutter = 'None' | 'Half' | 'Normal';
export type BaseSectionGridFlowOrder = 'Natural' | 'Reverse';
export type BaseSectionGridBackgroundColor = 'White' | 'Light Pink' | 'Grey';
interface Props {
    gridConfiguration: BaseSectionGridConfiguration;
    mobileGridConfiguration: BaseSectionGridConfiguration;
    gridGutter: BaseSectionGridGutter;
    mobileGridGutter: BaseSectionGridGutter;
    mobileFlowOrder?: BaseSectionGridFlowOrder;
    backgroundColor?: BaseSectionGridBackgroundColor;
    children: React.ReactNode;
}

const BaseSectionGrid: React.SFC<Props> = ({ gridConfiguration, mobileGridConfiguration, gridGutter, mobileGridGutter, mobileFlowOrder, backgroundColor, children }: Props) => {
    const gridClassName = classnames(
        'BaseSectionGrid',
        {
            'BaseSectionGrid--Grid-One': gridConfiguration === 'One column',
            'BaseSectionGrid--Grid-Two': gridConfiguration === 'Two column',
            'BaseSectionGrid--Grid-Three': gridConfiguration === 'Three column',
            'BaseSectionGrid--Grid-Four': gridConfiguration === 'Four column',

            'BaseSectionGrid--Gutter-None': gridGutter === 'None',
            'BaseSectionGrid--Gutter-Half': gridGutter === 'Half',
            'BaseSectionGrid--Gutter-Normal': !gridGutter || gridGutter === 'Normal',

            'BaseSectionGrid--MobileGrid-One': mobileGridConfiguration === 'One column',
            'BaseSectionGrid--MobileGrid-Two': mobileGridConfiguration === 'Two column',
            'BaseSectionGrid--MobileGrid-Three': mobileGridConfiguration === 'Three column',
            'BaseSectionGrid--MobileGrid-Four': mobileGridConfiguration === 'Four column',

            'BaseSectionGrid--MobileGutter-None': mobileGridGutter === 'None',
            'BaseSectionGrid--MobileGutter-Half': mobileGridGutter === 'Half',
            'BaseSectionGrid--MobileGutter-Normal': !mobileGridGutter || mobileGridGutter === 'Normal',

            'BaseSectionGrid--MobileFlowOrder-Reverse': mobileFlowOrder === 'Reverse',

            'BaseSectionGrid--BackgroundColor--White': backgroundColor === 'White',
            'BaseSectionGrid--BackgroundColor--Pink': backgroundColor === 'Light Pink',
            'BaseSectionGrid--BackgroundColor--Grey': backgroundColor === 'Grey',

        }
    );
    return (
        <div className={gridClassName}>
            <style jsx>{`
                @import 'vars';

                .BaseSectionGrid {
                    display: flex;
                    flex-wrap: wrap;


                    &--Grid-One {
                        > :global(*) {
                            @include grid-column(12)
                        }
                    }

                    &--Grid-Two {
                        > :global(*) {
                            @include grid-column(6)
                        }
                    }

                    &--Grid-Three {
                        > :global(*) {
                            @include grid-column(4)
                        }
                    }

                    &--Grid-Four {
                        > :global(*) {
                            @include grid-column(3)
                        }
                    }



                    &--Gutter-None {
                        margin: 0;

                        > :global(*) {
                            padding: 0;
                        }
                    }

                    &--Gutter-Half {
                        margin: 0 $gutter/-4 (-$gutter-vertically/2);

                        > :global(*) {
                            padding: 0 $gutter/4 ($gutter-vertically/2);
                        }
                    }

                    &--Gutter-Normal {
                        margin: 0 $gutter/-2 (-$gutter-vertically);

                        > :global(*) {
                            padding: 0 $gutter/2 ($gutter-vertically);
                        }
                    }

                    @include media('<tablet') {
                        &--Grid-Four {
                            > :global(*) {
                                @include grid-column(6)
                            }
                        }
                    }

                    &--BackgroundColor--White {
                        background-color: $color-white;
                    }

                    &--BackgroundColor--Pink {
                        background-color: $color-light-pink;
                    }

                    &--BackgroundColor--Grey {
                        background-color: $color-grey60;
                    }

                    @include mobile {
                        &--MobileGrid-One {
                            > :global(*) {
                                @include grid-column(12)
                            }
                        }

                        &--MobileGrid-Two {
                            > :global(*) {
                                @include grid-column(6)
                            }
                        }

                        &--MobileGrid-Three {
                            > :global(*) {
                                @include grid-column(4)
                            }
                        }

                        &--MobileGrid-Four {
                            > :global(*) {
                                @include grid-column(3)
                            }
                        }

                        &--MobileGutter-None {
                            margin: 0;

                            > :global(*) {
                                padding: 0;
                            }
                        }

                        &--MobileGutter-Half {
                            margin: 0 $gutter/-4 (-2*$space-base);

                            > :global(*) {
                                margin: 0 $gutter/4 (2*$space-base);
                            }
                        }

                        &--MobileGutter-Normal {
                            margin: 0 $gutter/-2 (-4*$space-base);

                            > :global(*) {
                                padding: 0 $gutter/2 (4*$space-base);
                            }
                        }

                        &--MobileFlowOrder-Reverse {
                            flex-direction: column-reverse;
                        }
                    }
                }
            `}</style>
            {children}
        </div>
    );
};

export default BaseSectionGrid;
