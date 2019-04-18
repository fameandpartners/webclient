import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import FilterGroup from './FilterGroup';

const items = {
    'Base': (
        <FilterGroup 
            title={'Base'}
            options={[
                {
                    title: 'Item',
                    value: 'item-value',
                    openOnLoad: false,
                    children: [
                        {
                            name: 'Child 1',
                            value: 'child-1',
                            selected: false,
                            disabled: false,
                        }
                    ]
                }
            ]}
            onSelected={() => null}
            resetFilters={() => null}
        />
    ),
    'Selected Child': (
        <FilterGroup 
            title={'Selected Item'}
            options={[
                {
                    title: 'Item',
                    value: 'item-value',
                    openOnLoad: false,
                    children: [
                        {
                            name: 'Child 1',
                            value: 'child-1',
                            disabled: false,
                            selected: true,
                        }
                    ]
                }
            ]}
            onSelected={() => null}
            resetFilters={() => null}
        />
    ),
    'Disabled': (
        <FilterGroup 
            title={'Selected Item'}
            options={[
                {
                    title: 'Item',
                    value: 'item-value',
                    openOnLoad: false,
                    children: [
                        {
                            name: 'Child 1',
                            value: 'child-1',
                            disabled: false,
                            selected: true,
                        },
                        {
                            name: 'Child 2',
                            value: 'child-2',
                            disabled: true,
                            selected: false,
                        }
                    ]
                }
            ]}
            onSelected={() => null}
            resetFilters={() => null}
        />
    ),
};

storiesOf('Search', module).add('FilterGroup', () => (
    <table>
        <style jsx>{` td:first-child { width: 200px } td:last-child { min-width: 400px } `}</style>
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
