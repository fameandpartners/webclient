import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import DressFinderCard from '@components/product/DressFinderCard';

const items = {
    'Base (Rect)' : (
        <DressFinderCard 
            onClick={action('On card click')}
            title={'Open / Bare'}
            subtitle={'Fitted through the waist and flaring at the hips.'}
            image={{
                type: 'photo',
                src: [
                    {
                        url: 'https://graceloveslace.com.au/wp-content/uploads/2017/04/Emanuela_nude-1-1067x1600.jpg',
                        width: 200,
                        height: 320,
                    }
                ],
                sortOrder: 1,
                options: [],
            }}
            isSelected={false}
        />
    ),
    'Selected (Rect)': (
        <DressFinderCard 
            onClick={action('On card click')}
            title={'Open / Bare'}
            subtitle={'Fitted through the waist and flaring at the hips.'}
            image={{
                type: 'photo',
                src: [
                    {
                        url: 'https://graceloveslace.com.au/wp-content/uploads/2017/04/Emanuela_nude-1-1067x1600.jpg',
                        width: 200,
                        height: 320,
                    }
                ],
                sortOrder: 1,
                options: [],
            }}
            isSelected
        />
    ),
    'Base (Sqaure)' : (
        <DressFinderCard 
            onClick={action('On card click')}
            title={'Open / Bare'}
            image={{
                type: 'photo',
                src: [
                    {
                        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkBZadPzn-KVcnDgFCo-bXjCRMW1dqIO4689GC04spEC33S92P',
                        width: 200,
                        height: 320,
                    }
                ],
                sortOrder: 1,
                options: [],
            }}
            isSelected={false}
        />
    ),
    'Selected (Square)': (
        <DressFinderCard 
            onClick={action('On card click')}
            title={'Open / Bare'}
            image={{
                type: 'photo',
                src: [
                    {
                        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkBZadPzn-KVcnDgFCo-bXjCRMW1dqIO4689GC04spEC33S92P',
                        width: 200,
                        height: 320,
                    }
                ],
                sortOrder: 1,
                options: [],
            }}
            isSelected
        />
    ),
};

storiesOf('Components/Product', module)
    .add('DressFinderCard', () => (
        <table>
            <style jsx>{` td:first-child { width: 200px } td:last-child { width: 200px } `}</style>
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