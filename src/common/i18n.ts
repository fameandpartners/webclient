/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 */
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';

import { DEFAULT_SITE_VERSION } from '@constants';

const enAUTranslationMessages: any = require('@translations/en-AU.json');

addLocaleData(enLocaleData);

export const appLocales = [
    'en-US',
    'en-AU',
];

export const formatTranslationMessages = (locale: string, messages: any): any => {
    const defaultFormattedMessages = locale !== DEFAULT_SITE_VERSION
        ? formatTranslationMessages('en-US', {})
        : {};
    return Object.keys(messages).reduce(
        (formattedMessages, key) => {
            const formattedMessage = !messages[key] && locale !== DEFAULT_SITE_VERSION
                ? defaultFormattedMessages[key]
                : messages[key];
            return { ...formattedMessage, ...{ [key]: formattedMessage }};
        },
        {}
    );
};

export const translationMessages = {
    // 'en-US': formatTranslationMessages('en-US', enAUTranslationMessages),
    'en-AU': formatTranslationMessages('en-AU', enAUTranslationMessages),
};
