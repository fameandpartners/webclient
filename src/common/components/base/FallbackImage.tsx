import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import Spinner from '@components/base/Spinner';
import { FormattedMessage } from 'react-intl';
import { ProductMedia } from 'typings';
import { objectFitPolyfill } from '@common/../client/polyfill/object-fit';
import { ObjectPositionProperty, ObjectFitProperty } from 'csstype';
import AspectRatio from '@components/base/AspectRatio';
import Observer from '@researchgate/react-intersection-observer';
import IntersectionObserverProps from '@researchgate/react-intersection-observer/types/index';

interface Props {
    image: ProductMedia;
    sizes?: string;
    classNames?: string;
    style?: CSSProperties;
    showBackground?: boolean;
    aspectRatio?: null | number;
    objectFit?: ObjectFitProperty;
    objectPosition?: ObjectPositionProperty<string|number>;
    intersectionObserverSettings?: Partial<IntersectionObserverProps>;

    onSuccess?: () => void;
    onError?: () => void;
    onClick?: () => void;
}

interface State {
    downloadedImages: boolean;
    failedDownloadingImages: boolean;
    useFallback: boolean;
    image: ProductMedia;
    showImage: boolean;
}

class FallbackImage extends React.PureComponent<Props, State> {
    public state: State = {
        downloadedImages: false,
        image: this.props.image,
        failedDownloadingImages: false,
        useFallback: false,
        showImage: false
    };

    private _image: HTMLImageElement | null = null;

    public static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> {
        if (nextProps.image.src.length !== prevState.image.src.length ||  nextProps.image.src[0].url !== prevState.image.src[0].url) {
            return { downloadedImages: false, failedDownloadingImages: false, useFallback: false, image: nextProps.image };
        }

        return {};
    }

    private loadImage = (entry: IntersectionObserverEntry, unobserve: () => void) => {
        if (entry.isIntersecting && !this.state.downloadedImages) {
            this.setState({showImage: true});
            unobserve();
        }
    }

    private onLoadError() {
        const { image, onError } = this.props;
        const { useFallback } = this.state;

        if (!useFallback && image.src[0].fallbackUrl) {
            this.setState({ useFallback: true });
        } else if (!useFallback && image.src[0].urlWebp && image.src[0].url) {
            this.setState({ useFallback: true });
        } else {
            if (onError) {
                onError();
            }

            this.setState({ downloadedImages: false, failedDownloadingImages: true });
        }
    }

    private onLoadSuccess() {
        this.setState({ downloadedImages: true, failedDownloadingImages: false });

        if (this.props.onSuccess) {
            this.props.onSuccess();
        }

        objectFitPolyfill();
    }

    public render() {

        const { classNames, sizes, image, style, showBackground, onClick, aspectRatio, objectFit, objectPosition, intersectionObserverSettings } = this.props;
        const { useFallback, downloadedImages, failedDownloadingImages, showImage } = this.state;

        const srcOrFallback = useFallback ? image.src[0].fallbackUrl : image.src[0].url;
        const srcSet = image.src.length > 1 ? image.src.map((src) => `${useFallback ? (src.fallbackUrl || src.url) : src.url} ${src.width}w`).join(',') : undefined;
        const srcSetWebp = image.src.filter((x) => !!x.urlWebp).map((src) => `${useFallback ? (src.fallbackUrlWebp || src.fallbackUrl || src.url) : src.urlWebp} ${src.width}w`).join(',') || undefined;

        return (
            <Observer onChange={(entry, unobserve) => setTimeout(() => this.loadImage(entry, unobserve), 0)} {...intersectionObserverSettings}>
                <AspectRatio ratio={aspectRatio === undefined ? (image.src[0].height * 1.0 / image.src[0].width) : aspectRatio}>
                    <div className={classnames('FallbackImage', classNames, { 'FallbackImage--Show-Background': showBackground })} style={style}>
                        <style jsx>{`
                            @import 'vars';

                            .FallbackImage {
                                display: flex;

                                align-items: center;
                                justify-content: center;

                                position: relative;

                                &--Show-Background {
                                    background: $background-image-color;
                                }

                                picture {
                                    width: 100%;
                                    height: 100%;
                                }

                                img {
                                    position: relative;
                                    user-select: none;
                                    width: 100%;
                                    height: 100%;
                                    z-index: 1;
                                }

                                p {
                                    margin: 0;
                                    padding: space(1);
                                    text-align: center;
                                    max-width: 260px;
                                }
                            }
                        `}</style>

                        {!downloadedImages && !failedDownloadingImages
                            && (
                                <Spinner width={32} height={32} color={showBackground ? 'grey60' : 'grey47'} />
                            )
                        }

                        {failedDownloadingImages
                            && (
                                <p><FormattedMessage id={'FallbackImage.Failed'} defaultMessage="Sorry, we cannot find this image. Please try again later" /></p>
                            )
                        }

                        <picture
                             style={{
                                height: !downloadedImages ? 0 : undefined,
                                width: !downloadedImages ? 0 : undefined,
                             }}
                        >
                            <source srcSet={srcSetWebp} type="image/webp" />
                            
                            <img
                                alt={''}
                                data-object-fit={objectFit || 'contain'}
                                data-object-position={objectPosition || 'top'}
                                ref={(c) => { this._image = c; }}
                                src={showImage ? srcOrFallback : undefined}
                                srcSet={showImage ? srcSet : undefined}
                                sizes={sizes || '(max-width: 1024px) 100vw, 50vw'}
                                style={{
                                    height: !downloadedImages ? 0 : undefined,
                                    width: !downloadedImages ? 0 : undefined,
                                    objectFit: objectFit || 'contain',
                                    objectPosition: objectPosition || 'top'
                                }}
                                onLoad={() => this.onLoadSuccess()}
                                onError={() => this.onLoadError()}
                                onClick={onClick}
                            />
                        </picture>

                        {this.props.children}
                    </div>
                </AspectRatio>
            </Observer>
        );
    }
}

export default FallbackImage;
