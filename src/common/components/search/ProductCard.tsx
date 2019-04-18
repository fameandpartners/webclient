import React from 'react';
import { SiteVersion, RENDER_IMAGE_SIZES } from '@common/constants';
import CurrencyAmount from '@components/base/CurrencyAmount/CurrencyAmount';
import FallbackImage from '@components/base/FallbackImage';
import HoverableImage from '@components/base/HoverableImage';
import { Link } from 'react-router-dom';
import { getRenderImageForPid } from '@common/utils/render-url-helper';
import { generateProductUrlForPid, URL_COMPONENT_SEPARATOR } from '@common/utils/url-helper';
import { UserRootState } from '@common/rematch/models/user';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import { ProductMedia, ProductDocument } from 'typings';
import { RenderPositionId } from '@common/utils/render-position-id';

interface Props {
    product: ProductDocument;
    siteVersion: SiteVersion;
    overlayText: boolean;

    user: UserRootState;
}

class ProductCard extends React.PureComponent<Props> {
    public render() {
        const { product, siteVersion, user, overlayText } = this.props;
        const components = product.pid.split(URL_COMPONENT_SEPARATOR).filter((x) => x !== product.productId);

        let frontImage: ProductMedia | null;
        let backImage: ProductMedia | null;
        let aspectRatio;

        if (product.images) {
            aspectRatio  = 1.43;

            frontImage = product.images[0];
            backImage = product.images[1];
        } else {
            aspectRatio  = 1.25;

            frontImage = getRenderImageForPid({
                productId: product.productId,
                components,
                sizes: RENDER_IMAGE_SIZES,
                renderPositionId: RenderPositionId.FrontNone,
                productVersionId: product.productVersionId,
            });

            backImage = getRenderImageForPid({
                productId: product.productId,
                components,
                sizes: RENDER_IMAGE_SIZES,
                renderPositionId: RenderPositionId.BackNone,
                productVersionId: product.productVersionId,
            });
        }

        const isAdmin = user && user.isAdmin;

        return (
            <React.Fragment>
                    <style jsx>{`
                        @import 'vars';

                        .ProductCard {
                            position: relative;

                            :global(.results--card) {
                                overflow: hidden;
                            }

                            &__Text {
                                text-align: center;
                            }

                            &--OverlayText {
                                .ProductCard__Text {

                                    bottom: 0;
                                    left: space(2);
                                    right: space(2);

                                    @include desktop {
                                        position: absolute;
                                        text-align: left;
                                    }
                                    @include mobile {
                                        margin-bottom: space(4)
                                    }
                                }
                            }

                            p {
                                &.title {
                                    @include text-style-body;
                                    margin-bottom: 0;
                                    margin-top: 2*$space-base;
                                }

                                &.subtitle {
                                    @include text-style-card-subtitle;
                                    color: $color-black;

                                    :global(.CurrencyAmount--StrikeThroughPrice) {
                                        @include text-style-card-subtitle;
                                    }

                                }
                            }

                            .hover-text {
                                position: absolute;
                                bottom: 0;
                                right: 0;
                                @include text-style-card-subtitle;
                                color: $color-black;
                                display: none;
                            }

                            &:hover {
                                .hover-text {
                                    display: block;
                                }
                            }
                        }
                    `}</style>
                    <div key={product.pid} className={classnames('ProductCard', {'ProductCard--OverlayText':  overlayText})}>
                        <Link className={'results--card no-underline'} to={product.url || generateProductUrlForPid(product.pid)}>
                            <HoverableImage>
                                {frontImage && <FallbackImage
                                    image={frontImage}
                                    sizes={'(max-width: 1440px) 33vw, 25vw'}
                                    showBackground
                                    aspectRatio={aspectRatio}
                                    objectFit="cover"
                                    objectPosition="center"
                                />}
                                {backImage && <FallbackImage
                                    image={backImage}
                                    sizes={'(max-width: 1440px) 33vw, 25vw'}
                                    showBackground
                                    aspectRatio={aspectRatio}
                                    objectPosition="center"
                                    objectFit="cover"
                                />}
                            </HoverableImage>

                            <div className="ProductCard__Text">
                                {overlayText && <p className="hover-text"><FormattedMessage id={'ProductCard.CustomizeHover'} defaultMessage={'Customize Color, Fabric & Length'} /></p>}

                                <p className="title">{product.name}</p>
                                <p className="subtitle">
                                    <CurrencyAmount value={product.price[siteVersion]} strikeThroughValue={product.strikeThroughPrice ? product.strikeThroughPrice[siteVersion] : undefined} hideSign />
                                </p>
                            </div>
                        </Link>
                    </div>
                </React.Fragment>
        );
    }
}

export default ProductCard;
