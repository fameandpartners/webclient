import React from 'react';
import { CmsElement } from 'typings/cms';
import { WysiwygText } from '@components/cms/CmsUtils';
import BaseItem, { ItemSize, ItemTextSize, ItemTextAlign } from '@components/cms/Item/BaseItem';

interface Props extends CmsElement {
    text: string | null;
    size: ItemSize;
    mobileSize: ItemSize;
    textSize: ItemTextSize;
    textAlignment: ItemTextAlign;
}

const ItemText: React.SFC<Props> = ({ text, size, mobileSize, textAlignment, textSize }: Props) => {
    return <BaseItem className="TeaserText" size={size} mobileSize={mobileSize} textAlignment={textAlignment} textSize={textSize}>
        <style jsx>{`
            @import 'vars';

            :global(.TeaserText) {
                :global(a) {
                    text-decoration: none;

                    &:hover,
                    &:focus,
                    &:active {
                        text-decoration: underline;
                    }
                }
            }
        `}</style>
        {text && <WysiwygText text={text} />}
    </BaseItem>;
};

export default ItemText;