import React, { ErrorInfo } from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from '@containers/App/routes';
import ErrorPage from '@components/error-page/ErrorPage';
import { logHandledError } from '@common/utils/error-reporting';
import PageWideTrackingParams from '@components/tracking/PageWideTrackingParams';
import GlobalEmailCapturePopup from '@components/email-capture-popup/GlobalEmailCapturePopup';
class App extends React.Component<{}, {isError: boolean}> {
    public state = {
        isError: false
    };

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logHandledError(error, { extra: errorInfo });
        this.setState({isError: true});
    }

    protected renderError() {
        return <ErrorPage type={500} />;
    }

    protected renderMaintenanceMode() {
        return <ErrorPage type={200} />;
    }

    protected renderApp() {
        return <Switch>
            {routes.map((route, i) => <Route key={i} {...route} />)}
            <Route render={() => <ErrorPage type={404} />} />
        </Switch>;
    }

    public render() {
        return (
            <React.Fragment>
                <PageWideTrackingParams />
                <GlobalEmailCapturePopup />
                <React.StrictMode>
                    <link rel="stylesheet" type="text/css" href="https://use.typekit.net/gdp4xpj.css" />
                    <style jsx global>{`
                        @import 'styles.scss';
                    `}</style>

                    {global.__FAME_CONFIG__.FLAGS.MAINTENANCE_MODE
                        ? this.renderMaintenanceMode()
                        : this.state.isError ? this.renderError() : this.renderApp()}
                </React.StrictMode>
            </React.Fragment>
        );
    }
}

export default App;
