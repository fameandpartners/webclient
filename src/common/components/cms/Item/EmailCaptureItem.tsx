import React from 'react';
import { CmsElement } from 'typings/cms';
import { WysiwygText } from '@components/cms/CmsUtils';
import BaseItem, { ItemSize, ItemTextAlign } from '@components/cms/Item/BaseItem';

interface Props extends CmsElement {
    text: string | undefined;
    emailCapture: React.ReactNode | undefined;
    brontoCampaign: string | undefined;
    size: ItemSize;
    mobileSize: ItemSize;
    textAlignment: ItemTextAlign;
}

const EmailCaptureItem: React.SFC<Props> = ({ size, textAlignment, mobileSize, text, emailCapture }: Props) => {
    return  <BaseItem className="EmailCaptureItem" size={size} textAlignment={textAlignment} textSize="Medium" mobileSize={mobileSize}>
        <style jsx>{`
            @import 'vars';

            :global(.EmailCaptureItem) {
                :global(.EmailCaptureCms) {
                    width: 100%;
                    max-width: 350px;
                    margin: 0 auto;
                }
            }
        `}</style>
            {text && <WysiwygText text={text} />}

            {emailCapture}
    </BaseItem>;
};

export default EmailCaptureItem;
