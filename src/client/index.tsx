import Raven from 'raven-js';
import { setUpRaven } from '@common/utils/error-reporting';

import 'core-js/es6/promise';
import 'core-js/fn/object/entries';
import 'core-js/fn/object/values';

setUpRaven(Raven);

import '@common/assets/fonts/Graphik-Light-Web.woff';
import '@common/assets/fonts/Graphik-Light-Web.woff2';
import '@common/assets/fonts/Graphik-Light-Web.eot';

if (!global.Intl) {
    const promises: Array<Promise<any>> = [
        import(/* webpackChunkName: "polyfill-intl-es6" */ 'core-js/es6/object'),
        import(/* webpackChunkName: "polyfill-intl-es6" */ 'core-js/es6/array'),
        import(/* webpackChunkName: "polyfill-intl-es6" */ 'core-js/es7/array'),
        import(/* webpackChunkName: "polyfill-intl-es6" */ 'core-js/es7/object'),
        import(/* webpackChunkName: "polyfill-intl-es6" */ 'core-js/es6/string'),
        import(/* webpackChunkName: "polyfill-intl-es6" */ 'core-js/es6/map'),
        import(/* webpackChunkName: "polyfill-intl-es6" */ 'core-js/es6/set'),
        import(/* webpackChunkName: "polyfill-intl-es6" */ 'core-js/es6/promise'),
        import(/* webpackChunkName: "polyfill-intl-es6" */ 'intersection-observer'),
        import(/* webpackChunkName: "polyfill-intl-es6" */ 'intl')
            // .then(() => {
            //     return Promise.all(['en.js', 'en.json'].map((lang) => (
            //         import(
            //             /* webpackInclude: /\.js(on)?$/ */
            //             /* webpackExclude: /\.noimport\.js(on)?$/ */
            //             /* webpackChunkName: "polyfill-intl-es6" */
            //             /* webpackMode: "lazy-once" */
            //             `intl/locale-data/jsonp/${lang}`
            //         )
            //     )));
            // }),
    ];

    Promise.all(promises).then(() => require('@common/../client/main').default());

} else if (!('Promise' in window) || !('Symbol' in window) || !('includes' in Array.prototype)) {
    const promises = [
        import(/* webpackChunkName: "polyfill-es6" */ 'core-js/es6/object'),
        import(/* webpackChunkName: "polyfill-es6" */ 'core-js/es6/array'),
        import(/* webpackChunkName: "polyfill-es6" */ 'core-js/es7/array'),
        import(/* webpackChunkName: "polyfill-es6" */ 'core-js/es7/object'),
        import(/* webpackChunkName: "polyfill-es6" */ 'core-js/es6/string'),
        import(/* webpackChunkName: "polyfill-es6" */ 'core-js/es6/map'),
        import(/* webpackChunkName: "polyfill-es6" */ 'core-js/es6/set'),
        import(/* webpackChunkName: "polyfill-es6" */ 'core-js/es6/promise'),
        import(/* webpackChunkName: "polyfill-es6" */ 'intersection-observer'),
    ];

    Promise.all(promises).then(() => require('@common/../client/main').default());
} else if ((!('IntersectionObserver' in window))) {
    const promises = [
        import(/* webpackChunkName: "polyfill-intersection-obs" */ 'intersection-observer'),
    ];

    Promise.all(promises).then(() => require('@common/../client/main').default());
} else {
    require('@common/../client/main').default();
}

if (module.hot) {
    module.hot.accept();
}