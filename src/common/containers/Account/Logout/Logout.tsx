import React from 'react';
import { User } from '@typings';
import { SiteVersion } from '@common/constants';
import FullScreenLoader from '@components/base/FullScreenLoader';
import { Redirect, Switch } from 'react-router';
import { isBrowser } from '@common/utils/server-client-helpers';

interface Props {
    user: User | null;
    siteVersion: SiteVersion;

    logout: (payload: any) => void;
    clear: () => void;
}

class Logout extends React.PureComponent<Props> {
    
    public componentDidMount() {
        this.props.logout(null);
        this.props.clear();
    }

    public componentDidUpdate() {
        if (!this.props.user) {
            window.location.href = '/';
        }
    }

    public static getDerivedStateFromProps(nextProps: Props) {
        if (!nextProps.user && isBrowser()) {
            window.location.href = '/';
        }

        return {};
    }

    public render() {
        const { user } = this.props;
        if (user) {
            return <FullScreenLoader />;
        }

        return null;
    }
}

export default Logout;
