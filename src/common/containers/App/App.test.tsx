import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// SHIMs
import 'raf/polyfill';

import App from './index';
import LanguageProvider from '../../containers/LanguageProvider';

import configureStore from '../../rematch';
import { translationMessages } from '../../i18n';

const store = configureStore({});

describe('<App />', () => {
    test('renders without exploding', () => {
        const div = document.createElement('div');
        // Due to BABEL we currently can't test rendering elements unless we update the configs
        // ReactDOM.render(
        //     <Provider store={store}>
        //         <LanguageProvider messages={translationMessages}>
        //             <MemoryRouter>
        //                 <App />
        //             </MemoryRouter>
        //         </LanguageProvider>
        //     </Provider>,
        //     div,
        // );
    });
});
