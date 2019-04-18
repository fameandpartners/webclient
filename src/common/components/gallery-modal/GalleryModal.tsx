import React from 'react';
import { CustomizedProduct, ProductMedia, ProductListSummaries } from 'typings/product';
import { SiteVersion } from '@common/constants';
import Modal from '@components/modal/Modal';
import SEOIndexPage from '@components/base/Seo/SeoIndexPage';
import GallerySlider from '@components/gallery-modal/GallerySlider';
import { PreviewType } from '@common/utils/preview-type';
import { findImages, formatProductId } from '@common/utils/render-url-helper';
import { getDressLengthClass, hasCuratedImages } from '@common/utils/product';
import { Desktop } from '@components/base/MediaQuerySSR';
import HideChatBubble from '@components/Chat/HideChatBubble';

const BackArrow = require('@svg/i-back.svg').default;
const CloseCross = require('@svg/i-close-cross.svg').default;

interface Props {
    customizedProduct: CustomizedProduct;
    productListSummaries?: ProductListSummaries;
    position: number;
    siteVersion: SiteVersion;

    goToGallery: (position: number, customizedProduct: CustomizedProduct) => void;
    goToProductPage: (customizedProduct: CustomizedProduct) => void;
}

interface State {
    images: ProductMedia[];
}

class GalleryModal extends React.PureComponent<Props, State> {
    public state: State = {
        images: this.getImages(),
    };

    private getImages() {
        const { productListSummaries, customizedProduct } = this.props;
        const pid = formatProductId(customizedProduct);
        const hci = hasCuratedImages(customizedProduct, productListSummaries);

        return hci ? (productListSummaries![pid]!.media || []) : findImages(customizedProduct);
    }

    private next() {
        const nextPos = (this.props.position + 1) % this.state.images.length;
        this.goTo(nextPos);
    }

    private prev() {
        let nextPos = this.props.position - 1;
        if (nextPos < 0) {
            nextPos = this.state.images.length - 1;
        }
        this.goTo(nextPos);
    }

    private goTo(position: number) {
        this.props.goToGallery(position, this.props.customizedProduct);
    }

    private close() {
        this.props.goToProductPage(this.props.customizedProduct);
    }

    private renderHeader() {
        const title = `${this.props.position + 1} of ${this.state.images.length}`;

        return (
            <div>
                <style jsx>{`
                    @import 'vars';

                    div {
                        display: flex;
                        padding: 2*$space-base 5*$space-base 0;
                        justify-content: center;
                        align-items: center;

                        h4 {
                            margin: 0 $space-base;
                            @include text-style-title;
                            text-transform:uppercase;
                            text-align: center;
                        }

                        :global(svg) {
                            width: 2*$space-base;
                            height: 2*$space-base;
                            position: absolute;
                            top: 2.5*$space-base;
                            right: 0;
                            cursor: pointer;
                            z-index: $z-index-header;
                        }
                    }
                `}</style>
                <h4>{title}</h4>
                <Desktop>
                    <CloseCross
                        onClick={() => this.close()}
                    />
                </Desktop>
            </div>
        );
    }

    public render() {
        const { customizedProduct, productListSummaries, position } = this.props;
        const title = `${position + 1} of ${this.state.images.length}`;

        const hci = hasCuratedImages(customizedProduct, productListSummaries);

        return (
            <Modal
                backOptions={{
                    action: () => this.close(),
                }}
                siteVersion={this.props.siteVersion}
                headerNodes={this.renderHeader()}
            >
                <SEOIndexPage
                    shouldIndex={false}
                    title={title}
                    siteVersion={this.props.siteVersion}
                />
                <HideChatBubble />
                <style jsx>{`
                    @import 'vars';

                    @mixin arrow-container {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                        cursor: pointer;

                        width: 6 * $space-base;

                        @include media('>tablet') {
                            width: 2.5vw;
                        }
                    }

                    .left-arrow-container {
                        @include arrow-container;
                        left: $page-padding;
                        top: $navbar-height;

                        @include mobile {
                            left: $page-padding-mobile;
                        }
                    }

                    .right-arrow-container {
                        @include arrow-container;
                        right: $page-padding;
                        top: $navbar-height;
                        justify-content: flex-end;

                        @include mobile {
                            right: $page-padding-mobile;
                        }
                    }

                    // Cater for spacing on smaller dresses by pushing dresses down into the container
                    :global(.GallerySlider) {
                        :global(.FallbackImage) {
                            height: 100vh;
                        }
                    }

                    :global(.dress-length--KN) {
                        :global(picture) {
                            margin-top:10%;
                        }
                    }

                    :global(.dress-length--MN) {
                        :global(picture) {
                            margin-top:20%;
                        }
                    }

                    :global(.dress-length--MM) {
                        :global(picture) {
                            margin-top:20%;
                        }
                    }

                    :global(.dress-length--MD) {
                        :global(picture) {
                            margin-top:5%;
                        }
                    }

                    :global(.dress-length--AK) {
                        :global(picture) {
                            margin-top:0%;
                        }
                    }
                    :global(.dress-length--FM) {
                        :global(picture) {
                            margin-top:-5%;
                        }
                    }
                    :global(.dress-length--CM) {
                        :global(picture) {
                            margin-top:-5%;
                        }
                    }
                `}</style>
                
                <GallerySlider
                    showBackground={customizedProduct.product.previewType === PreviewType.Render}
                    images={this.state.images}
                    position={this.props.position}
                    onLeft={() => this.prev()}
                    onRight={() => this.next()}
                    close={() => this.close()}
                    containerClass={hci ? '' : getDressLengthClass(this.props.customizedProduct.components)}
                    useAspectRatio={false}
                />
                <div className="left-arrow-container" onClick={() => this.prev()}>
                    <BackArrow style={{ width: 13, height: 24 }} />
                </div>
                <div className="right-arrow-container" onClick={() => this.next()}>
                    <BackArrow style={{ width: 13, height: 24, transform: 'rotate(180deg)' }} />
                </div>
            </Modal>
        );
    }
}

export default GalleryModal;
