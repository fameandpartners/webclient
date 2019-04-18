import React from 'react';
import { CmsElement } from 'typings/cms';
import BaseSection, { SectionWidth, BaseSectionGridSpacingBottom } from '@components/cms/Section/BaseSection';
import BaseSectionGrid, { BaseSectionGridConfiguration, BaseSectionGridGutter, BaseSectionGridFlowOrder, BaseSectionGridBackgroundColor } from '@components/cms/Section/BaseSectionGrid';
import classnames from 'classnames';
import { WysiwygText } from '../CmsUtils';

interface Props extends CmsElement {
    title: string | null;
    titleAlignment: 'Left' | 'Center' | 'Right';
    mobileTitleAlignment: 'Left' | 'Center' | 'Right';
    gridConfiguration:  BaseSectionGridConfiguration;
    width: SectionWidth;
    mobileGridConfiguration:  BaseSectionGridConfiguration;
    mobileWidth: SectionWidth;
    content: React.ReactNode[];
    spacingBottom: BaseSectionGridSpacingBottom;
    mobileSpacingBottom: BaseSectionGridSpacingBottom;
    gridGutter: BaseSectionGridGutter;
    mobileGridGutter: BaseSectionGridGutter;
    mobileFlowOrder: BaseSectionGridFlowOrder;
    backgroundColor?: BaseSectionGridBackgroundColor;
}

const SectionGrid: React.SFC<Props> = ({ title, titleAlignment, mobileTitleAlignment, gridConfiguration, width, mobileGridConfiguration, mobileWidth, content, spacingBottom, mobileSpacingBottom, gridGutter, mobileGridGutter, mobileFlowOrder, backgroundColor }: Props) => {
    const titleClasses = classnames(
        {
            'text-align-center': titleAlignment === 'Center',
            'text-align-left': titleAlignment === 'Left',
            'text-align-right': titleAlignment === 'Right',
            'mobile-text-align-center': mobileTitleAlignment === 'Center',
            'mobile-text-align-left': mobileTitleAlignment === 'Left',
            'mobile-text-align-right': mobileTitleAlignment === 'Right',
        }
    );

    return (
        <BaseSection width={width} mobileWidth={mobileWidth} spacingBottom={spacingBottom} mobileSpacingBottom={mobileSpacingBottom}>
            <style jsx>{`
                @import 'vars';

                h3 {
                    margin-bottom: 3*$space-base;

                    &.text-align-center {
                        text-align: center;
                    }
                    &.text-align-right {
                        text-align: right;
                    }
                    &.text-align-left {
                        text-align: left;
                    }

                     @include media("<tablet") {
                        &.mobile-text-align-left {
                            text-align: left;
                        }
                        &.mobile-text-align-center {
                            text-align: center;
                        }
                        &.mobile-text-align-right {
                            text-align: right;
                        }
                    }
                }
            `}</style>

            {title && <h3 className={titleClasses}><WysiwygText text={title} /></h3>}

            <BaseSectionGrid gridConfiguration={gridConfiguration} mobileGridConfiguration={mobileGridConfiguration} gridGutter={gridGutter} mobileGridGutter={mobileGridGutter} mobileFlowOrder={mobileFlowOrder} backgroundColor={backgroundColor}>
                {content}
            </BaseSectionGrid>
        </BaseSection>
    );
};

export default SectionGrid;
