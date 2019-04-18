import React from 'react';
import classnames from 'classnames';
import FallbackImage from '@components/base/FallbackImage';
import { ProductMedia } from 'typings/product';

interface Props {
    onClick: () => void;
    
    title: string;
    subtitle?: string;

    image: ProductMedia;
    sizes?: string;

    isSelected: boolean;
}

class DressFinderCard extends React.Component<Props> {

    public render() {
        const { onClick, isSelected, title, subtitle, image, sizes } = this.props;
    
        return (
            <div className={classnames('dress-finder-card')} onClick={onClick}>
                <style jsx>{`
                    @import 'vars';

                    $selected-padding: 2px;

                    .dress-finder-card {
                        cursor: pointer;
                    }

                    .component-outer {
                        height: 100%;
                    }

                    .component-inner {
                        @include border-transition;
                        border: 1px solid transparent;

                        &.selected {
                            border: 1px solid $color-black;
                            margin: -$selected-padding;
                            padding: $selected-padding;
                        }
                    }

                    .content {
                        padding: 2*$space-base;
                        text-align: center;

                        @include mobile {
                            padding: $space-base 0 0;
                        }
                    }

                    .content-title {
                        @include text-style-title;
                        margin: 0;

                        @include mobile {
                            line-height: 2*$space-base;
                        }
                    }

                    .content-subtitle {
                        @include text-style-card-subtitle;
                        margin: $space-base 0 0;
                    }
                `}</style>
                <div className={classnames('component-outer')}>
                    
                    <div className={classnames('component-inner', { selected: isSelected })}>
                        <FallbackImage
                            showBackground
                            image={image}
                            aspectRatio={1}
                            sizes={sizes || '(max-width: 1024px) 50vw, 20vw'}
                        />
                    </div>

                    <div className="content">
                        {title && <p className="content-title">
                            {title}
                        </p>}

                        {subtitle && <p className="content-subtitle">
                            {subtitle}
                        </p>}
                    </div>

                </div>
            </div>
        );
    }
}

export default DressFinderCard;
