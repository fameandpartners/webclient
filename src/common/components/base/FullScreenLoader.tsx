import React from 'react';
import Spinner from '@components/base/Spinner';

const FullScreenLoader: React.SFC = () => (
    <div className={'FullScreenLoader'}>
        <style jsx>{`

            :global(html) {
                overflow: hidden;
            }
            
            .FullScreenLoader {
                display: flex;

                width: 100vw;
                height: 100vh;

                justify-content: center;
                align-items: center;
            }
        `}</style>
        <Spinner color={'grey79'} width={64} height={64} />
    </div>
);

export default FullScreenLoader;