import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { SiteVersion } from '@common/constants';
import GalleryModal from '@components/gallery-modal/GalleryModal';
import { PreviewType } from '@common/utils/preview-type';
import { DeepPartial, CustomizedProduct } from '@typings';
import { Provider } from 'react-redux';
import configureStore from '@common/rematch';

const customizedProduct: DeepPartial<CustomizedProduct> = {
    components: [],
    product: {
        media: [
            {
                id: 1,
                type: 'photo',
                src: [
                    {
                        name: 'Royal Wedding 2018',
                        url: 'https://www.google.com/logos/doodles/2018/royal-wedding-2018-5806028573638656.3-2x.jpg',
                        width: 200,
                        height: 200,
                    }
                ],
                sortOrder: 1,
                options: [1],
            },
            {
                id: 2,
                type: 'photo',
                src: [
                    {
                        name: 'Children Day 2018 (Taiwan)',
                        url: 'https://fakeimage.url.jpg',
                        fallbackUrl: 'https://www.google.com/logos/doodles/2018/childrens-day-2018-taiwan-4669667200204800-2x.png',
                        width: 200,
                        height: 200,
                    }
                ],
                sortOrder: 1,
                options: [],
            }
        ],
        components: [],
        previewType: PreviewType.Image,
    }
};

const store = configureStore(undefined);

storiesOf('Modal/Gallery', module)
    .addDecorator((story) => <Provider store={store}>{story()}</Provider>)
    .add('Basic', () => (
        <GalleryModal
            customizedProduct={customizedProduct as CustomizedProduct}
            position={0}
            siteVersion={SiteVersion.US}

            goToGallery={() => null}
            goToProductPage={() =>  null}
        />
    ));
