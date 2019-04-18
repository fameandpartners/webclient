import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import Header from './Header';
import { SiteVersion } from '@common/constants';
import { DeepPartial } from '@typings';
import { CmsPageGlobalConfig } from '@components/cms/CmsPageGlobalConfig';

const openCart = () => null;

const siteConfig: DeepPartial<CmsPageGlobalConfig> = {
    footerNavigation: [
        {
            type: 'linkList',
            title: 'Header Pane 1',
            sections: [
                {
                    type: 'linkListSection',
                    title: 'Section 1',
                    links: [
                        {
                            type: '_linkListItem',
                            title: 'About Us',
                            url: '/about'
                        },
                        {
                            type: '_linkListItem',
                            title: 'Contact Us',
                            url: '/contact'
                        },
                        {
                            type: '_linkListItem',
                            title: 'FAQs',
                            url: '/faqs'
                        },
                    ]
                },
                {
                    type: 'linkListSection',
                    title: 'Section 2',
                    links: [
                        {
                            type: '_linkListItem',
                            title: 'Size Guide',
                            url: '/size-guide'
                        },
                        {
                            type: '_linkListItem',
                            title: 'Privacy Policy',
                            url: '/privacy'
                        },
                        {
                            type: '_linkListItem',
                            title: 'Terms',
                            url: '/terms'
                        },
                        {
                            type: '_linkListItem',
                            title: 'Returns Policy',
                            url: '/faqs#panel-delivery'
                        }
                    ]
                }
            ]
        }
    ]
};

storiesOf('Layout/Header', module)
    .add('Australian Header', () => (
        <Header pageConfig={siteConfig as any} user={null} cartItemCount={0} openShoppingCart={openCart} />
    ))
    .add('Header Logged in', () => (
        <Header pageConfig={siteConfig as any} user={{id: 1, firstName: 'Test User', lastName: 'Smith', email: 'test@example.com', isAdmin: false}} cartItemCount={0} openShoppingCart={openCart} />
    ));
