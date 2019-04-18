import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import ErrorPage from './ErrorPage';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from '@common/rematch';

const items = {
    'Error (401)': <ErrorPage type={401} />,
    'Error (404)': <ErrorPage type={404} />,
    'Error (500)': <ErrorPage type={500} />,
};

const store = configureStore(undefined);
​
storiesOf('Base', module)
.addDecorator((story) => <Provider store={store}>{story()}</Provider>)
.addDecorator((story) => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
))
.add('ErrorPage', () => (
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
