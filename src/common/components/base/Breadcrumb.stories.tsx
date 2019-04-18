import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Breadcrumb from './Breadcrumb';

const items = {
    Breadcrumb: <Breadcrumb paths={[ { title: 'Path 1 - Inactive', url: '/', isActive: false }, { title: 'Path 2 - Active', url: '/', isActive: true } ]} />,
};

storiesOf('Base', module).add('Breadcrumb', () => (
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
