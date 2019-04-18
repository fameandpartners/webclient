import React from 'react';
import { SiteVersion } from '@common/constants';
import { Helmet } from 'react-helmet';

const twitter = {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    'name': 'Fame and Partners',
    'url': 'http://www.fameandpartners.com',
    'sameAs': [
        'http://www.facebook.com/FameandPartners',
        'http://www.twitter.com/fameandpartners',
        'http://www.instagram.com/fameandpartners',
        'http://www.youtube.com/user/fameandpartners',
        'http://www.pinterest.com/fameandpartners'
    ]
};

interface Props {
    siteVersion: SiteVersion;
}

class BaseMetaTags extends React.PureComponent<Props> {
    public render() {
        const { siteVersion } = this.props;

        return (
            <React.Fragment>
                <Helmet
                    titleTemplate="%s | Fame &amp; Partners"
                    defaultTitle="Custom clothing, made-to-order. No mass production. Less waste. We're more than just a pretty dress."
                >
                    <script type="application/ld+json">{JSON.stringify(twitter)}</script>

                    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
                    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />
                    <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png" />
                    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
                    <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
                    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
                    <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
                    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
                    <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
                    <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
                    <link rel="icon" type="image/png" href="/favicon-194x194.png" sizes="194x194" />
                    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
                    <link rel="icon" type="image/png" href="/android-chrome-192x192.png" sizes="192x192" />
                    <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
                    <link rel="manifest" href="/manifest.json" />
                    <meta name="msapplication-TileColor" content="#eeddf0" />
                    <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
                    <meta name="theme-color" content="#eeddf0" />

                    <meta content="Fame and Partners" property="og:site_name" />
                    <meta content="bca305b234684f817b52dc0131747eb6" name="p:domain_verify" />

                    <meta httpEquiv="content-language" content={siteVersion} />
                    <html lang={siteVersion} />
                    <meta content="591959187490267" property="fb:app_id" />
                    <meta name="google-site-verification" content="ASqjutBTF0pN4o6WbzPc3jV09WW2hkokCPqmVHWp1uo" />
                    <meta name="google-site-verification" content="j2cSSdzGd0URLwb0C4i2aOGD5MBbD1249e2mV3OV3OY" />
                    <meta name="p:domain_verify" content="183a21eda60cbcbb6bb8fbd367897fc8"/>
                    <meta name="msvalidate.01" content="CBAB38EE3DA1B1ED6FBC59A3C8D78614" />
                    <meta name="msvalidate.01" content="704CD87A95276DC777B970ADF16EEB30" />
                    
                    <meta name="robots" content="noindex, nofollow" />
                </Helmet>
            </React.Fragment>
        );
    }
}

export default BaseMetaTags;