import React from 'react';
import { CmsElement, CmsAssetVideoOrPhoto } from 'typings/cms';
import classnames from 'classnames';
import { WysiwygText, mapToMedia } from '@components/cms/CmsUtils';
import Button from '@components/base/Button/Button';
import BaseSection, { SectionWidth, BaseSectionGridSpacingBottom } from '@components/cms/Section/BaseSection';
import { trackCMSHeaderClick } from '@common/analytics/analytics';
import { Desktop, Mobile } from '@components/base/MediaQuerySSR';

export interface SimpleHeaderProps extends CmsElement {
    title: string;
    subtitle: string;
    textAlign: 'Left' | 'Center' | 'Right';
    mobileTextAlign: 'Left' | 'Center' | 'Right';

    media: CmsAssetVideoOrPhoto[];
    mobileMedia: CmsAssetVideoOrPhoto[];

    video: React.ReactNode | null;
    mobileVideo: React.ReactNode | null;

    horizontalTitleAlignment: 'Full width (100%)' | 'Righthand side (50%)' | 'Lefthand side (50%)';
    verticalTitleAlignment: 'Center' | 'Top' | 'Bottom';
    mobileHorizontalTitleAlignment: 'Full width (100%)' | 'Righthand side (50%)' | 'Lefthand side (50%)';
    mobileVerticalTitleAlignment: 'Center' | 'Top' | 'Bottom';

    width: SectionWidth;
    mobileWidth: SectionWidth;

    button: string;
    buttonUrl: string;
    buttonStyle: 'Primary' | 'Secondary' | 'Transparent (Light)' | 'Transparent (Dark)';

    emailCapture: React.ReactNode | null;

    spacingBottom: BaseSectionGridSpacingBottom;
    mobileSpacingBottom: BaseSectionGridSpacingBottom;
}

class SimpleHeader extends React.PureComponent<SimpleHeaderProps> {
    public render() {
        const {
            id, title, subtitle, media, mobileMedia, video, mobileVideo,
            horizontalTitleAlignment, verticalTitleAlignment, mobileHorizontalTitleAlignment, mobileVerticalTitleAlignment,
            textAlign, width, mobileWidth, button, buttonUrl, buttonStyle, spacingBottom, mobileSpacingBottom, mobileTextAlign,
            emailCapture
        } = this.props;

        const textOverlayClasses = classnames(
                    'text',
                    {
                        'text--no-overlay': (!media || media.length === 0) && !video,
                        'text--overlay': (media && media.length > 0) || video,
                        'text--vertical-center': verticalTitleAlignment === 'Center',
                        'text--vertical-top': verticalTitleAlignment === 'Top',
                        'text--vertical-bottom': verticalTitleAlignment === 'Bottom',
                        'text--horizontal-center-100': horizontalTitleAlignment === 'Full width (100%)',
                        'text--horizontal-left-50': horizontalTitleAlignment === 'Lefthand side (50%)',
                        'text--horizontal-right-50': horizontalTitleAlignment === 'Righthand side (50%)',
                        'text--mobile-vertical-center': mobileVerticalTitleAlignment === 'Center',
                        'text--mobile-vertical-top': mobileVerticalTitleAlignment === 'Top',
                        'text--mobile-vertical-bottom': mobileVerticalTitleAlignment === 'Bottom',
                        'text--mobile-horizontal-center-100': mobileHorizontalTitleAlignment === 'Full width (100%)',
                        'text--mobile-horizontal-left-50': mobileHorizontalTitleAlignment === 'Lefthand side (50%)',
                        'text--mobile-horizontal-right-50': mobileHorizontalTitleAlignment === 'Righthand side (50%)',
                        'text--text-align-center': textAlign === 'Center',
                        'text--text-align-left': textAlign === 'Left',
                        'text--text-align-right': textAlign === 'Right',
                        'text--mobile-text-align-center': mobileTextAlign === 'Center',
                        'text--mobile-text-align-left': mobileTextAlign === 'Left',
                        'text--mobile-text-align-right': mobileTextAlign === 'Right',
                    }
                );

        return <React.Fragment>
            <style jsx>{`
                @import 'vars';

                .HeaderSimple {
                    position: relative;

                    :global(img), :global(video) {
                        width: 100%;
                    }

                    :global(.HeaderSimple__CTA) {
                        margin-bottom: 24px;
                    }

                    &__EmailCaptureCmsContainer {
                        width: 100%;
                        max-width: 350px;
                    }
                }

                .text-protection {
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image: radial-gradient(circle at 50% -8%, #00000000, #0000004b);
                }

                .text {
                    display: flex;
                    flex-direction: column;
                    margin-top: 5*$space-base;
                    margin-bottom: 5*$space-base;
                    @include cms-page-padding-when-full-width-section;

                    &--no-overlay {
                        margin-top: 12*$space-base;
                    }

                    &--overlay {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;

                        color: $color-white;
                    }

                    &--vertical-center {
                        justify-content: center;
                    }
                    &--vertical-top {
                        justify-content: flex-start;
                    }
                    &--vertical-bottom {
                        justify-content: flex-end;
                    }
                    &--horizontal-center-100 {
                        align-items: center;

                        .inner {
                            width: 100%;
                        }
                    }
                    &--horizontal-right-50 {
                        align-items: flex-end;

                        .inner {
                            width: 50%;
                        }
                    }
                    &--horizontal-left-50 {
                        align-items: flex-start;

                        .inner {
                            width: 50%;
                        }
                    }

                    &--text-align-left {
                        text-align: left;
                    }
                    &--text-align-center {
                        text-align: center;

                        .HeaderSimple__EmailCaptureCmsContainer {
                            margin: 0 auto;
                        }
                    }
                    &--text-align-right {
                        text-align: right;
                    }

                    @include media("<tablet") {
                        &--no-overlay {
                            margin-top: 6*$space-base;
                        }

                        &--mobile-vertical-center {
                            justify-content: center;
                        }
                        &--mobile-vertical-top {
                            padding-top: 4*$space-base;
                            justify-content: flex-start;
                        }
                        &--mobile-vertical-bottom {
                            justify-content: flex-end;
                        }
                        &--mobile-horizontal-center-100 {
                            align-items: center;

                            .inner {
                                width: 100%;
                            }
                        }
                        &--mobile-horizontal-right-50 {
                            align-items: flex-end;

                            .inner {
                                width: 50%;
                            }
                        }
                        &--mobile-horizontal-left-50 {
                            align-items: flex-start;

                            .inner {
                                width: 50%;
                            }
                        }

                        &--mobile-text-align-left {
                            text-align: left;
                        }
                        &--mobile-text-align-center {
                            text-align: center;
                        }
                        &--mobile-text-align-right {
                            text-align: right;
                        }
                    }

                    :global(h1), :global(h2), :global(a:not(.Button)), :global(p) {
                        color: inherit;
                        &:last-child {
                            margin-bottom: 0;
                        }
                    }

                    :global(.ImageWrapper){
                        background-color: $color-white;
                    }
                }

                h1 {
                    margin-bottom: 4*$space-base;

                    @include media("<tablet") {
                        margin-bottom: 3*$space-base;
                    }
                }

                h2 {
                    @include text-style-h4;
                    margin-bottom: 3*$space-base;
                }
            `}</style>
            <BaseSection width={width} mobileWidth={mobileWidth}  spacingBottom={spacingBottom} mobileSpacingBottom={mobileSpacingBottom}>
                <div className={classnames('HeaderSimple', {})}>
                    {media && <Desktop><div className="HeaderSimple__Media">{media.map(mapToMedia)}</div></Desktop>}
                    {mobileMedia && <Mobile><div className="HeaderSimple__MobileMedia">{mobileMedia.map(mapToMedia)}</div></Mobile>}
                    {video && <Desktop><div className="HeaderSimple__Video">{video}</div></Desktop>}
                    {mobileVideo && <Mobile><div className="HeaderSimple__MobileVideo">{mobileVideo}</div></Mobile>}
                    <div className={textOverlayClasses}>
                        <div className="inner">
                            {title && <h1><WysiwygText text={title} /></h1>}
                            {subtitle && <h2><WysiwygText text={subtitle} /></h2>}
                            {button &&
                                <Button
                                    inline
                                    url={buttonUrl}
                                    transparent={buttonStyle === 'Transparent (Light)'}
                                    transparentBlack={buttonStyle === 'Transparent (Dark)'}
                                    secondary={buttonStyle === 'Secondary'}
                                    className="HeaderSimple__CTA"
                                    onClick={() => trackCMSHeaderClick(id, button)}
                                >
                                        {button}
                                </Button>
                            }
                            {emailCapture && <div className="HeaderSimple__EmailCaptureCmsContainer">{emailCapture}</div>}
                        </div>
                    </div>
                </div>
            </BaseSection>
        </React.Fragment>;
    }
}

export default SimpleHeader;
