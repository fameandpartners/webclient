import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import SkeletonLoader from '@components/animation/SkeletonLoader';
import SlideInOutTransition from '@components/animation/SlideInOutTransition';
import FadeInOutTransition from '@components/animation/FadeInOutTransition';
import ExpandTransition from '@components/animation/ExpandTransition';
import ZoomInTransition from '@components/animation/ZoomInTransition';

const items = {
    'Skeleton Loader': <SkeletonLoader width={'100px'} height={'100px'} isLoading={true} />,
    'Skeleton Loader with custom style': <SkeletonLoader width={'100px'} height={'10px'} extraStyles={{ borderRadius: 4 }} isLoading={true} />,
    'Slide - Left': <SlideInOutTransition slideInFrom={'left'} isVisible loop>I slide in from the left!</SlideInOutTransition>,
    'Slide - Top': <SlideInOutTransition slideInFrom={'top'} isVisible loop>I slide in from the top!</SlideInOutTransition>,
    'Fade': <FadeInOutTransition isVisible loop>I fade in and out!</FadeInOutTransition>,
    'Expand': <div className={'expander'}><ExpandTransition isVisible loop>I can expand!</ExpandTransition></div>,
    'ZoomIn': <ZoomInTransition isVisible loop>I can zoom!</ZoomInTransition>,
};

storiesOf('Animation', module)
    .add('Examples', () => (
        <table>
            <style jsx>{` 
                td:first-child { width: 400px } 
                :global(.expander .transition-container) { overflow: hidden; white-space: nowrap; }
            `}</style>
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
