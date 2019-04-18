import React from 'react';
import { RootDispatch, RootState } from '@common/rematch';
import Product, { preloadProductData } from '@containers/Product';

import { BASEURL_DRESS_SYSTEM_SEARCH, BASEURL_DRESS_FINDER, BASEURL_SEARCH, BASEURL_CATEGORY_PAGES, BASEURL_ACCOUNT, BASEURL_RETURNS } from '@common/utils/url-helper';
import CmsPage from '@containers/CmsPage';
import SearchPage from '@containers/SearchPage';
import DressFinder from '@containers/DressFinder';
import { SearchPageType } from '@containers/SearchPage/SearchPage';
import { RouteProps } from 'react-router';
import { DRESSFINDER_SEARCH_ARGS } from '@containers/DressFinder/DressFinder';
import Login from '@containers/Account/Login';
import Signup from '@containers/Account/Signup';
import Logout from '@containers/Account/Logout';
import ForgotPassword from '@containers/Account/ForgotPassword';
import ErrorPage from '@components/error-page/ErrorPage';
import Profile from '@containers/Account/Profile';
import CartOverview from '@containers/Cart';
import Orders from '@containers/Orders';
import ReturnConfirmation from '@containers/Orders/ReturnConfirmation';
import GuestReturn from '@containers/Orders/GuestReturn';
import ReturnReason from '@containers/Orders/ReturnReason';

export default [
    {
        exact: false,
        path: '/dresses/:slug(custom-dress[^\/]*|dress-[^\/]*)',
        component: Product,
        loadData: (dispatch: RootDispatch, getState: () => RootState, { slug }: any, url: string, cookies?: string) => preloadProductData(dispatch, getState, slug)
    },
    ...BASEURL_CATEGORY_PAGES.map((categoryPage) => (
        {
            exact: false,
            path: `${categoryPage}/:query?`,
            render: (props: RouteProps) => <SearchPage {...props} type={SearchPageType.CATEGORY_PAGE} />,
            loadData: (dispatch: RootDispatch, getState: () => RootState, { query }: any, url: string, cookies?: string) => (SearchPage as any).preloadData(url, SearchPageType.CATEGORY_PAGE, dispatch)
        }
    )),
    {
        exact: false,
        path: `${BASEURL_SEARCH}/:query?`,
        render: (props: RouteProps) => <SearchPage {...props} type={SearchPageType.SEARCH} />,
        loadData: (dispatch: RootDispatch, getState: () => RootState, { query }: any, url: string, cookies?: string) => (SearchPage as any).preloadData(url, SearchPageType.SEARCH, dispatch)
    },
    {
        exact: false,
        path: '/preview/:id',
        component: CmsPage,
        loadData: (dispatch: RootDispatch, getState: () => RootState, { id }: any, url: string, cookies?: string) => (CmsPage as any).loadCmsDataById(dispatch, id, (CmsPage as any).isPreview(url))
    },
    {
        exact: false,
        path: `${BASEURL_DRESS_SYSTEM_SEARCH}/:query?`,
        render: (props: RouteProps) => <SearchPage {...props} type={SearchPageType.CUSTOM_CLOTHING_SEARCH} />,
        loadData: (dispatch: RootDispatch, getState: () => RootState, { query }: any, url: string, cookies?: string) => (SearchPage as any).preloadData(url, SearchPageType.CUSTOM_CLOTHING_SEARCH, dispatch)
    },
    {
        exact: false,
        path: `${BASEURL_DRESS_FINDER}/:slug?/:components?`,
        component: DressFinder,
        loadData: (dispatch: RootDispatch, getState: () => RootState, { slug, components }: any, url: string, cookies?: string) => dispatch.SearchModel.loadDocumentAsync(DRESSFINDER_SEARCH_ARGS)
    },
    {
        exact: true,
        path: `${BASEURL_ACCOUNT}/login`,
        component: Login
    },
    {
        exact: true,
        path: `${BASEURL_ACCOUNT}/signup`,
        component: Signup
    },
    {
        exact: false,
        path: `${BASEURL_ACCOUNT}/forgot-password/:viewState?/:token?`,
        component: ForgotPassword,
    },
    {
        exact: false,
        path: `${BASEURL_ACCOUNT}/profile`,
        component: Profile,
    },
    {
        exact: true,
        path: '/logout',
        component: Logout,
    },
    {
        exact: true,
        path: '/unauthorized',
        render: () => <ErrorPage type={401} />
    },
    {
        exact: false,
        path: '/cart/:cartId?',
        component: CartOverview,
        loadData: (dispatch: RootDispatch, getState: () => RootState, { cartId }: any, url: string, cookies?: string) => dispatch.CartModel.restoreAbandonedCartAsync(cartId)
    },
    {
        exact: false,
        path: '/orders',
        component: Orders,
        loadData: (dispatch: RootDispatch, getState: () => RootState, { }: any, url: string, cookies?: string) => dispatch.OrdersModel.getOrders(cookies!),
    },
    {
        exact: false,
        path: `${BASEURL_RETURNS}/guest/:orderNumber?/:email?`,
        component: GuestReturn,
        // loadData: (dispatch: RootDispatch, getState: () => RootState, { orderNumber , email }: any, url: string, cookies?: string) => dispatch.OrdersModel.getGuestOrder({ orderNumber, email, cookies }),
    },
    {
        exact: false,
        path: `${BASEURL_RETURNS}/reason/:orderNumber/:email?`,
        component: ReturnReason,
        loadData: (dispatch: RootDispatch, getState: () => RootState, { orderNumber }: any, url: string, cookies?: string) => dispatch.OrdersModel.getOrder({ orderNumber, cookies }),
    },
    {
        exact: false,
        path: `${BASEURL_RETURNS}/:orderNumber/:returnRequestId?`,
        component: ReturnConfirmation,
        loadData: (dispatch: RootDispatch, getState: () => RootState, { orderNumber, returnRequestId }: any, url: string, cookies?: string) => dispatch.OrdersModel.getOrder({ orderNumber, cookies }),
    },
    {
        exact: false,
        path: '/:slug*',
        component: CmsPage,
        loadData: (dispatch: RootDispatch, getState: () => RootState, { slug, ignored }: any, url: string, cookies?: string) => (CmsPage as any).loadCmsDataBySlug(dispatch, slug, ignored, (CmsPage as any).isPreview(url))
    },
];
