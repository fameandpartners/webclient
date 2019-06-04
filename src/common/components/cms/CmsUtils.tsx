import React from 'react';
import { Markdown } from 'react-showdown';
import { CmsAsset, CmsAssetImage, CmsAssetVideo, CmsAssetVideoOrPhoto } from 'typings/cms';

const CONTENTFUL_MAX_RESIZE = 4000;

export const CmsImage: React.SFC<{media: CmsAssetImage, dontMaintainAspectRatio?: boolean}> = ({ media, dontMaintainAspectRatio }) => {
    const sizes = [0.15, 0.25, 0.50, 0.75, 1].filter((s) => canResize(media, s));

    const srcSet = sizes.map((size) => `${getImagePath(media, size)} ${Math.round(media.width * size)}w`)
        .join(', ');
    const srcSetWebp = sizes.map((size) => `${getImagePath(media, size, 'webp')} ${Math.round(media.width * size)}w`)
        .join(', ');

    return (
        <div className="ImageWrapper" style={{position: 'relative', paddingBottom: dontMaintainAspectRatio ? undefined : `${media.height * 100.0 / media.width}%`, backgroundColor: '#ffffff'}}>
            <picture style={{position: 'absolute', top: 0, bottom: 0, right: 0, left: 0}}>
                <source srcSet={srcSetWebp} type="image/webp" />
                <img src={media.url} alt={media.description} width={media.width} height={media.height} srcSet={srcSet}/>
            </picture>
        </div>
    );
};

export const CmsVideo: React.SFC<{media: CmsAssetVideo }> = ({ media }) => {
    return <div style={{ backgroundColor: '#f5f5f5'}}>
        <video 
            muted
            playsInline
            preload="auto"
            autoPlay
            loop
            src={media.url} 
        />
    </div>;
};

export function canResize(media: CmsAssetImage, factor: number) {
    if (factor === 1) {
        return true;
    }

    return media.width * factor < CONTENTFUL_MAX_RESIZE && media.height * factor < CONTENTFUL_MAX_RESIZE;                                                                                                   

}

export function getImagePath(media: CmsAssetImage, scale: number = 1, format?: 'webp') {
    let quality = 'q=80';
    if (format === 'webp') {
        quality = 'fm=webp&q=80';
    } else if (media.url.includes('jpg')) {
        quality = 'q=80&fl=progressive';
    }
    if (scale === 1) {
        return `${media.url}?${quality}`;
    }
    return `${media.url}?w=${Math.round(media.width * scale)}&h=${Math.round(media.height * scale)}&${quality}`;
}

export const WysiwygText: React.SFC<{text: string}> = ({text}) => {
    return <span className="WysiwygText">
        <style jsx>{`
            @import 'vars';

            .WysiwygText {
                :global(ul),
                :global(ol) {
                    margin-bottom: space(3);
                    margin-left: space(2);
                    list-style-position: inside;
                }

                :global(li) {
                    margin-bottom: space(0.5);
                }

                :global(ul) {
                    list-style-type: disc;
                }

                :global(ol) {
                    list-style-type: decimal;
                }

                 :global(hr) {
                    margin: space(5) 0;
                }
            }    
        `}</style>
        <Markdown markdown={text} tables />
    </span>;
};

export function mapToMedia(media: CmsAssetVideoOrPhoto) {
    if (media.type === 'image') {
        return <CmsImage key={media.id} media={media} />;

    } else if (media.type === 'video') {
        return <CmsVideo key={media.id} media={media} />;
    }

    return null;
}
