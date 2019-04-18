import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import Spinner from '@components/base/Spinner';

const items = {
    'White Spinner': <div style={{ backgroundColor: 'black', padding: 16 }}><Spinner width={100} height={100} color={'white'} /></div>,
    'Black Spinner': <Spinner width={100} height={100} color={'black'} />,
    'Grey47 Spinner': <Spinner width={100} height={100} color={'grey79'} />,
    'Grey60 Spinner': <Spinner width={100} height={100} color={'grey60'} />,
    'Grey79 Spinner': <Spinner width={100} height={100} color={'grey79'} />,
};

storiesOf('Base', module)
    .add('Spinner', () => (
        <table>
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