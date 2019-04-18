import React from 'react';
import classnames from 'classnames';

export type ItemSize = 'Normal - top' | 'Normal - bottom' | 'Normal - center' | 'Center'
    | '60% - center' | '60% - left' | '60% - right'| '60% - top' | '60% - bottom'
    | '50% - center' | '50% - left' | '50% - right'| '50% - top' | '50% - bottom' ;
export type ItemTextSize = 'Small' | 'Medium' | 'Large';
export type ItemTextAlign = 'Center' | 'Left' | 'Right';

interface Props {
    size: ItemSize;
    mobileSize: ItemSize;
    textSize: ItemTextSize;
    textAlignment: ItemTextAlign;
    className?: string;
    children: React.ReactNode;
}

const BaseItem: React.SFC<Props> = ({ size, mobileSize, textSize, textAlignment, className, children }: Props) => {
    const teaserClassName = classnames(
        className,
        'BaseItem',
        {
            'BaseItem--size-normal-top': size === 'Normal - top',
            'BaseItem--size-normal-bottom': size === 'Normal - bottom',
            'BaseItem--size-normal-center': size === 'Normal - center',
            'BaseItem--size-60-center': size === '60% - center',
            'BaseItem--size-60-right': size === '60% - right',
            'BaseItem--size-60-left': size === '60% - left',
            'BaseItem--size-60-top': size === '60% - top',
            'BaseItem--size-60-bottom': size === '60% - bottom',
            'BaseItem--size-50-center': size === '50% - center',
            'BaseItem--size-50-right': size === '50% - right',
            'BaseItem--size-50-left': size === '50% - left',
            'BaseItem--size-50-top': size === '50% - top',
            'BaseItem--size-50-bottom': size === '50% - bottom',
            'BaseItem--size-center': size === 'Center',

            'BaseItem--mobile-size-normal-top': mobileSize === 'Normal - top',
            'BaseItem--mobile-size-normal-bottom': mobileSize === 'Normal - bottom',
            'BaseItem--mobile-size-normal-center': mobileSize === 'Normal - center',
            'BaseItem--mobile-size-60-center': mobileSize === '60% - center',
            'BaseItem--mobile-size-60-right': mobileSize === '60% - right',
            'BaseItem--mobile-size-60-left': mobileSize === '60% - left',
            'BaseItem--mobile-size-60-top': mobileSize === '60% - top',
            'BaseItem--mobile-size-60-bottom': mobileSize === '60% - bottom',
            'BaseItem--mobile-size-50-center': mobileSize === '50% - center',
            'BaseItem--mobile-size-50-right': mobileSize === '50% - right',
            'BaseItem--mobile-size-50-left': mobileSize === '50% - left',
            'BaseItem--mobile-size-50-top': mobileSize === '50% - top',
            'BaseItem--mobile-size-50-bottom': mobileSize === '50% - bottom',
            'BaseItem--mobile-size-center': mobileSize === 'Center',

            'BaseItem--text-align-center': textAlignment === 'Center',
            'BaseItem--text-align-right': textAlignment === 'Right',
            'BaseItem--text-align-left': textAlignment === 'Left',

            'BaseItem--text-size-small': textSize === 'Small',
            'BaseItem--text-size-medium': textSize === 'Medium',
            'BaseItem--text-size-large': textSize === 'Large',
        }
    );
    return <article className={teaserClassName}>
        <style jsx>{`
            @import 'vars';

            .BaseItem {       
                display: flex;
                flex-direction: column;
                min-height: 100%;

                &--size-normal-top {
                    padding: 0;
                    justify-content: flex-start;
                }
                &--size-normal-bottom {
                    padding: 0;
                    justify-content: flex-end;
                }
                &--size-normal-center {
                    padding: 0;
                    justify-content: center;
                }
                &--size-60-center {
                    padding: 0 20%;
                    height: 100%;
                    justify-content: center;
                }
                &--size-60-right {
                    padding-left: 40%;
                    height: 100%;
                    justify-content: center;
                }
                &--size-60-left {
                    padding-right: 40%;
                    height: 100%;
                    justify-content: center;
                }
                &--size-60-top {
                    height: 100%;
                    justify-content: flex-start;
                    padding: 0% 20% 0 20%;
                }
                &--size-60-bottom {
                    height: 100%;
                    justify-content: flex-end;
                    padding: 0% 20% 0 20%;
                }
                &--size-50-center {
                    padding: 0 25%;
                    height: 100%;
                    justify-content: center;
                }
                &--size-50-right {
                    padding-left: 50%;
                    height: 100%;
                    justify-content: center;
                }
                &--size-50-left {
                    padding-right: 50%;
                    height: 100%;
                    justify-content: center;
                }
                &--size-50-top {
                    height: 100%;
                    justify-content: flex-start;
                    padding: 0% 25% 0 25%;
                }
                &--size-50-bottom {
                    height: 100%;
                    justify-content: flex-end;
                    padding: 0% 25% 0 25%;
                }
                &--size-center {
                    align-items: center;
                }

                &--text-align-center {
                    text-align: center;
                }
                &--text-align-right {
                    text-align: right;
                }
                &--text-align-left {
                    text-align: left;
                }

                &--text-size-small {
                    font-size: 14px;
                }
                &--text-size-medium {
                    font-size: 16px;
                }
                &--text-size-large {
                    font-size: 18px;
                }

                @include media("<tablet") {
                    &--mobile-size-normal-top {
                        padding: 0;
                        justify-content: flex-start;
                    }
                    &--mobile-size-normal-bottom {
                        padding: 0;
                        justify-content: flex-end;
                    }
                    &--mobile-size-normal-center {
                        padding: 0;
                        justify-content: center;
                    }
                    &--mobile-size-60-center {
                        padding: 0 20%;
                        height: 100%;
                        justify-content: center;
                    }
                    &--mobile-size-60-right {
                        padding-left: 40%;
                        height: 100%;
                        justify-content: center;
                    }
                    &--mobile-size-60-left {
                        padding-right: 40%;
                        height: 100%;
                        justify-content: center;
                    }
                    &--mobile-size-60-top {
                        height: 100%;
                        justify-content: flex-start;
                        padding: 0% 20% 0 20%;
                    }
                    &--mobile-size-60-bottom {
                        height: 100%;
                        justify-content: flex-end;
                        padding: 0% 20% 0 20%;
                    }

                    &--mobile-size-50-center {
                        padding: 0 25%;
                        height: 100%;
                        justify-content: center;
                    }
                    &--mobile-size-50-right {
                        padding-left: 50%;
                        height: 100%;
                        justify-content: center;
                    }
                    &--mobile-size-50-left {
                        padding-right: 50%;
                        height: 100%;
                        justify-content: center;
                    }
                    &--mobile-size-50-top {
                        height: 100%;
                        justify-content: flex-start;
                        padding: 0% 25% 0 25%;
                    }
                    &--mobile-size-50-bottom {
                        height: 100%;
                        justify-content: flex-end;
                        padding: 0% 25% 0 25%;
                    }

                    &--mobile-size-center {
                        align-items: center;
                    }
                }
            }
        `}</style>
            {children}
    </article>;
};

export default BaseItem;