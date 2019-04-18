import React from 'react';
import { KeyCodes } from '@common/utils/key-codes';
import KeyListener from '@components/event-listener/KeyListener';
import BaseMetaTags from '@components/base/Seo/BaseMetaTags';
import { SiteVersion, MediaQueryBreakpoint } from '@common/constants';
import { Mobile } from '@components/base/MediaQuerySSR';
import Button from '@components/base/Button/Button';

const CloseCross = require('@svg/i-close-cross.svg').default;

interface Props {
    backOptions?: {
        action: () => void;
        text?: React.ReactNode;
    };

    headerNodes?: React.ReactNode;
    showHeader?: boolean;
    footerNodes?: React.ReactNode;
    siteVersion: SiteVersion;
}
class Modal extends React.Component<Props> {
    public static defaultProps = {
        showHeader: true,
        showFooter: true
    };

    public render() {
        const { backOptions, headerNodes, showHeader, footerNodes, children, siteVersion } = this.props;

        return (
            <div className="Modal">
                <BaseMetaTags siteVersion={siteVersion} />
                <KeyListener
                    options={[
                        {
                            keyCode: KeyCodes.Esc,
                            action: () => {
                                if (backOptions) {
                                    backOptions.action();
                                }
                            }
                        }
                    ]}
                />

                <style jsx>{`
                    @import 'vars';

                    .header {
                        position: fixed;
                        top: 0;
                        right: $page-padding;
                        left: $page-padding;
                        height: $navbar-height;
                        z-index: $z-index-above-curtain;

                        h1 {
                            margin-bottom: 0;
                            padding-left: $gutter / 2;
                        }
                    }

                    .content {
                        @include media($iphoneX...) {
                            padding-bottom: 4*$space-base;
                        }
                    }

                    .footer {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;

                        @include media($iphoneX...) {
                            bottom: 4*$space-base;
                        }

                        .footer-inner {
                            @include container;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            position: relative;

                            @include desktop {
                                justify-content: center;
                                padding-top: 4*$space-base;
                                padding-bottom: 4*$space-base;
                            }

                            @include mobile {
                                padding: 0;
                            }
                        }

                        :global(.action-buttons) {
                            justify-content: center;
                            z-index: $z-index-below-header;

                            @include desktop {
                                min-width: 220px;
                            }

                            @include mobile {
                                width: 100%;
                            }

                            &:nth-child(2) {
                                border-left: 0;
                            }
                        }
                    }

                    .footer-spacer {
                        height: 14*$space-base;

                        @include mobile {
                            height: 6*$space-base;
                        }

                        @include media($iphoneX...) {
                            margin-bottom: 4*$space-base;
                        }
                    }

                    :global(.mobile-close-cross) {
                        position: absolute;
                        top: 0;
                        right: space();
                        cursor: pointer;
                        z-index: $z-index-below-header;
                        padding: space(2);
                    }
                `}</style>

                {backOptions && (
                    <React.Fragment>
                        {backOptions.text && <span>{backOptions.text}</span>}
                        <Mobile>
                            <Button noBorder transparentBlack aria-label="Close" onClick={backOptions.action} className={'mobile-close-cross'}>
                                <CloseCross 
                                    style={{ width: 16, height: 16 }}
                                />
                            </Button>
                            
                        </Mobile>
                    </React.Fragment>
                )}
                {showHeader && (
                    <React.Fragment>
                        <div className="header">
                            <div className="header-inner">
                                {headerNodes}
                            </div>
                        </div>
                    </React.Fragment>
                )}
                <div className="content">{children}</div>
                {
                    footerNodes && (
                        <React.Fragment>
                            <div className="footer-spacer" />
                            <div className="footer">
                                <div className="footer-inner">
                                    {footerNodes}
                                </div>
                            </div>
                        </React.Fragment>
                        )
                }
            </div>
        );
    }
}

export default Modal;
