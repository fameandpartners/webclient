import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import FallbackImage from '@components/base/FallbackImage';

const items = {
    'Fallback Image with no fallback': (
        <FallbackImage
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
        />
    ),
    'Fallback Image fake url with no fallback': (
        <FallbackImage
            image={{
                type: 'photo',
                src: [
                    {
                        url: 'https://fake.url.jpg',
                        width: 200,
                        height: 200,
                    }
                ],
                sortOrder: 1,
                options: [],
            }}
        />
    ),
    'Fallback Image with fallback': (
        <FallbackImage
            image={{
                type: 'photo',
                src: [
                    {
                        url: 'https://fakeimage.url.jpg',
                        fallbackUrl: 'https://www.google.com/logos/doodles/2018/childrens-day-2018-taiwan-4669667200204800-2x.png',
                        width: 200,
                        height: 200,
                    }
                ],
                sortOrder: 1,
                options: [],
            }}
        />
    ),
    'Fallback Image with fake fallback': (
        <FallbackImage
            image={{
                type: 'photo',
                src: [
                    {
                        url: 'https://fakeimage.url.jpg',
                        fallbackUrl: 'https://also.fake.jpg',
                        width: 200,
                        height: 200,
                    }
                ],
                sortOrder: 1,
                options: [],
            }}
        />
    ),
};

storiesOf('Base', module).add('FallbackImage', () => (
    <table>
        <style jsx>{` td:first-child { width: 400px } `}</style>
        <tbody>
            {Object.entries(items).map(([text, item]) => (
                <tr key={text}>
                    <td>{text}</td>
                    <td>{item}</td>
                </tr>
            ))}
        </tbody>
    </table>
));
