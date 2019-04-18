import React, { CSSProperties } from 'react';
import NavigationLinks from '@components/layout/NavigationLinks';
import { SiteVersion } from '@common/constants';
import classNames from 'classnames';
import { CmsPageGlobalConfig } from '@components/cms/CmsPageGlobalConfig';

class HeaderMegaMenu extends React.PureComponent<{pageConfig: CmsPageGlobalConfig, openNavItem: number | null, style: CSSProperties, backgroundColor?: 'White' | 'Light Pink'}> {
    public render() {
        const {style, openNavItem, pageConfig, backgroundColor} = this.props;

        return (
        <div className={classNames('HeaderMegaMenu', {'HeaderMegaMenu--background-light-pink': backgroundColor === 'Light Pink'})}  style={style}>
            <style jsx>{`
                @import 'vars';

                .HeaderMegaMenuContainer {
                    @include grid;
                    padding-top: 6 * $space-base;
                    padding-bottom: 6 * $space-base;
                    padding-left:calc(#{$page-padding} - 1.25vw);
                    padding-right:calc(#{$page-padding} - 1.25vw);
                    

                    :global(.NavigationLinks) {
                        @include grid-column(2);
                        max-width: 250px;
                    }

                    :global(.NavigationAd) {
                        @include grid-column(3);
                        max-width: calc(328px + #{$gutter});
                    }

                    :global(.NavigationSpacer) {
                        width: 0;
                        flex-grow: 1;
                    }
                }

                .HeaderMegaMenu {
                    overflow: hidden;
                    background-color: $color-white;
                    min-height:464px;

                    &--background-light-pink {
                        background-color: $color-light-pink;
                    }

                    @include media(">desktopSmall") {
                        min-height:464px;
                    }
                }
            `}</style>
        
            <div className="HeaderMegaMenuContainer">
                {openNavItem !== null && <NavigationLinks items={pageConfig.navigation[openNavItem]} showAd showTitle/>}
            </div>
        </div>);
    }
}

export default HeaderMegaMenu;