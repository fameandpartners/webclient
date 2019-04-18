import React from 'react';
import { CmsElement, CmsAssetImage } from 'typings/cms';
import { CmsImage } from '@components/cms/CmsUtils';
import BaseItem, { ItemSize, ItemTextSize, ItemTextAlign } from '@components/cms/Item/BaseItem';
import classnames from 'classnames';

interface Props extends CmsElement {
    media: CmsAssetImage;
    style: 'Maintain Aspect Ratio' | 'Stretch';
    size: ItemSize;
    mobileSize: ItemSize;
}

const ItemMedia: React.SFC<Props> = ({ media, style, size, mobileSize}: Props) => {
    return <BaseItem className={classnames('ItemImage', {'ItemImage--Stretch': style === 'Stretch'})} size={size} mobileSize={mobileSize} textAlignment={'Left'} textSize={'Medium'}>
        <style jsx>{`
            @import 'vars';

            :global(.ItemImage--Stretch) {
                :global(.ImageWrapper) {
                    flex: 1;

                    :global(img) {
                        object-fit: cover;
                        object-position: center;
                        height: 100%;
                        width: 100%;
                    }
                }
            }
        `}</style>
        {media && <CmsImage media={media} dontMaintainAspectRatio={style === 'Stretch'} />}
    </BaseItem>;
};

export default ItemMedia;