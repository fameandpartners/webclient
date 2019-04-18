import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import SearchResultEmpty from '@containers/SearchPage/SearchResultEmpty';
import { SearchPageType } from '@containers/SearchPage/SearchPage';

storiesOf('Search', module)
    .add('Empty', () => (
        <SearchResultEmpty type={SearchPageType.CATEGORY_PAGE} onResetAllFilters={action('on reset filters')}/>
    ));