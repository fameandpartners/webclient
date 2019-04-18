import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import GroupHeaderTitles from './GroupHeaderTitles';
import { SectionGroup } from 'typings/product';

const sectionGroups: Array<Partial<SectionGroup>> = [
    { title: 'Header 1', slug: 'header-1' },
    { title: 'Header 2', slug: 'header-2' }
];

const items = {
    'Two Title - First Active': <GroupHeaderTitles sectionGroups={sectionGroups as SectionGroup[]} currentSectionGroup={sectionGroups[0] as SectionGroup} goTo={() => null} />,
    'Two Title - Second Active': <GroupHeaderTitles sectionGroups={sectionGroups as SectionGroup[]} currentSectionGroup={sectionGroups[1] as SectionGroup} goTo={() => null} />,
};

storiesOf('Components/Customization/GroupHeaderTitles', module)
    .add('Titles', () => (
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
