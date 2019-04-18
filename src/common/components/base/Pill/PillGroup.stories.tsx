import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import PillGroup from './PillGroup';
import Pill from '@components/base/Pill/Pill';

const items = {
  'PillGroup': <PillGroup><Pill title={'Active Pill'} active /><Pill title={'Inactive Pill'} active={false} /></PillGroup>,
  'PillGroup no borders': <PillGroup><Pill title={'Active Pill'} active borderless /><Pill title={'Inactive Pill'} active={false} borderless /></PillGroup>,
  'PillGroup (vertical)': <PillGroup vertical><Pill title={'Active Pill'} active /><Pill title={'Inactive Pill'} active={false} /></PillGroup>,
  'PillGroup (vertical) borderless': <PillGroup vertical><Pill title={'Active Pill'} active borderless /><Pill title={'Inactive Pill'} active={false} borderless /></PillGroup>,
};

storiesOf('Base', module).add('PillGroup', () => (
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
