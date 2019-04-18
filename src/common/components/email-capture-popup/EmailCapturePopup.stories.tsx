import React from 'react';
import Cookies from 'universal-cookie';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import EmailCapturePopup from '@components/email-capture-popup';
import ECP from '@components/email-capture-popup/EmailCapturePopup';
import { Provider } from 'react-redux';
import configureStore from '@common/rematch';
import { User } from '@typings';
import { DEFAULT_SITE_VERSION } from '@common/constants';

// tslint:disable-next-line
import StoryRouter from 'storybook-react-router';

const store = configureStore(undefined);
const emptyUser: Partial<User> = { lastSignInDate: '123', currentSignInDate: '125' };

storiesOf('Modal/EmailCapture', module)
    .addDecorator((story) => <div><style jsx>{` div { background-color: orange; width: 100vw; height: 100vh; } `}</style>{story()}</div>)
    .addDecorator((story) => <Provider store={store}>{story()}</Provider>)
    .addDecorator(
        StoryRouter({
            '/thank-you': linkTo('Modal/EmailCapture', 'Thank you screen')
        })
    )
    .add('Popup after 8 seconds - Default Settings', () => {
        window.sessionStorage.clear();
        return <EmailCapturePopup popupTitle="test" popupThankYouTitle="thank you" />;
    });

storiesOf('Modal/EmailCapture', module)
    .addDecorator((story) => <div><style jsx>{` div { background-color: orange; width: 100vw; height: 100vh; } `}</style>{story()}</div>)
    .addDecorator((story) => <Provider store={store}>{story()}</Provider>)
    // .addDecorator((story) => <div><div className={'react-portal'} />{story()}</div>)
    .addDecorator(
        StoryRouter({
            '/thank-you': linkTo('Modal/EmailCapture', 'Thank you screen')
        })
    )
    .add('Doesn\'t popup after 8 seconds', () => (
        <ECP user={emptyUser as User} siteVersion={DEFAULT_SITE_VERSION} match={null!!} history={null!!} location={{ pathname: '', search: '', state: '', hash: '' }} popupTitle="test" popupThankYouTitle="thank you" />
    ))
    .add('Email Capture screen', () => {
        window.sessionStorage.clear();
        const cookies = new Cookies();
        cookies.remove('user_popup_viewed');
        return <EmailCapturePopup skipDelay popupTitle="test" popupThankYouTitle="thank you" />;
    });

storiesOf('Modal/EmailCapture', module)
    .addDecorator((story) => <div><style jsx>{` div { background-color: orange; width: 100vw; height: 100vh; } `}</style>{story()}</div>)
    .addDecorator((story) => <Provider store={store}>{story()}</Provider>)
    .addDecorator(
        StoryRouter({
            '/': linkTo('Modal/EmailCapture', 'Popup after 8 seconds - Default Settings')
        },
        { initialEntries: ['/thank-you'] })
    )
    
    .add('Thank you screen', () => {
        window.sessionStorage.clear();
        const cookies = new Cookies();
        cookies.remove('user_popup_viewed');
        return <EmailCapturePopup skipDelay popupTitle="test" popupThankYouTitle="thank you" />;
    });