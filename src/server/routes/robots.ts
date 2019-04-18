import { inferSiteVersionFromHost } from '@common/rematch/models/site-version';
import express from 'express';
import { getUrlForSiteVersion } from '@common/utils/url-helper';
import { getRealHost } from '../http';

export async function handleRobots(req: express.Request, res: express.Response) {
    const siteVersion = inferSiteVersionFromHost(getRealHost(req));
    res.type('application/text');

    if (!global.__FAME_CONFIG__.ROBOTS_INDEX) {
        res.send(`# See http://www.robotstxt.org/wc/norobots.html for documentation on how to use the robots.txt file

User-Agent: *
Disallow: /

        `);
    } else {
        res.send(`# See http://www.robotstxt.org/wc/norobots.html for documentation on how to use the robots.txt file

User-agent: *
Disallow: /checkout
Disallow: /cart
Disallow: /orders
Disallow: /account
Disallow: /au/fb_auth
Disallow: /us/fb_auth
Disallow: /fb_auth
Disallow: /return
Disallow: /spree_user/sign_in
Disallow: /user/auth/facebook
Disallow: /api
Disallow: /admin
Disallow: /fame_admin
Disallow: /user_cart


Sitemap: ${getUrlForSiteVersion(siteVersion, '/sitemap.xml')}`);

    }
}