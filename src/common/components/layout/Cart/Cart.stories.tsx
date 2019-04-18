import React from 'react';
import { storiesOf } from '@storybook/react';
import Cart from '@components/layout/Cart/Cart';
import CartEmpty from '@components/layout/Cart/CartEmpty';
import { action } from '@storybook/addon-actions';
import { SiteVersion, HeightUnitType } from '@common/constants';
import configureStore from '@common/rematch';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { Order } from '@typings';

const cartData = {
    itemsTotal: 24900,
    shippingTotal: 1000,
    promoTotal: 0,
    total: 25900,
    items: [
        {
            cartLineId: 454413,
            product: {
                title: 'Some Dress',
                productId: '1',
                url: '/',
                groups: [
                    { title: 'Fabric & Color', sectionGroups: [{ sections: [{ options: [{ code: '102-1011' }] }] }] },
                ]
            },
            price: 24900,
            height: 155,
            heightUnit: HeightUnitType.CM,
            productImage: 'https://d3m99ch6bfu0n9.cloudfront.net/FPG1003/FrontNone/704x704/1011~102~B28~C1~MN~T0~T67~T86.png',
            components: [
                {
                    title: 'Berry Heavy Georgette',
                    code: '102-1011',
                    componentTypeCategory: 'ColorAndFabric',
                    price: 0,
                    sortOrder: 0,
                    meta: {}
                }
            ],
            type: 'product',
        }
    ],
};

const store = configureStore(undefined);

storiesOf('Layout/Cart', module)
    .addDecorator((story) => <Provider store={store}>{story()}</Provider>)
    .add('with items', () => <Cart cart={cartData as any as Order} siteVersion={SiteVersion.AU} removeFromCartAsync={() => action('remove item')} closeCart={() => action('close cart')} isRemovingList={[]} isErrorRemovingList={[]}/>)
    .add('empty', () => <CartEmpty closeCartDrawer={() => null}/>);
