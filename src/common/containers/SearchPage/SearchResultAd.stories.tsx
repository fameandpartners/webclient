import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import SearchResultAd from '@containers/SearchPage/SearchResultAd';

// tslint:disable-next-line
import StoryRouter from 'storybook-react-router';

storiesOf('Search', module)
    .addDecorator(
        StoryRouter({
            '/': linkTo('Search', '')
        })
    )
    .add('Ad', () => (
        <SearchResultAd />
    ));