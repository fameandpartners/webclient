import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import GallerySlider from '@components/gallery-modal/GallerySlider';
import { ProductMedia } from 'typings/product';

const images = [
    {
        type: 'photo',
        src: [
            {
                name: 'Royal Wedding 2018',
                url: 'https://www.google.com/logos/doodles/2018/royal-wedding-2018-5806028573638656.3-2x.jpg',
                width: 200,
                height: 200,
            }
        ],
        sortOrder: 1,
        options: [],
    },
    {
        type: 'photo',
        src: [
            {
                name: 'Children Day 2018 (Taiwan)',
                url: 'https://fakeimage.url.jpg',
                fallbackUrl: 'https://www.google.com/logos/doodles/2018/childrens-day-2018-taiwan-4669667200204800-2x.png',
                width: 200,
                height: 200,
            }
        ],
        sortOrder: 1,
        options: [],
    }
];

const items = {
    'Slider': <GallerySlider images={images as ProductMedia[]} showBackground={false} position={0} onLeft={() => null} close={() => null} onRight={() => null} useAspectRatio />,
    'Slider with bg': <GallerySlider images={images as ProductMedia[]} showBackground={true} position={1} onLeft={() => null} close={() => null} onRight={() => null} useAspectRatio />,
};

storiesOf('Components/Gallery', module)
    .add('Slider', () => (
        <table>
            <style jsx>{` td:first-child { width: 200px } `}</style>
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
