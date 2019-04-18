import React, { PureComponent } from 'react';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import { User } from 'typings';
import ExpandTransition from '@components/animation/ExpandTransition';

const CloseCrossIcon = require('@svg/i-close-cross.svg').default;
const ShoppingBagIcon = require('@svg/i-shopping-bag.svg').default;
const SearchIcon = require('@svg/i-search.svg').default;

interface HeaderActionButtonsProps {
    cartItemCount: number;
    openShoppingCart: () => void;
    user: User | null;
}

interface HeaderActionButtonsState {
    searchBarActive: boolean;
}

class HeaderActionButton extends PureComponent<HeaderActionButtonsProps, HeaderActionButtonsState> {
    public state = {
        searchBarActive: false
    };

    private setSearchBarStatus(searchBarStatus: boolean) {
        this.setState({ searchBarActive: searchBarStatus });
    }
    private toogleSearchBarStatus() {
        this.setState(({ searchBarActive }) => ({ searchBarActive: !searchBarActive }));
    }

    public render() {
        const { cartItemCount, user } = this.props;
        const { searchBarActive } = this.state;

        return (
            <ul className="header-action-buttons">
                <style jsx>{`
                    @import 'vars';

                    .header-action-buttons {
                        display: inline-flex;
                        align-items: center;
                        justify-content: flex-end;

                        li {
                            display: inline-block;
                            margin-left: 2*$space-base;

                            :global(a) {
                                display: flex;
                                padding: space(2) $space-base;
                            }


                            &.cart {
                                margin-right:-$space-base;

                                a {
                                    text-decoration: none;
                                }

                                .cart-count {
                                    line-height: 16px;
                                    margin-left: $space-base;
                                }
                            }

                            @include media("<tabletLarge") {
                                display: none;

                                &.cart {
                                    display: block;
                                }
                            }
                        }

                        :global(.transition-container) {
                            overflow: hidden;
                        }
                    }
                `}</style>

                <li className="user-menu-wrapper">
                    <UserMenu user={user} />
                </li>

                <li className="search">
                    <a role="button" onClick={() => this.setSearchBarStatus(true)}>
                        <SearchIcon style={{ width: 16, height: 16 }} />
                    </a>
                </li>

                <ExpandTransition isVisible={this.state.searchBarActive} width={200}>
                    <li>
                        <SearchBar onBlur={() => this.setSearchBarStatus(false)} />
                    </li>
                </ExpandTransition>

                <li className="cart">
                    <a role="button" onClick={() => this.props.openShoppingCart()} aria-label="shopping bag">
                        <ShoppingBagIcon style={{ width: 18, height: 16 }} />
                        {cartItemCount > 0 ? <span className="cart-count">{cartItemCount}</span> : null}
                    </a>
                </li>
            </ul>
        );
    }
}

export default HeaderActionButton;
