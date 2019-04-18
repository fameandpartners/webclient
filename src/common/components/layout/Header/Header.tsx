import React from 'react';
import HeaderActionButtons from './HeaderActionButtons';
import ReactHoverObserver from 'react-hover-observer';
import { User } from 'typings';
import FadeInOutTransition from '@components/animation/FadeInOutTransition';
import classNames from 'classnames';
import SlideInOutTransition from '@components/animation/SlideInOutTransition';
import Curtain from '@components/base/Curtain';
import ScrollListener from '@components/event-listener/ScrollListener';
import HeaderMegaMenu from '@components/layout/Header/HeaderMegaMenu';
import MobileHeaderMegaMenu from '@components/layout/Header/MobileMegaMenu';
import { CmsPageGlobalConfig } from '@components/cms/CmsPageGlobalConfig';
import BetaBanner from '@components/layout/SitewideBanner';

const FameLogo = require('@svg/i-fame-logo.svg').default;
const HamburgerIcon = require('@svg/i-hamburger.svg').default;

interface HeaderProps {
    user: User | null;
    cartItemCount: number;
    openShoppingCart: () => void;
    customLogo?: React.ReactNode;
    transparent?: boolean;
    textColorWhenTransparent?: 'black' | 'white';
    backgroundColor?: 'White' | 'Light Pink';
    hideInMobile?: boolean;
    pageConfig: CmsPageGlobalConfig;
}
interface HeaderState {
    isHovering: boolean;
    openNavItem: number | null;
    showMobileMenu: boolean;
    hasScrolled: boolean;
}

class Header extends React.PureComponent<HeaderProps, HeaderState> {
    public state = {
        isHovering: false,
        openNavItem: null,
        showMobileMenu: false,
        hasScrolled: false
    };

    private handleLinkMouseOver = (openNavItem: number) => {
        this.setState({ openNavItem, isHovering: true });
    }

    private handleMenuMouseLeave = () => {
        this.setState({ isHovering: false });
    }

    private toggleMobileMenu = () => {
        this.setState(((state) => ({ showMobileMenu: !state.showMobileMenu, openNavItem: !!state.showMobileMenu ? null : 0 })));
    }

    private mobileOpenNavigation = (openNavItem: number) => {
        this.setState({ openNavItem });
    }

    private checkScrolling = () => {
        this.setState({hasScrolled: window.pageYOffset > 60});
    }

    public componentDidMount() {
        this.checkScrolling();
    }

    public render() {
        const { isHovering, openNavItem, showMobileMenu, hasScrolled } = this.state;
        const { cartItemCount, user, pageConfig, openShoppingCart, transparent, textColorWhenTransparent, backgroundColor, hideInMobile } = this.props;

        const logo = this.props.customLogo
            ? this.props.customLogo
            : <a className="logo" href="/">
                {/* TODO update to react router*/}
                <FameLogo style={{ width: 200, height: 26 }} />
            </a>;

        const shouldBeTransparent = transparent && !hasScrolled && !isHovering;
        const headerClass = classNames(
            'Header',
            {
                'Header--transparent': shouldBeTransparent,
                'Header--transparent-white': shouldBeTransparent && textColorWhenTransparent === 'white',
                'Header--background-light-pink': backgroundColor === 'Light Pink',
                'Header--hide-on-mobile': hideInMobile,
                'Header--active': isHovering,
            }
        );

        const desktopHeaderVisible = isHovering && openNavItem !== null && !showMobileMenu;

        return (
            <React.Fragment>
                <style jsx>{`
                    @import 'vars';

                    .Header {
                        background-color: $color-white;
                        border-bottom: 1px solid $color-grey90;
                        height: $navbar-height;
                        position: sticky;
                        top: 0;
                        left: 0;
                        right: 0;
                        z-index: $z-index-header;
                        transition: background-color 0.333s ease-out, color 0.333s ease-out;

                        &--active {
                            z-index: $z-index-above-curtain;
                        }
                        &--background-light-pink {
                            background-color: $color-light-pink;
                        }
                        &--transparent {
                            background-color: rgba(255, 255, 255, 0);
                            border-bottom: none;

                            :global(input) {
                                background-color: transparent;
                                border: none;
                                color: inherit;

                                &::placeholder {
                                    color: inherit;
                                }
                            }
                        }

                        &--transparent-white {
                            color: $color-white;

                            :global(.user-menu) {
                                color: $color-black;
                            }
                        }

                        &--hide-on-mobile {
                            @include mobile {
                                display: none;
                            }
                        }

                        :global(a) {
                            color: inherit;
                        }
                    }

                    .Header__Content {
                        @include container;
                        display: flex;
                        height: 100%;
                        align-items: center;
                        justify-content: center;
                        position: relative;

                        :global(.header-action-buttons) {
                            position: absolute;
                            right: $page-padding;
                            top: 0;
                            bottom: 0;

                            @include mobile {
                                right: $page-padding-mobile;
                            }
                        }

                        .Header__Content__Navigation {
                            position: absolute;
                            left: $page-padding;
                            top: 0;
                            bottom: 0;
                            display: flex;
                            align-items: center;

                            @include mobile {
                                left: $page-padding-mobile;
                            }

                            li {
                                display: inline-flex;
                                margin-right: 4*$space-base;

                                a {
                                    height: 56px;
                                    border-bottom: 1px solid transparent;
                                    display: flex;
                                    align-items: center;
                                    margin-bottom: -1px;
                                    text-decoration: none;

                                    &.active, &:hover {
                                        border-bottom-color: $color-grey20;
                                        text-decoration: none;
                                    }
                                }

                                &.mobile-menu-toggle {
                                    display: none;

                                    a {
                                        border-bottom: none;
                                    }
                                }

                                @include mobile {
                                    display: none;

                                    &.mobile-menu-toggle {
                                        display: block;
                                    }
                                }
                            }
                        }
                    }

                    .logo {
                        text-align: center;
                    }

                    .Header__Content__Navigation .mobile-menu-toggle {
                        display: none;
                    }


                `}</style>
                {transparent && <ScrollListener onScroll={this.checkScrolling} />}

                <header className={headerClass}>
                    <nav className="Header__Content">
                        <ul className="Header__Content__Navigation">
                            <li className="mobile-menu-toggle">
                                <a onClick={this.toggleMobileMenu}>
                                    <HamburgerIcon style={{ width: 22, height: 16 }} />
                                </a>
                            </li>
                            {
                                pageConfig.navigation.map((links, i) => (
                                    <li key={i}>
                                        <a className={this.state.isHovering && this.state.openNavItem === i ? 'active' : ''} onMouseOver={() => this.handleLinkMouseOver(i)}>{links.title}</a>
                                    </li>
                                ))
                            }
                        </ul>

                        {logo}

                        <HeaderActionButtons user={user} cartItemCount={cartItemCount} openShoppingCart={openShoppingCart} />
                    </nav>

                    <Curtain isVisible={desktopHeaderVisible} padNavbar>
                        <ReactHoverObserver
                            shouldDecorateChildren={false}
                            onMouseLeave={this.handleMenuMouseLeave}
                            hoverOffDelayInMs={400}
                            hoverDelayInMs={300}
                        >
                            <FadeInOutTransition
                                animateIn={false}
                                animateOut={true}
                                isVisible={desktopHeaderVisible}
                            >{(style) =>
                                <HeaderMegaMenu style={style} openNavItem={openNavItem} pageConfig={pageConfig} backgroundColor={backgroundColor} />
                            }
                            </FadeInOutTransition>
                        </ReactHoverObserver>
                    </Curtain>

                    <SlideInOutTransition
                        slideInFrom="left"
                        noFade
                        isVisible={showMobileMenu}
                    >
                        {(style) => (
                            <MobileHeaderMegaMenu
                                pageConfig={pageConfig}
                                style={style}
                                cartItemCount={cartItemCount}
                                openNavItem={openNavItem}
                                user={user}
                                toggleMobileMenu={this.toggleMobileMenu}
                                onNavItemClick={this.mobileOpenNavigation}
                                showCart={openShoppingCart}
                            />
                        )}
                    </SlideInOutTransition>
                </header>
            </React.Fragment>
        );
    }
}

export default Header;
