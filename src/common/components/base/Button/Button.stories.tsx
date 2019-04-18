import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Button from './Button';

const buttons = {
  'Button (primary)': <Button>Hey I am a button</Button>,
  'Button (secondary)': <Button secondary={true}>Hey I am a button</Button>,
  'Button (normal case)': <Button normalCase>Hey I am a button</Button>,
  'Button (link)': <Button url="#button">Hey I am a button</Button>,
  'Button (fullwidth)': <Button fullwidth={true}>Hey I am a button</Button>,
  'Button (tertiary)': <Button tertiary={true}>Hey I am a button</Button>,
  'Button (quaternary)': <Button quaternary={true}>Hey I am a button</Button>,
  'Button (spinner)': <Button spinner={true}>Hey I am a button</Button>,
  'Button (transparent)': <Button transparent={true}>Hey I am a button</Button>,
  'Button (transparentBlack)': <Button transparentBlack={true}>Hey I am a button</Button>,
  'Button (inline)': <Button inline={true}>Hey I am a button</Button>,
  'Button (slim)': <Button slim={true}>Hey I am a button</Button>,
  'Button (empty)': <Button empty={true}>Hey I am a button</Button>,
  'Button (disabled)': <Button disabled={true}>Hey I am a button</Button>,
  'Button (noHover)': <Button noHover={true}>Hey I am a button</Button>,
  'Button (noBorder)': <Button noBorder={true}>Hey I am a button</Button>,
  'Button (error)': <Button error={true}>Hey I am a button</Button>,
  'Button (error) with text': <Button error={true} errorText={'Hey I am an error text'}>Hey I am a button</Button>,
};

storiesOf('Base', module).add('Button', () => (
  <table>
    <style jsx>{` td:first-child { width: 200px } `}</style>
    <tbody>
      {Object.entries(buttons).map(([text, button]) => (
        <tr key={text}>
          <td>{text}</td>
          <td>{button}</td>
        </tr>
      ))}
    </tbody>
  </table>
));
