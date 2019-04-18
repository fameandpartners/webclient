import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Accordion from './Accordion';

storiesOf('Base', module)
    .add('Accordion', () => (
        <div>
            <style jsx>{`
                div {
                    max-width: 600px;
                    margin: 40px;

                }


            `}</style>

            <div>
                <h4>Closed Accordion</h4>
                <Accordion title={'Closed'}>Closed Accordion</Accordion>
            </div>

            <div>
            <h4>Open Accordion</h4>
                <Accordion title={'Open'} openOnLoad>Some Data in the accordion</Accordion>
            </div>

            <div>
            <h4>Closed Accordion with Side Title</h4>
                <Accordion title={'Side'} sideTitle={'Side Title'}>Some Data in the accordion</Accordion>
            </div>

        </div>
    ));