import React from 'react';
import classnames from 'classnames';
import FallbackImage from '@components/base/FallbackImage';
import { ProductMedia } from 'typings/product';
import AspectRatio from '@components/base/AspectRatio';

export enum TickColor {
    Light = 'light',
    Dark = 'dark',
}

interface Props {
    onClick?: () => void;
    
    title: React.ReactNode;
    subtitle?: React.ReactNode;

    image: ProductMedia|null;
    color: string|null;
    sizes?: string;

    isSelected: boolean;
    tickColor?: TickColor.Light | TickColor.Dark;
}

class OptionCard extends React.PureComponent<Props> {
    public static defaultProps: Partial<Props> = {
        tickColor: TickColor.Dark,
    };

    public render() {
        const { onClick, isSelected, title, subtitle, image, sizes, color } = this.props;
    
        return (
            <div className={'option-card'} onClick={onClick}>
                <style jsx>{`
                    @import 'vars';

                    .option-card {
                        position: relative;

                        &.selected {
                            border: 1px solid $color-black;
                        }

                        :global(.FallbackImage) {
                            width: 100%;
                            background: $background-image-color;

                            :global(img) {
                                object-fit: cover;
                            }
                        }
                    }

                    .image {
                        display: flex;
                        flex-wrap: wrap;
                        cursor: pointer;
                        overflow: hidden;
                        
                        @include border-transition;
                        
                        border: 1px solid $color-grey90;
                        
                        &.selected {
                            padding: $space-base/2;
                            margin: -$space-base/2;
                            border: 1px solid $color-black;
                        }
                    }

                    span {
                        @include text-style-form-option;
                    }

                    .content {
                        text-align: center;
                        padding: $space-base / 2;
                        
                        @include media('>tablet') {
                            padding: $space-base;
                        }

                        @include mobile {
                            margin-top:$space-base/2;
                        }

                        .content-title {
                            display: flex;
                            justify-content: center;
                            align-items: baseline;
    
                            > span {
                                @include text-style-navigation-item;
                                line-height:2*$space-base;
                            }
                        }
                        
                        .content-subtitle {
                            @include text-style-card-subtitle;
                        }

                        flex-grow: 1;
                        align-self: flex-end;
                    }
                `}</style>
                    <div className={classnames('image', { selected: isSelected })}>
                        {image && 
                            <FallbackImage 
                                image={image}
                                aspectRatio={1}
                                sizes={sizes || '(max-width: 568px) 50vw, 11vw'}
                            />}

                        {!image && color && <AspectRatio ratio={1}><div style={{backgroundColor: color}} /></AspectRatio>}
                    </div>
                    <div className="content">
                        <div className="content-title">
                            <span>{title}</span>
                        </div>

                        <span className="content-subtitle">
                            {subtitle}
                        </span>
                        
                    </div>
            </div>
        );
    }
}

export default OptionCard;
