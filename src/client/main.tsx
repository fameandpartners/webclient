import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import queryString from 'query-string';

import '@hellohuman/array-exts';

import configureStore from '@common/rematch/index';

import App from '@containers/App/index';
import LanguageProvider from '@containers/LanguageProvider/index';
import { translationMessages } from '@common/i18n';
import ScrollToTop from '@components/base/ScrollToTop';
import ClientContentfulService from './services/ClientContentfulService';
import SiteVersionProvider from '@common/context/SiteVersionContext';
import UserProvider from '@common/context/UserContext';

function main() {
    const store = configureStore(window.__PRELOADED_STATE__);
    store.dispatch.CmsModel.setContentfulService(new ClientContentfulService());

    hydrate(
        <Provider store={store}>
            <LanguageProvider messages={translationMessages}>
                <SiteVersionProvider>
                    <UserProvider>
                        <BrowserRouter>
                            <ScrollToTop>
                                <App />
                            </ScrollToTop>
                        </BrowserRouter>
                    </UserProvider>
                </SiteVersionProvider>
            </LanguageProvider>
        </Provider>,
        document.getElementById('root')
    );
}

export default main;
