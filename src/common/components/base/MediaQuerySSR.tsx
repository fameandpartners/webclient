import React from 'react';
import MediaQuery, { MediaQueryProps } from 'react-responsive';
import { isBrowser } from '@common/utils/server-client-helpers';
import { RootState } from '@common/rematch';
import { connect, DispatchProp } from 'react-redux';
import { MediaQueryBreakpoint } from '@common/constants';

interface State {
    isClient: boolean;
}

const mapStateToProps = (state: RootState) => ({
    responsiveWidth: state.ResponsiveWidthModel
});

/**
 * This component is just a wrapper for React-Responsive's MediaQuery element with a default value prop in server side rendering
 * https://github.com/contra/react-responsive/issues/162
 * Because hydrate() requires the SSR HTML to be exactly the same as the client side, we need to do a two pass render for any MediaQuery components
 */
class MediaQuerySSR extends React.PureComponent<MediaQueryProps & DispatchProp & { responsiveWidth: number }, State> {
    public state: State = {
        isClient: false,
    };

    public componentDidMount() {
        this.setState({ isClient: true });
    }

    public render() {
        const { isClient } = this.state;
        const { responsiveWidth, dispatch, ...other } = this.props;

        const values = isClient ? undefined : {deviceWidth: responsiveWidth, width: responsiveWidth };

        return <MediaQuery {...other} values={values} />;
    }
}

const ConnectedMediaQuerySSR = connect(mapStateToProps)(MediaQuerySSR);

export const Mobile: React.SFC<{}> = (props) => <ConnectedMediaQuerySSR maxWidth={MediaQueryBreakpoint.DESKTOP_SMALL} {...props} />;
export const Desktop: React.SFC<{}> = (props) => <ConnectedMediaQuerySSR minWidth={MediaQueryBreakpoint.DESKTOP_SMALL + 1} {...props} />;
export const DesktopLarge: React.SFC<{}> = (props) => <ConnectedMediaQuerySSR minWidth={MediaQueryBreakpoint.DESKTOP_LARGE} {...props} />;