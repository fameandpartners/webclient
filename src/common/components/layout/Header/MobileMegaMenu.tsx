import React, { CSSProperties } from 'react';
import TabGroup from '@components/base/Tab/TabGroup';
import Tab from '@components/base/Tab/Tab';
import NavigationLinks from '@components/layout/NavigationLinks';
import UserMenu from '@components/layout/Header/UserMenu';
import Input from '@components/base/Input/Input';
import { User } from '@typings';
import BodyLock from '@components/base/BodyLock';
import { CmsPageGlobalConfig } from '@components/cms/CmsPageGlobalConfig';

const ShoppingBagIcon = require('@svg/i-shopping-bag.svg').default;
const SearchIcon = require('@svg/i-search.svg').default;
const CloseCrossIcon = require('@svg/i-close-cross.svg').default;
const FameLogo = require('@svg/i-fame-logo.svg').default;

interface Props {
    openNavItem: number | null;
    pageConfig: CmsPageGlobalConfig;
    style: CSSProperties;
    cartItemCount: number;
    user: User | null;
    toggleMobileMenu: () => void;
    onNavItemClick: (index: number) => void;
    showCart: () => void;
}

class MobileHeaderMegaMenu extends React.PureComponent<Props> {
    private onShowCart = () => {
        this.props.toggleMobileMenu();
        this.props.showCart();
    }

    public render() {
        const {pageConfig, openNavItem, style, cartItemCount, user, toggleMobileMenu, onNavItemClick} = this.props;

        return (
            <BodyLock isVisible isHeader>
                <div className="MobileHamburgerMenu" style={style}>
                    <style jsx>{`
                        @import 'vars';

                        .MobileHamburgerMenu {
                            position: fixed;
                            top: 0;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            overflow: auto;
                            color: $color-copy;
                            background: $color-white;
                            
                            :global(.NavigationLinks) {
                                :global(.NavigationLinks__Title) {
                                    margin: 4*$space-base 0 $space-base*2;
                                }

                                :global(ul) {
                                    display: flex;
                                    flex-wrap: wrap;

                                    :global(li) {
                                        width: 100%;
                                    }
                                }
                            }

                            .MobileHamburgerMenu__SearchForm{
                                position:relative;
                                border-bottom: 1px solid $color-grey90;
                                :global(svg) {
                                    position:absolute; left:2*$space-base; top:(7*$space-base/2)-$space-base;
                                }
                            }

                            .MobileHamburgerMenu__Header {
                                height: $navbar-height - 1px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 0 $page-padding-mobile;
                                border-bottom: 1px solid $color-grey90;

                                .cart {
                                    a {
                                        display: flex;
                                        text-decoration: none;
                                    }

                                    .cart-count {
                                        line-height: 16px;
                                        margin-left: $space-base;
                                    }
                                }
                            }

                            :global(input) {
                                padding: 13px $page-padding-mobile 13px 5*$space-base;
                                height: $navbar-height;
                            }

                            .MobileHamburgerMenu__Content {
                                overflow: auto;
                                padding: 0 $page-padding-mobile;                                

                                :global(.TabGroup) {
                                    display: inline; // IE Fix

                                    > :global(ul) {
                                        margin-left: -$page-padding-mobile;
                                        margin-right: -$page-padding-mobile;

                                        :global(li) {
                                            padding-left: $page-padding-mobile;
                                            padding-right: $page-padding-mobile;
                                        }
                                    }
                                }

                                :global(.TabTitle:last-child) {
                                    float: right;
                                    margin-right: 0;
                                }

                                :global(.Tab) {
                                    display: inline; // IE Fix
                                }
                            }
                        }
                    `}</style>

                    <div className="MobileHamburgerMenu__Header">
                        <a onClick={toggleMobileMenu}>
                            <CloseCrossIcon style={{ width: 16, height: 16 }} />
                        </a>
                        <a className="logo" href="/">
                            {/* TODO update to react router*/}
                            <FameLogo style={{ width: 200, height: 26 }} />
                        </a>
                        <span className={'cart'}>
                            <a 
                                role="button"
                                aria-label="search"
                                onClick={this.onShowCart}
                            >
                                <ShoppingBagIcon style={{ width: 18, height: 16 }} />
                                {cartItemCount > 0 ? <span className="cart-count">{cartItemCount}</span> : null}
                            </a>
                        </span>
                    </div>
                    <form action="/search" method="GET" className="MobileHamburgerMenu__SearchForm">
                        <SearchIcon style={{ width: 16, height: 16 }} />
                        <Input name="q" placeholder="Search" onlyBorderBottom />
                    </form>
                    <div className="MobileHamburgerMenu__Content">
                        <TabGroup 
                            tabTitles={[
                                ...pageConfig.navigation.map((links, i) => ({
                                    title: links.title, 
                                    value: i.toString(),
                                    onClick: () => onNavItemClick(i),
                                })),

                                { 
                                    title: <UserMenu user={user} />, 
                                }
                            ]} 
                            activeTab={(openNavItem || 0).toString()}
                        >
                            {pageConfig.navigation.map((links, i) => (
                                <Tab key={links.id} isActive={openNavItem === i}>
                                    <NavigationLinks items={links} showAd={false} showTitle />
                                </Tab>
                            ))}
                        </TabGroup>
                    </div>
                </div>
            </BodyLock>
        );
    }
}

export default MobileHeaderMegaMenu;