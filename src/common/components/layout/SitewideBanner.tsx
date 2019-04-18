import React from 'react';
import { SitewideBannerSettings } from '@components/cms/CmsPageGlobalConfig';
import { WysiwygText } from '@components/cms/CmsUtils';
import { Desktop, Mobile } from '@components/base/MediaQuerySSR';

const CloseCrossIcon = require('@svg/i-close-cross.svg').default;

interface Props {
    config: SitewideBannerSettings;
    hideInMobile?: boolean;
}
class SitewideBanner extends React.Component<Props> {
    public render() {
        const { config, hideInMobile } = this.props;

        return (
            <div className={`SitewideBanner SitewideBanner--${config.style} ${hideInMobile ? 'SitewideBanner--hide-on-mobile' : '' }`}>
                <style jsx>{`
                    @import 'vars';

                    .SitewideBanner {                        
                        padding: $space-base/2 $space-base;
                        text-align: center;
                        top: 0;
                        left: 0;
                        right: 0;
                        z-index: 100;
                        font-size: 16px;

                        :global(p) {
                            margin-bottom: 0;
                        }

                        &--Gold {
                            background-color: #CFC6B5;
                            color: $color-black;
                        }

                        &--Black {
                            background-color: $color-black;
                            color: $color-white;
                        }

                        &--White {
                            background-color: $color-white;
                            color: $color-copy;
                        }

                        &--Grey {
                            background-color: $color-footer-background;
                            color: $color-black;
                        }

                        &--Red {
                            background-color: #FF0000;
                            color: #303030;
                        }

                        &--Green {
                            background-color: #219647;
                            color: #FFFFFF;
                        }

                        &--hide-on-mobile {
                            @include mobile {
                                display: none;
                            }
                        }
                    }
                `}</style>
                <Desktop>
                    <WysiwygText text={config.text} />
                </Desktop>
                <Mobile>
                    <WysiwygText text={config.mobileText || config.text} />
                </Mobile>
            </div>
        );
    }
}

export default SitewideBanner;
