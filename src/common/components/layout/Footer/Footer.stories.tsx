import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import Footer from './Footer';
import { SiteVersion } from '@common/constants';
import { CmsPageGlobalConfig } from '@components/cms/CmsPageGlobalConfig';
import { DeepPartial } from 'redux';

const siteConfig: DeepPartial<CmsPageGlobalConfig> = {
    footerNavigation: [
        {
            type: 'linkList',
            title: 'Footer',
            sections: [
                {
                    type: 'linkListSection',
                    title: 'Footer',
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

storiesOf('Layout/Footer', module).add('Footer', () => (
    <Footer
        siteVersion={SiteVersion.US}
        pageConfig={siteConfig as any}
        changeSiteVersion={(version) => action('chaging site version')}
    />
));
