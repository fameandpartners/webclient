import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import TabGroup from './TabGroup';
import Tab from '@components/base/Tab/Tab';

const items = {
    TabGroup: (
        <TabGroup
            tabTitles={[
                {
                    title: ' Tab Active',
                    value: '1'
                },
                {
                    title: 'Tab Inactive',
                    value: '2'
                }
            ]}
            activeTab={'1'}
        >
            <Tab isActive>Hello I am the content of the active tab</Tab>
            <Tab isActive={false}>Tab Inactive</Tab>
        </TabGroup>
    )
};

storiesOf('Base', module).add('TabGroup', () => (
    <table>
        <style jsx>{` td:first-child { width: 200px } `}</style>
        <tbody>
            {Object.entries(items).map(([text, item]) => (
                <tr key={text}>
                    <td><strong>{text}</strong></td>
                    <td>{item}</td>
                </tr>
            ))}
        </tbody>
    </table>
));
