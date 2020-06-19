import React, { PureComponent } from 'react';
import EmailCapture from './EmailCapture';
import SocialLinks from './SocialLinks';
import NavigationLink from '../NavigationLinks';
import { SiteVersion } from '@common/constants';
import { FormattedMessage } from 'react-intl';
import Select from '@components/base/Input/Select';
import InputWrapper from '@components/base/Input/InputWrapper';
import { CmsPageGlobalConfig } from '@components/cms/CmsPageGlobalConfig';

interface FooterProps {
    siteVersion: SiteVersion;
    pageConfig: CmsPageGlobalConfig;
    changeSiteVersion: (siteVersion: SiteVersion) => void;
}

class Footer extends PureComponent<FooterProps> {
    public render() {
        return (
            <footer>
                <style jsx>{`
                        @import "vars";


                        .social-links {
                            @include grid-column(5);
                            padding-left:0;
                            padding-right:0;

                            margin-top: $space-base*4;
                            display: flex;
                            align-items: flex-end;
                            justify-content: flex-end;

                            @include media('<tabletLarge') {
                                @include grid-column(12);
                                align-items: flex-start;
                                justify-content: flex-start;

                                :global(.container) {
                                    justify-content: flex-start;
                                }
                            }

                            @include mobile {
                                margin-top:2*$space-base;
                            }
                        }

                        footer {
                            background-color: $color-footer-background;
                            padding: 5*$space-base 0 6*$space-base 0;

                            @include media('<tabletLarge') {
                                padding: 5*$space-base 0 7*$space-base 0;
                            }
                        }

                        .inner { 
                            @include grid;
                            margin: 0 auto;
                            padding:0 $page-padding;

                            :global(.NavigationLinks) {
                                @include grid-column(6);
                                padding-left:0;
                                padding-right:0;
                                margin-top: 5*$space-base;

                                :global(a) {
                                    color:$color-black;
                                }

                                @include media('<tabletLarge') {
                                    @include grid-column(12);

                                    :global(ul) {
                                        column-count: 2;

                                        :global(li.horizontal) {
                                            display: block;
                                            margin: 0;
                                        }
                                    }
                                    
                                }
                            }

                            .newsletter {
                                @include grid-column(5);
                                padding-left:0;
                                padding-right:0;

                                @include media("<tabletLarge") {
                                    order: -1;
                                    @include grid-column(12);
                                    margin-bottom: 2*$space-base;
                                }

                                :global(label) {
                                    font-weight: normal;
                                }
                            }
                        }

                        .spacer {
                            @include grid-column(2);
                        }

                        .copyright-spacer {
                            @include grid-column(2);

                            @include media('>=tabletLarge', '<desktopMedium') {
                                width: 0;
                                padding: 0;
                            }
                        }

                        .copyright-site-version {
                            @include grid-column(4);
                            padding-left:0;
                            padding-right:0;

                            @include text-style-navigation-item;
                            font-size: 12px;
                            display: flex;
                            align-content: center;
                            justify-content: flex-end;
                            flex-wrap: wrap;

                            margin-top: 4*$space-base;

                            @include media('<tabletLarge') {
                                @include grid-column(12);
                            }

                            @include media('>=tabletLarge', '<desktopMedium') {
                                @include grid-column(6);
                                margin-top: 5*$space-base;
                                align-content: flex-start;
                            }

                            @include mobile {
                                justify-content: flex-start;
                            }

                            .site-version {
                                display: inline-flex;
                                @include text-style-inherit;
                                align-items: center;

                                @include media("<tablet") {
                                    position: initial;
                                    margin-bottom: 3*$space-base;
                                }

                                @include desktop {
                                    margin-right: 4*$space-base;
                                }

                                :global(.select) {
                                    @include text-style-inherit;
                                }
                            }
                        }
                    `}
                </style>
                <div className="inner">
                    <div className="newsletter">
                        <InputWrapper label={<FormattedMessage id={'Footer.Newsletter.Callout'} defaultMessage={'Try custom for the first time with $20 off'} />}>
                            <EmailCapture buttonText="JOIN NOW" name="Footer" style="black" slim />
                        </InputWrapper>
                    </div>

                    <div className="spacer" />
                    
                    <div className="social-links">
                        <SocialLinks />
                    </div>

                    {this.props.pageConfig.footerNavigation.map((links) => <NavigationLink
                        key={links.id}
                        items={links}
                        showAd={false}
                        showTitle={false}
                        horizontal
                    />)}
                    
                    <div className="copyright-spacer" />
                </div>
            </footer>
        );
    }
}

export default Footer;
