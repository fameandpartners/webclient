import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import OptionCard from '@components/product/OptionCard';

const items = {
    Base: (
        <OptionCard
            title={'Option Card'}
            image={{
                type: 'photo',
                src: [
                    {
                        url: 'https://static.appvn.com/a/uploads/thumbnails/112015/mr-square_icon.png',
                        width: 200,
                        height: 200,
                    }
                ],
                sortOrder: 1,
                options: [],
            }}
            color={null}
            isSelected={false}
        />
    ),
    Selected: (
        <OptionCard
            title={'Option Card'}
            image={{
                type: 'photo',
                src: [
                    {
                        url: 'https://static.appvn.com/a/uploads/thumbnails/112015/mr-square_icon.png',
                        width: 200,
                        height: 200,
                    }
                ],
                sortOrder: 1,
                options: [],
            }}
            color={null}
            isSelected={true}
        />
    )
};

storiesOf('Components/Product', module)
    .add('OptionCard', () => (
        <table>
            <style jsx>{` td:first-child { width: 200px } td:last-child { width: 200px } `}</style>
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