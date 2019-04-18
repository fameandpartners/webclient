import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import ShareModal from '@components/share-modal/ShareModal';

global.dataLayer = [];

storiesOf('Modal/Search', module)
.addDecorator((story) => <div><style jsx>{` div { background-color: black; width: 100vw; height: 100vh; } `}</style>{story()}</div>)
.add('Basic', () => (
    <ShareModal
        url={'https://fake-url.asd'}
        image={{
            type: 'photo',
            src: [
                {
                    url: 'https://www.google.com/logos/doodles/2018/royal-wedding-2018-5806028573638656.3-2x.jpg',
                    width: 200,
                    height: 200,
                }
            ],
            sortOrder: 1,
            options: [],
        }}
        onClose={() => action('on close')}
        isVisible
        dressTitle={'The James'}
    />
));
