import React, { Component, PureComponent } from 'react';
import { User } from 'typings';
import DropdownContainer from '@containers/SearchPage/DropdownContainer';

interface UserMenuProps {
    user: User | null;
}
class UserMenu extends PureComponent<UserMenuProps> {
    constructor(props: UserMenuProps) {
        super(props);
    }

    private renderLoggedIn() {
        const { user } = this.props;

        return (
            <DropdownContainer
                trigger={<a className="UserMenu__Trigger no-underline" href="/account/profile">{user!!.firstName} {user!!.lastName[0]}.</a>}
                containerStyle={{
                    boxShadow: `0px 5px 10px 0px rgba(0, 0, 0, 0.3)`,
                    width: 150,
                    top: 48,
                    left: 0
                }}
                animate
                container={
                    (style) => (
                        <div style={style} key="search" className="user-menu">
                            <a className="no-underline" href="/account/profile">My Account</a>
                            <a className="no-underline" href={'/orders'}>Orders</a>
                            {user && user.isAdmin && <a className="no-underline" href={'/admin'}>Spree Admin</a>}
                            {user && user.isAdmin && <a className="no-underline" href={'/fame_admin'}>Fame Admin</a>}
                            <a className="no-underline" href="/logout">Log Out</a>
                        </div>
                    )
                }
            />
        );
    }

    private renderAnonymous() {
        return <a className="no-underline login-link" href="/account/login">Log In / Sign Up</a>;
    }

    public render() {
        const { user } = this.props;

        if (user && user.firstName) {
            return this.renderLoggedIn();
        } else {
            return this.renderAnonymous();
        }
    }
}

export default UserMenu;
