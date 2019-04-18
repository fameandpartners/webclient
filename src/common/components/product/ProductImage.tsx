import React from 'react';
import classnames from 'classnames';
import PillGroup from '@components/base/Pill/PillGroup';
import Pill from '@components/base/Pill/Pill';
import { OrientationType } from '@common/utils/orientation-type';
import FallbackImage from '@components/base/FallbackImage';
import { ProductMedia } from 'typings/product';
import { ObjectFitProperty } from 'csstype';

interface Props {
    onClick?: () => void;
    showOrientation?: (orientation: OrientationType, trackEvent: boolean) => void;

    className?: string;
    isRender?: boolean;
    orientation?: OrientationType;

    image: ProductMedia;

    objectFit?: ObjectFitProperty;
}

class ProductImage extends React.Component<Props> {

    public shouldComponentUpdate(nextProps: Props) {
        if (nextProps.orientation !== this.props.orientation) {
            return true;
        }

        if (nextProps.image.src.difference(this.props.image.src).length > 0) {
            return true;
        }

        return false;
    }
    public render() {
        const { className, onClick, showOrientation, isRender, orientation, image } = this.props;

        // Styled JSX bugs out when switching/re-rendering.
        return (
            <div className={classnames(className, 'ProductImage')}>
                <style jsx>{`
                    @import 'vars';
                    $pill-width: 70px;

                    .ProductImage {
                        position: relative;

                        @include desktop {
                            height: calc(100vh - #{$navbar-height});
                            
                            :global(.FallbackImage) {
                                height: 100%;
                            }
                        }

                        @include mobile {
                            :global(.FallbackImage) {
                                height: calc(65vh - #{$navbar-height + $button-height});
                                transition: height 400ms ease-out;

                                :global(.PDP__Section--Information--customizing) & {
                                    height: calc(100vh - 33vw - 290px);
                                }
                            }
                        }

                        @include media('>tabletLarge', '<=desktopSmall') {
                            :global(.FallbackImage) {
                                :global(.PDP__Section--Information--customizing) & {
                                        height: calc(100vh - 150px - 290px);
                                }
                            }
                        }

                        :global(.PillGroup) {
                            position: absolute;
                            width: $pill-width;
                            left: space(4);
                            text-align: left;
                            top: 50%;
                            z-index: $z-index-below-header;
                            transform: translate(0%, -50%);

                            @include media('<tabletLarge') {
                                padding: 0 $page-padding-mobile;
                                left: 0;
                            }
                        }
                    }
                `}</style>

                <FallbackImage
                    image={image}
                    objectFit={this.props.objectFit || (isRender ? 'contain' : 'cover')}
                    objectPosition={'center'}
                    style={{
                        cursor: onClick ? 'pointer' : 'initial',
                    }}
                    aspectRatio={null}
                    onClick={onClick}
                />

                {isRender && (
                    <PillGroup vertical={true}>
                        <Pill
                            active={orientation === OrientationType.Front}
                            title={'Front'}
                            onClick={() => showOrientation && showOrientation(OrientationType.Front, true)}
                            borderless={true}
                        />
                        <Pill
                            active={orientation === OrientationType.Back}
                            title={'Back'}
                            onClick={() => showOrientation && showOrientation(OrientationType.Back, true)}
                            borderless={true}
                        />
                    </PillGroup>
                )}
            </div>
        );
    }
}

export default ProductImage;
