import React from 'react';
import { SiteVersion, DEFAULT_SITE_VERSION } from '@common/constants';
import { connect } from 'react-redux';
import { RootState } from '@common/rematch';

export const SiteVersionContext = React.createContext(DEFAULT_SITE_VERSION);

interface Props {
    siteVersion: SiteVersion;
}

class SiteVersionProvider extends React.Component<Props> {
    public render() {
        return <SiteVersionContext.Provider value={this.props.siteVersion}>{this.props.children}</SiteVersionContext.Provider>;
    }
}

const mapStateToProps = (state: RootState) => ({
    siteVersion: state.SiteVersion,
});

export default connect(mapStateToProps)(SiteVersionProvider);
