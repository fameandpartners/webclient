import { addDecorator, configure } from '@storybook/react';
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import { setIntlConfig, withIntl } from 'storybook-addon-intl';
import { configureViewport, INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import React from 'react';

import "../src/common/assets/scss/styles.scss";

import { appLocales, translationMessages } from '@common/i18n';

addLocaleData(enLocaleData);

// Set intl configuration
setIntlConfig({
    locales: appLocales,
    defaultLocale: 'en-US',
    getMessages: (locale) => translationMessages[locale]
});

// Register decorator
addDecorator(withIntl);

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /.stories.(js|tsx)$/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
configureViewport({ viewports: INITIAL_VIEWPORTS });
