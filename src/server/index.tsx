import newrelic from 'newrelic';

import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { StaticRouter, matchPath } from 'react-router-dom';
import serialize from 'serialize-javascript';
import { flushToHTML } from 'styled-jsx/server';
import MobileDetect from 'mobile-detect';

import App from '@containers/App';
import LanguageProvider from '@containers/LanguageProvider';

import { translationMessages } from '@common/i18n';
import configureStore from '@common/rematch';
import FameAPI from '@services/fameApi';
import routes from '@containers/App/routes';
import errorhandler from 'errorhandler';
import morgan from 'morgan';
import { createFameConfig } from './config';
import compression from 'compression';
import expressStaticGzip from 'express-static-gzip';
import NodeCache from 'node-cache';
require('dotenv').config();
global.__FAME_CONFIG__ = createFameConfig();

import Raven from 'raven';
import { setUpRaven } from '@common/utils/error-reporting';
import { HttpStatus } from '@components/base/Http';
import { getRealHost, getRealProtocol } from './http';
setUpRaven(Raven);

import '@hellohuman/array-exts';
import ServerContentfulService from './services/ServerContentfulService';
import { inferSiteVersionFromHost } from '@common/rematch/models/site-version';
import { User } from '@typings';
import SiteVersionProvider from '@common/context/SiteVersionContext';
import UserProvider from '@common/context/UserContext';
import httpProxy from 'http-proxy';

import redirects from './redirects';
import { handlePDPSitemap, handlePLPSitemap, handleCMSSitemap, handleSitemap } from './routes/sitemap';
import { SiteVersion } from '@common/constants';
import { handleRobots } from './routes/robots';

let assets: any;
const syncLoadAssets = () => {
  assets = require(process.env.ASSETS_MANIFEST!);
};
syncLoadAssets();

const graphikWoff = require('@common/assets/fonts/Graphik-Light-Web.woff');
const graphikWoff2 = require('@common/assets/fonts/Graphik-Light-Web.woff2');
const graphikEot = require('@common/assets/fonts/Graphik-Light-Web.eot');

const server = express();
const cache = new NodeCache();

const proxyToSpree = httpProxy.createProxyServer({
  target: global.__FAME_CONFIG__.URLS[SiteVersion.US].api,
  ws: true,
  xfwd: true,
  secure: true
});

server
  .disable('x-powered-by')
  .set('trust proxy', true)
  .all(/.*/, (req, res, next) => {
    const realHost = getRealHost(req);
    const protocol = getRealProtocol(req);
    if (process.env.NODE_ENV === 'production' && realHost.startsWith('fameandpartners.com')) {
      res.redirect(HttpStatus.PermanentRedirect, `${protocol}://www.${realHost}${req.originalUrl}`);
      return;
    }
    next();
  })
  .use((req, res, next) => {
    const protocol = getRealProtocol(req);
    const realHost = getRealHost(req);
    if (protocol === 'http' && process.env.REDIRECT_TO_SSL === 'true' && req.url !== '/version') {
      res.redirect(HttpStatus.PermanentRedirect, `https://${realHost}${req.originalUrl}`);
      return;
    }

    next();
  })
  // Serve fingerprinted and compressed assets with cache header
  .use(
    '/static',
    expressStaticGzip(`${process.env.PUBLIC_DIR}/static`, {
      enableBrotli: true,
      fallthrough: false,
      maxAge: '1y',
      immutable: true
    })
  )
  // Serve  other non fingerprinted assets
  .use(express.static(process.env.PUBLIC_DIR!))
  .use(compression())
  .use(Raven.requestHandler())
  .use((req, res, next) => {
    if (req.url.includes('.au')) {
      console.log('url:' + req.url);
      console.log('base url:' + req.baseUrl);
      console.log('route:' + req.route.toString());
      // return res.redirect(301, req.url);
    }
    for (const redirect of redirects) {
      if (redirect.regex.test(req.url)) {
        return res.redirect(301, redirect.to);
      }
    }
    next();
  })
  .use(morgan('dev'))
  // TODO: move to file
  .all(/^\/checkout/, (req, res) => proxyToSpree.web(req, res))
  .all(/^\/admin/, (req, res) => proxyToSpree.web(req, res))
  .all(/^\/fame_admin/, (req, res) => proxyToSpree.web(req, res))
  .all(/^\/user_cart/, (req, res) => proxyToSpree.web(req, res))
  .all(/^\/orders\//, (req, res) => proxyToSpree.web(req, res))
  .all(/^\/api/, (req, res) => proxyToSpree.web(req, res))
  .all(/^\/assets/, (req, res) => proxyToSpree.web(req, res))
  .all(/^\/__better_errors/, (req, res) => proxyToSpree.web(req, res))
  .all(/^\/(us|au)/, (req, res) => proxyToSpree.web(req, res))
  .all(/^\/fb_auth/, (req, res) => proxyToSpree.web(req, res))
  .all(/^\/spree_user/, (req, res) => proxyToSpree.web(req, res))
  .all(/^\/user/, (req, res) => proxyToSpree.web(req, res))
  .all(/^\/rss/, (req, res) => proxyToSpree.web(req, res))
  .all(/^\/shipments_update/, (req, res) => proxyToSpree.web(req, res))
  .all(/^\/paypal/, (req, res) => proxyToSpree.web(req, res))
  .all(/^\/quadpay/, (req, res) => proxyToSpree.web(req, res))
  .all(/^\/afterpay/, (req, res) => proxyToSpree.web(req, res))
  .use((req, res, next) => {
    req.url = decodeURI(req.url);
    next();
  })
  .get('/version', (req: express.Request, res: express.Response, next) => {
    newrelic.setIgnoreTransaction(true);

    res.json({
      sha: process.env.CIRCLE_SHA1 || 'unknown',
      branch: process.env.CIRCLE_BRANCH || 'unknown',
      build: process.env.CIRCLE_BUILD_NUM || 'unknown'
    });
  })
  .get('/_webclient/cache', (req, res, next) => {
    res.json(cache.stats);
  })
  .delete('/_webclient/cache', (req, res, next) => {
    cache.flushAll();
    res.json({
      status: 'OK'
    });
  })
  .get('/_webclient/widgetGlobalElements.js', (req, res, next) => {
    res.redirect(HttpStatus.TemporaryRedirect, assets.widgetGlobalElements.js);
  })
  .get('/_webclient/vendor.chunk.js', (req, res, next) => {
    res.redirect(HttpStatus.TemporaryRedirect, assets.vendor.js);
  })
  .get('/robots.txt', handleRobots)
  .get('/sitemap.xml', handleSitemap)
  .get('/_webclient/sitemap/pdp.xml', handlePDPSitemap)
  .get('/_webclient/sitemap/plp.xml', handlePLPSitemap(cache))
  .get('/_webclient/sitemap/cms.xml', handleCMSSitemap(cache))
  .get('/_webclient/cms/entry', async (req: express.Request, res: express.Response, next) => {
    try {
      const id: string | null = req.query && req.query.id;
      const field: string | null = req.query && req.query.field;
      const value: string | null = req.query && req.query.value;
      const contentType: string | null = req.query && req.query.contentType;
      const isPreview = 'true' === (req.query && req.query.isPreview);
      const siteVersion = (req.query && req.query.siteVersion) || inferSiteVersionFromHost(getRealHost(req));

      const service = new ServerContentfulService(cache);

      let user: User | null = null;
      if (isPreview) {
        const cookies = req.header('cookie'); // note: req.cookies didn't work
        const fameApi = new FameAPI(siteVersion);
        user = (await fameApi.fetchUserCartDetails(cookies)).user;
      }

      if (id) {
        const data = await service.getEntryById(id, isPreview, user, siteVersion);
        res.send(data);
      } else if (field && value && contentType) {
        const data = await service.getEntryByField<any, any>(field, value, contentType, isPreview, user, siteVersion);
        res.send(data);
      } else {
        res.sendStatus(422);
        res.send('invalid params');
      }
    } catch (e) {
      next(e);
    }
  })
  .get('/*', async (req: express.Request, res: express.Response, next) => {
    try {
      const context: { statusCode?: HttpStatus; url?: string } = {};
      const isPreview = req.query && 'preview' in req.query;

      // Create a new Redux store instance
      const store = configureStore(undefined);

      store.dispatch.SiteVersion.inferSiteVersion(getRealHost(req));
      store.dispatch.CmsModel.setContentfulService(new ServerContentfulService(cache));

      const ua = (req.headers['user-agent'] || req.headers['User-Agent']) as string;
      const md = new MobileDetect(ua);

      // Inject a fake width based on if the UA is mobile or desktop for initial SSR page
      store.dispatch.ResponsiveWidthModel.update(!md.mobile() ? 1600 : 400);

      // Fire actions
      const fameApi = new FameAPI(store.getState().SiteVersion);

      // Fetch cart details and inject it as part of the preloaded state
      const cookies = req.header('cookie'); // note: req.cookies didn't work

      if (!global.__FAME_CONFIG__.FLAGS.MAINTENANCE_MODE) {
        const loadPromises = [];

        const loadCart = async () => {
          const { user, cart } = await fameApi.fetchUserCartDetails(cookies);
          store.dispatch.CartModel.update({ order: cart });
          if (user) {
            store.dispatch.UserModel.update(user);
          }
        };
        loadPromises.push(loadCart());

        const loadCmsGlobalPageConfig = async () => {
          await store.dispatch.CmsModel.loadGlobalPageConfig({ isPreview } as any);
        };
        loadPromises.push(loadCmsGlobalPageConfig());

        for (const route of routes) {
          const match = matchPath(req.path, route);
          if (match !== null) {
            newrelic.setTransactionName(route.path);

            if (route.loadData) {
              loadPromises.push(route.loadData(store.dispatch as any, store.getState, match.params, req.url, cookies));
            }
            break;
          }
        }

        await Promise.all(loadPromises);
      }

      // Grab the initial state from our Redux store
      store.dispatch.CmsModel.setContentfulService(null!);
      const finalState = store.getState();

      const app = (
        <Provider store={store}>
          <LanguageProvider messages={translationMessages}>
            <UserProvider>
              <SiteVersionProvider>
                <StaticRouter context={context} location={req.url}>
                  <App />
                </StaticRouter>
              </SiteVersionProvider>
            </UserProvider>
          </LanguageProvider>
        </Provider>
      );

      const reactApp = renderToString(app);
      const helmet = Helmet.renderStatic();
      const styles = flushToHTML();
      const fonts = `
                    <style>
                        @font-face {
                            font-family: 'Graphik-Light';
                            src: url('${graphikEot}');
                            src: url('${graphikWoff}') format('woff'),
                                url('${graphikWoff2}') format('woff2'),
                                url('${graphikEot}') format('embedded-opentype');
                            font-display: fallback;
                        }
                    </style>`;

      if (context.url) {
        res.redirect(context.statusCode || HttpStatus.TemporaryRedirect, context.url);
      } else {
        const port = Number.parseInt(process.env.PORT || '', 10) || 3002;
        const html = `<!doctype html>
            <html ${helmet.htmlAttributes.toString()}>
                <head>
                    <meta charset="utf-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    ${assets.client.css ? `<noscript><link rel="stylesheet" href="${assets.client.css}"></noscript>` : ''}
                    ${helmet.title.toString()}
                    ${helmet.meta.toString()}
                    ${helmet.link.toString()}
                    ${styles}
                    ${fonts}
                    <link rel="preload" as="font" href="${graphikWoff2}" type="font/woff2" crossorigin />
                    <link rel="preload" as="font" href="${graphikWoff}" type="font/woff" crossorigin />
                    ${assets.manifest ? (process.env.NODE_ENV === 'production' ? `<script src="${assets.manifest.js}" defer></script>` : `<script src="${assets.manifest.js}" defer crossorigin></script>`) : ''}
                    ${assets.vendor ? (process.env.NODE_ENV === 'production' ? `<script src="${assets.vendor.js}" defer></script>` : `<script src="${assets.vendor.js}" defer crossorigin></script>`) : ''}
                    ${assets.client ? (process.env.NODE_ENV === 'production' ? `<script src="${assets.client.js}" defer></script>` : `<script src="${assets.client.js}" defer crossorigin></script>`) : ''}
                    ${'runtime~vendor' in assets ? (process.env.NODE_ENV === 'production' ? `<script src="${assets['runtime~vendor'].js}" defer></script>` : `<script src="${assets['runtime~vendor'].js}" defer crossorigin></script>`) : ''}
                    ${'runtime~client' in assets ? (process.env.NODE_ENV === 'production' ? `<script src="${assets['runtime~client'].js}" defer></script>` : `<script src="${assets['runtime~client'].js}" defer crossorigin></script>`) : ''}
                    <script type="application/javascript" async src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${process.env.KLAVIYO_KEY}"></script>
                    ${
                      global.__FAME_CONFIG__.GTM_CONTAINER
                        ? `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                                })(window,document,'script','dataLayer','${global.__FAME_CONFIG__.GTM_CONTAINER}');
                            </script>`
                        : ''
                    }
                    <script type="text/javascript">
                      window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=
                      d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
                      _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute("charset","utf-8");
                      $.src="https://v2.zopim.com/?2SdRnCDHEZAfsODofwYtmdcBHnrI7G2S";z.t=+new Date;$.
                      type="text/javascript";e.parentNode.insertBefore($,e)})(document,"script");
                    </script>
                </head>
                <body ${helmet.bodyAttributes.toString()}>
                    ${
                      global.__FAME_CONFIG__.GTM_CONTAINER
                        ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${global.__FAME_CONFIG__.GTM_CONTAINER}"
                            height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`
                        : ''
                    }
                    <div id="root">${reactApp}</div>
                    <div id="portal-root"></div>
                    <script>
                        window.dataLayer = [];
                        window.__FAME_CONFIG__ = ${serialize(global.__FAME_CONFIG__)};
                        window.__PRELOADED_STATE__ = ${serialize(finalState)};
                    </script>
                </body>
            </html>`;
        res.status(context.statusCode || HttpStatus.OK);
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 'no-cache');
        res.send(html);
      }
    } catch (e) {
      next(e);
    }
  })
  .use(Raven.errorHandler());

if (process.env.NODE_ENV === 'development') {
  // only use in development
  server.use(errorhandler());
}

export default server;
