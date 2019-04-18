import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import CurrencyAmount from './CurrencyAmount';

const items = {
  'Cent Amount (999999)': <CurrencyAmount value={999999} />,
  'Cent Amount (999999) hide sign': <CurrencyAmount value={999999} hideSign />,
  'Cent Amount (999999) hide decimal': <CurrencyAmount value={999999} hideDecimalIfDollarAmount />,
};

storiesOf('Base', module).add('CurrencyAmount', () => (
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
