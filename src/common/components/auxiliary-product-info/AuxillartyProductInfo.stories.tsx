import React from 'react';
import { storiesOf } from '@storybook/react';
import AfterpayTeaser from '@components/auxiliary-product-info/AfterpayTeaser';
import ExpressMaking from '@components/auxiliary-product-info/ExpressMaking';
import ProductUnavailable from '@components/auxiliary-product-info/ProductUnavailable';
import { MemoryRouter } from 'react-router';

storiesOf('Components/AuxillartyProductInfo', module)
    .addDecorator((story) => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('After pay', () => <AfterpayTeaser total={99900} />)
    .add('Express Making', () => <ExpressMaking makingOption={{ meta: { deliveryTimeRange: '6 weeks' }} as any} isAvailable={true} />)
    .add('Product Unavailable', () => <ProductUnavailable dressTitle={'Goodbye Dress'} />);
