import React from 'react';
import classnames from 'classnames';

import { ProductMedia } from 'typings/product';
import FallbackImage from '@components/base/FallbackImage';
import { generateProductUrlForPid } from '@common/utils/url-helper';
import { Link } from 'react-router-dom';

interface Props {
    productMedia?: ProductMedia[];

    imageOverlay?: React.ReactNode;

    currentPid: string;
}

class GallerySection extends React.PureComponent<Props> {

    public renderMedia(media: ProductMedia) {
        return (
            <FallbackImage
                key={media.sortOrder}
                image={media}
                sizes={'(max-width: 568px) 100vw, 50vw'}
                aspectRatio={null}
                objectFit="cover"
                showBackground={!media.pid}
                intersectionObserverSettings={{
                    rootMargin: '20% 0px'
                } as any}
            >
                {this.props.imageOverlay}
            </FallbackImage>
        );
    }

    public render() {
        const { productMedia } = this.props;

        if (!productMedia) {
            return null;
        }

        return (
                <div className={classnames('GallerySection')}>
                    <style jsx>{`
                        @import 'vars';

                        .GallerySection {
                            position: relative;
                            :global(.FallbackImage) {
                                height: calc(100vh - #{$navbar-height});
                            }
                        }
                    `}</style>
                    {this.props.children}
                    {
                        productMedia.map((media) => {
                            if (media.pid) {
                                if (media.pid === this.props.currentPid) {
                                    return this.renderMedia(media);
                                } else {
                                    return (
                                        <Link key={media.sortOrder} to={generateProductUrlForPid(media.pid)}>
                                            {this.renderMedia(media)}
                                        </Link>
                                    );
                                }
                            }

                            return this.renderMedia(media);
                        })
                    }
                </div>
        );
    }
}

export default GallerySection;
