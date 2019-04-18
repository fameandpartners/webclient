import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

const InstagramIcon = require('@svg/i-instagram.svg').default;
const FacebookIcon = require('@svg/i-facebook.svg').default;
const TwitterIcon = require('@svg/i-twitter.svg').default;
const PinterestIcon = require('@svg/i-pinterest.svg').default;
const TumblrIcon = require('@svg/i-tumblr.svg').default;
const PolyvoreIcon = require('@svg/i-polyvore.svg').default;

export default class SocialLinks extends PureComponent {
    public render() {
        const icons = [
            {
                name: 'Facebook',
                url: 'https://www.facebook.com/FameandPartners',
                icon: <FacebookIcon style={{ width: 16, height: 16 }} />
            },
            {
                name: 'Instagram',
                url: 'https://instagram.com/FameandPartners',
                icon: <InstagramIcon style={{ width: 16, height: 16 }} />
            },
            {
                name: 'Twitter',
                url: 'https://twitter.com/FameandPartners',
                icon: <TwitterIcon style={{ width: 16, height: 16 }} />
            },
            // {
            //   url: 'https://www.pinterest.com/fameandpartners',
            //   icon: <PinterestIcon style={{ width: 24, height: 24 }} />
            // },
            // {
            //   url: 'http://fameandpartners.tumblr.com/',
            //   icon: <TumblrIcon style={{ width: 24, height: 24 }} />
            // },
            // {
            //   url: 'http://fameandpartners.polyvore.com/',
            //   icon: <PolyvoreIcon style={{ width: 24, height: 24 }} />
            // }
        ];

        return (
            <div className="container">
                <style jsx>{`
                    @import 'vars';
                    .container {
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        @include text-style-navigation-item;
                        font-size: 12px;
                    }

                    a {
                        margin-right: 4 * $space-base;

                        &:first-of-type {
                            margin-left: 4 * $space-base;
                        }

                        &:last-of-type {
                            margin-right: 0;
                        }
                    }
                `}</style>

                <FormattedMessage id={'SocialLinks.Title'} defaultMessage={'Follow Us:'} /> &nbsp;
                {icons.map(({ url, icon, name }) => (
                    <a target="_blank" rel="noopener noreferrer" href={url} key={url} aria-label={name}>
                        {icon}
                    </a>
                ))}
            </div>
        );
    }
}
