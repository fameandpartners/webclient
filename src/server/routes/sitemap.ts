import { inferSiteVersionFromHost } from '@common/rematch/models/site-version';
import { getRealHost } from '../http';
import FameAPI from '@common/services/fameApi';
import { getUrlForSiteVersion } from '@common/utils/url-helper';
import { SiteVersion } from '@common/constants';
import ServerContentfulService from '../services/ServerContentfulService';
import { CmsCategoryPage } from '@components/cms/CategoryPage';
import { CmsPageContainer } from '@components/cms/PageContainer';
import express from 'express';
import NodeCache from 'node-cache';
import xml from 'xml';

function formatSitemap(urls: string[], siteVersion: SiteVersion) {
    const response = {
        urlset: [
            {
                _attr: { 
                    'xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
                    'xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
                },
            },
            ...urls.map((url) => (
                {
                    url: [
                        { loc: getUrlForSiteVersion(siteVersion, url) }, 
                        ...Object.values(SiteVersion).map((sv) => ({ 
                            'xhtml:link': {
                                _attr: {
                                    rel: 'alternate',
                                    hreflang: sv,
                                    href: getUrlForSiteVersion(sv, url)
                                }
                            }
                        }))
                    ]
                }
            ))
        ]
    };
    return xml(response, { declaration: true });
}

export async function handleSitemap(req: express.Request, res: express.Response) {
    const siteVersion = inferSiteVersionFromHost(getRealHost(req));

    const siteMaps = [
        '/_webclient/sitemap/pdp.xml',
        '/_webclient/sitemap/plp.xml',
        '/_webclient/sitemap/cms.xml'
    ];

    const response = {
        sitemapindex: [
            {
                _attr: { 
                    'xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
                    'xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
                },
            },
            ...siteMaps.map((url) => (
                {
                    sitemap: [
                        { loc: getUrlForSiteVersion(siteVersion, url) }
                    ]
                }
            ))
        ]
    };

    res.type('application/xml');
    res.send(xml(response));
}

export async function handlePDPSitemap(req: express.Request, res: express.Response) {
    const siteVersion = inferSiteVersionFromHost(getRealHost(req));
    const fameApi = new FameAPI(siteVersion);
    const products = await fameApi.getDocumentFromSpree({pageSize: 10000, useSpree: true, returnFacets: false, boostPids: [], boostFacets: []});
    
    const urls = products.results
        .map((p) => p.url)
        .notNullOrUndefined();

    res.type('application/xml');
    res.send(formatSitemap(urls, siteVersion));
}

export const handlePLPSitemap = (cache: NodeCache) => async (req: express.Request, res: express.Response) => {
    const service = new ServerContentfulService(cache);
    const siteVersion = inferSiteVersionFromHost(getRealHost(req));
    const plps = await service.getEntriesByField<CmsCategoryPage, 'pageIndex'>('pageIndex', true, 'categoryPage', false, null, siteVersion);
    const urls = plps
        .map((p) => p.slug);

    res.type('application/xml');
    res.send(formatSitemap(urls, siteVersion));
};

export const handleCMSSitemap = (cache: NodeCache) => async (req: express.Request, res: express.Response) => {
    const service = new ServerContentfulService(cache);
    const siteVersion = inferSiteVersionFromHost(getRealHost(req));
    const pages = await service.getEntriesByField<CmsPageContainer, 'pageIndex'>('pageIndex', true, 'page', false, null, siteVersion);
    const urls = pages
        .map((p) => p.url);

    res.type('application/xml');
    res.send(formatSitemap(urls, siteVersion));
};