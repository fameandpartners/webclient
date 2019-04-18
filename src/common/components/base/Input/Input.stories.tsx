import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Input from './Input';
import Checkbox from '@components/base/Input/Checkbox';
import Select from '@components/base/Input/Select';
import Dropdown from '@components/base/Input/Dropdown';
import Toggle from '@components/base/Input/Toggle';
import Radio from '@components/base/Input/Radio';

const components = {
    'Text input': <Input />,
    'Text input with label': <Input label="My label" />,
    'Text input (with error)': <Input label="Error label" error={true} inlineError="This is the error message" />,
    'Text input (with meta)': <Input label="Meta label" inlineMeta="This is some helpful information" />,
    'Text input (with placeholder)': <Input label="Placeholder label" placeholder="This is some placeholder text" />,
    'Select': <Select options={[{ name: 'AU', value: 'au' }, { name: 'US', value: 'us' }]} />,
    'Checkbox': <Checkbox checked={false} />,
    'Checkbox (checked)': <Checkbox label={'I am checked'} checked={true} />,
    'Checkbox with label': <Checkbox label={'I am a label'} checked={false} />,
    'Dropdown': (
        <Dropdown
            onSelect={() => action('Selected dropdown option')}
            onSelectOptionGroup={() => action('option group selected')}
            selected={null}
            optionGroups={[
                {
                    title: 'US',
                    value: 'us',
                    options: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30].map((n) => ({
                        name: `US ${n}`,
                        value: `${n}`
                      }))
                },
                {
                  title: 'AU',
                  value: 'au',
                  options: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30].map((n) => ({
                    name: `AU ${n}`,
                    value: `${n}`
                  }))
              }
            ]}
        />
    ),
    'Dropdown single group': (
        <Dropdown
            onSelect={() => action('Selected dropdown option')}
            onSelectOptionGroup={() => action('option group selected')}
            selected={null}
            optionGroups={[
                {
                    title: 'US',
                    value: 'us',
                    options: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30].map((n) => ({
                        name: `US ${n}`,
                        value: `${n}`
                      }))
                }
            ]}
        />
    ),
    'Toggle': <Toggle onToggle={() => null} />,
    'Toggle with left title': <Toggle onToggle={() => null} leftTitle={'cm'} />,
    'Toggle with right title': <Toggle onToggle={() => null} rightTitle={'in'} />,
    'Toggle with both title': <Toggle onToggle={() => null} leftTitle={'cm'} rightTitle={'in'} />,
    'Radio': <Radio />,
    'Radio with label': <Radio label={'Hello I am radio button'} />
};

storiesOf('Base', module).add('Input', () => (
    <table>
        <style jsx>{` td:first-child { width: 200px } `}</style>
        <tbody>
            {Object.entries(components).map(([text, component]) => (
                <tr key={text}>
                    <td>{text}</td>
                    <td>{component}</td>
                </tr>
            ))}
        </tbody>
    </table>
));
