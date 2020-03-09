import React, { ReactNode } from 'react';
import { CmsElement, CmsAssetVideoOrPhoto } from 'typings/cms';
import { mapToMedia, WysiwygText } from '@components/cms/CmsUtils';
import classnames from 'classnames';
import BaseItem, { ItemSize, ItemTextSize, ItemTextAlign } from '@components/cms/Item/BaseItem';

interface Props extends CmsElement {
  title: string | null;
  link: string | null;
  size: ItemSize;
  mobileSize: ItemSize;
  textSize: ItemTextSize;
  textAlignment: ItemTextAlign;
  media: CmsAssetVideoOrPhoto[];
  video?: ReactNode;
  urlTargetBlank?: boolean;
}

const MaybeLink: React.SFC<{ link: string | null; urlTargetBlank?: boolean; children: React.ReactNode }> = ({ link, urlTargetBlank, children }) => {
  if (link) {
    return (
      <a href={link} target={urlTargetBlank === true ? '_blank' : '_self'} rel="noopener noreferrer" className="no-underline">
        {children}
      </a>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
};

const Teaser: React.SFC<Props> = ({ title, media, video, size, mobileSize, link, textSize, textAlignment, urlTargetBlank }: Props) => {
  return (
    <BaseItem className="CmsTeaser" size={size} textAlignment={textAlignment} textSize={textSize} mobileSize={mobileSize}>
      <style jsx>{`
        @import 'vars';

        :global(.CmsTeaser) {
          :global(img) {
            width: 100%;
          }

          :global(p) {
            margin: $space-base 0 0;
            @include cms-page-padding-when-full-width-section;
          }
        }
      `}</style>
      <MaybeLink link={link} urlTargetBlank={urlTargetBlank}>
        {video}
        {media && media.map(mapToMedia)}
        {title && <WysiwygText text={title} />}
      </MaybeLink>
    </BaseItem>
  );
};

export default Teaser;
