import React from 'react';
import { CmsElement, CmsAssetVideoOrPhoto } from 'typings/cms';
import BaseSection, { SectionWidth, BaseSectionGridSpacingBottom } from '@components/cms/Section/BaseSection';
import { mapToMedia, WysiwygText } from '@components/cms/CmsUtils';

interface Props extends CmsElement {
    width: SectionWidth;
    mobileWidth: SectionWidth;
    text: string;
    spacingBottom: BaseSectionGridSpacingBottom;
    mobileSpacingBottom: BaseSectionGridSpacingBottom;
    media: CmsAssetVideoOrPhoto;
}

const TextSection: React.SFC<Props> = ({ media, text, width, mobileWidth, spacingBottom, mobileSpacingBottom}: Props) => {
    return (
        <BaseSection width={width} mobileWidth={mobileWidth} mobileSpacingBottom={mobileSpacingBottom} spacingBottom={spacingBottom}>
            <style jsx>{`
                @import 'vars';
            `}</style>

            {media && mapToMedia(media)}
            <WysiwygText text={text} />
        </BaseSection>
    );
};

export default TextSection;
