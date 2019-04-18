import React, { ReactNode } from 'react';
import { mapToMedia } from '@components/cms/CmsUtils';
import BaseItem, { ItemSize, ItemTextSize, ItemTextAlign } from '@components/cms/Item/BaseItem';
import { connectProductSummary } from '@containers/CmsPage/DataLoader';
import CurrencyAmount from '@components/base/CurrencyAmount/CurrencyAmount';
import Spinner from '@components/base/Spinner';
import FallbackImage from '@components/base/FallbackImage';
import HoverableImage from '@components/base/HoverableImage';
import { getRenderImageForPid } from '@common/utils/render-url-helper';
import { RENDER_IMAGE_SIZES } from '@common/constants';
import { generateProductUrlForPid, URL_COMPONENT_SEPARATOR } from '@common/utils/url-helper';
import { RenderPositionId } from '@common/utils/render-position-id';
import { ProductListSummary, CmsAssetVideoOrPhoto } from 'typings';

interface Props {
    titleOverwrite?: string | null;
    mediaOverwrite?: CmsAssetVideoOrPhoto[];
    videoOverwrite?: ReactNode;
    size: ItemSize;
    mobileSize: ItemSize;
    textSize: ItemTextSize;
    textAlignment: ItemTextAlign;
    pid: string;
    product: ProductListSummary;
    hidePrice?: 'Yes' | 'No';
    background?: 'None' | 'Light Grey';
}

export const ItemProduct: React.SFC<Props> = ({ titleOverwrite, mediaOverwrite, videoOverwrite, size, mobileSize, textAlignment, textSize, product, hidePrice, background }: Props) => {
    if (!product) {
        return <div className="LoaderContainer">
            <style jsx>{`
                .LoaderContainer {
                    display: flex;
                    align-items: center;
                    height: 100%;
                    justify-content: center;
                }
            `}</style>
            <Spinner width={36} height={36} color="black" />
        </div>;
    }

    let media: ReactNode = null;

    if (videoOverwrite) {
        media = videoOverwrite;
    } else if (mediaOverwrite) {
        media = (
            <HoverableImage>
                {mediaOverwrite.slice(0, 2).map(mapToMedia)}
            </HoverableImage>
        );
    } else if (product.media && product.media.length > 0) {
        media = (
            <HoverableImage>
                {
                    product.media.slice(0, 2).map((m, i) => {
                        return <FallbackImage
                            showBackground
                            aspectRatio={1.25}
                            objectFit={'cover'}
                            key={m.src[0].url}
                            image={m}
                        />;
                    })
                }
            </HoverableImage>
        );
    } else {
        const components = product.pid.split(URL_COMPONENT_SEPARATOR);
        const productId = components.shift()!!;
        const showBackground = background === 'Light Grey';

        media = (
            <HoverableImage>
                <FallbackImage
                    showBackground={showBackground}
                    objectFit={'cover'}
                    aspectRatio={1.25}
                    image={
                        getRenderImageForPid({
                            productId,
                            components,
                            sizes: RENDER_IMAGE_SIZES,
                            renderPositionId: RenderPositionId.FrontNone,
                        })
                    }
                />
                <FallbackImage
                    showBackground={showBackground}
                    objectFit={'cover'}
                    aspectRatio={1.25}
                    image={
                        getRenderImageForPid({
                            productId,
                            components,
                            sizes: RENDER_IMAGE_SIZES,
                            renderPositionId: RenderPositionId.BackNone,
                        })
                    }
                />
            </HoverableImage>
        );
    }

    const url = product.url || generateProductUrlForPid(product.pid);
    const name = titleOverwrite || product.name;

    return (
        <BaseItem className="ItemProduct" size={size} mobileSize={mobileSize} textAlignment={textAlignment} textSize={textSize}>
            <style jsx>{`
                @import "vars";

                p {
                    @include text-style-body;

                    &.title{
                        margin:space(2) 0 0 0;
                    }
                    &.subtitle{
                        margin:0;

                        :global(.CurrencyAmount--StrikeThroughPrice) {
                            font-size: inherit !important;
                        }
                    }
                }

                .ItemProduct {
                    :global(.FallbackImage) {
                        width: 100%;
                    }
                }
            `}</style>
            <a href={url} className="no-underline">
                {media}
                <p className="title">
                    {name}
                </p>
                {hidePrice !== 'Yes' && <React.Fragment>
                    <p className="subtitle"><CurrencyAmount value={product.price} hideSign strikeThroughValue={product.strikeThroughPrice} /></p>
                </React.Fragment>}
            </a>
        </BaseItem>);
};

export default connectProductSummary()(ItemProduct);
