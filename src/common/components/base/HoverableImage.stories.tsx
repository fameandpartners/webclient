import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import HoverableImage from './HoverableImage';

const items = {
    'Standard Image + GIF': (
        <HoverableImage>
            <img src={'https://www.google.com/logos/doodles/2018/lyudmila-rudenkos-114th-birthday-5392731118501888.2-l.png'} />
            <img src={'https://www.google.com/logos/doodles/2015/google-gameday-doodle-4-6521809350426624.2-hp2x.gif'} />
        </HoverableImage>
    ),
};

storiesOf('Base', module).add('HoverableImage', () => (
    <table>
        <style jsx>{` td:first-child { width: 200px } td:last-child { position: relative; width: 200px; height: 100px; } `}</style>
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
